// API endpoint to generate scenario outputs using Playwright
// POST /api/scenarios/{scenarioId}/generate-outputs

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { NextRequest, NextResponse } from 'next/server';

interface ProboLabsWindow extends Window {
  ProboLabs?: {
    ElementTag: Record<string, string>;
    highlight: {
      generateJSON: () => Promise<unknown>;
      execute: (elementTypes: string[]) => void;
      unexecute: () => void;
    };
    findElements: (elementType: string) => Promise<Array<{ element: Element; [key: string]: unknown }>>;
  };
}

declare let window: ProboLabsWindow;

interface CandidatesJson {
  viewport: {
    width: number;
    height: number;
    documentWidth: number;
    documentHeight: number;
    timestamp: string;
  };
  [key: string]: unknown;
}

export const maxDuration = 60;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ scenarioId: string }> }
) {
  const { scenarioId } = await params;
  const cacheDir = process.env.SCENARIO_CACHE_DIR || '.cache/scenarios';
  const scenarioDir = join(process.cwd(), cacheDir, scenarioId);

  // Parse request body to check if we should force regeneration
  const body = await request.json().catch(() => ({}));
  const forceRegenerate = body.forceRegenerate === true;

  try {
    // Check if cache exists (all required files)
    if (!forceRegenerate) {
      const requiredFiles = [
        'metadata.json',
        'base.png',
        'clickable.png',
        'fillable.png',
        'selectable.png',
        'non-interactive.png',
        'candidates.json'
      ];

      const { existsSync, statSync } = await import('fs');
      const allFilesExist = requiredFiles.every(file =>
        existsSync(join(scenarioDir, file))
      );

      if (allFilesExist) {
        // Cache exists - return cached metadata
        const metadataPath = join(scenarioDir, 'metadata.json');
        const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
        const stats = statSync(metadataPath);

        return NextResponse.json({
          success: true,
          scenarioId,
          cached: true,
          ...metadata,
          generatedAt: stats.mtime.getTime() // Use filesystem timestamp
        });
      }
    }

    // Create cache directory
    mkdirSync(scenarioDir, { recursive: true });

    // Load highlighter script
    const scriptPath = process.env.HIGHLIGHTER_SCRIPT_PATH!;
    if (!scriptPath) {
      return NextResponse.json(
        { error: 'HIGHLIGHTER_SCRIPT_PATH not configured in .env' },
        { status: 500 }
      );
    }

    const highlighterScript = readFileSync(resolve(scriptPath), 'utf8');

    // Launch browser
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 }
    });

    // Navigate to scenario page - check if pageUrl is provided in body, otherwise use default
    const requestUrl = new URL(request.url);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
    const scenarioUrl = body.pageUrl || `${baseUrl}/element-detection/${scenarioId}`;

    console.log(`[Generate Outputs] Navigating to: ${scenarioUrl}`);

    const response = await page.goto(scenarioUrl, { waitUntil: 'networkidle' });

    if (!response || response.status() === 404) {
      await browser.close();
      return NextResponse.json(
        { error: `Scenario page not found: ${scenarioUrl}. Status: ${response?.status()}` },
        { status: 404 }
      );
    }

    console.log(`[Generate Outputs] Page loaded with status: ${response.status()}`);

    // Inject highlighter script
    await page.evaluate(highlighterScript);

    // Wait for ProboLabs to be available
    await page.waitForFunction(() => {
      return typeof window.ProboLabs?.highlight?.generateJSON === 'function';
    }, { timeout: 5000 });

    // Generate JSON - need to handle this differently because generateJSON has issues with React elements
    // Get the raw data first, then manually serialize
    const candidatesJson = await page.evaluate(async (): Promise<CandidatesJson> => {
      const json: CandidatesJson = {
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          documentWidth: document.documentElement.clientWidth,
          documentHeight: document.documentElement.clientHeight,
          timestamp: new Date().toISOString()
        }
      };

      const ElementTag = window.ProboLabs!.ElementTag;
      for (const elementType of Object.values(ElementTag)) {
        const elements = await window.ProboLabs!.findElements(elementType);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        json[elementType as string] = elements.map(({ element: _, ...rest }) => rest);
      }

      return json;
    });

    // Save candidates JSON
    writeFileSync(
      join(scenarioDir, 'candidates.json'),
      JSON.stringify(candidatesJson, null, 2),
      'utf8'
    );

    // Take base screenshot (no highlights)
    await page.screenshot({
      path: join(scenarioDir, 'base.png'),
      fullPage: true
    });

    // Take highlighted screenshots for each element type
    const elementTypes = [
      { type: 'CLICKABLE', file: 'clickable.png' },
      { type: 'FILLABLE', file: 'fillable.png' },
      { type: 'SELECTABLE', file: 'selectable.png' },
      { type: 'NON_INTERACTIVE_ELEMENT', file: 'non-interactive.png' },
    ];

    for (const { type, file } of elementTypes) {
      await page.evaluate((elementType) => {
        window.ProboLabs!.highlight.execute([elementType]);
      }, type);

      await page.screenshot({
        path: join(scenarioDir, file),
        fullPage: true
      });

      await page.evaluate(() => {
        window.ProboLabs!.highlight.unexecute();
      });
    }

    await browser.close();

    const stats = {
      clickableCount: (candidatesJson.CLICKABLE as unknown[])?.length || 0,
      fillableCount: (candidatesJson.FILLABLE as unknown[])?.length || 0,
      selectableCount: (candidatesJson.SELECTABLE as unknown[])?.length || 0,
      nonInteractiveCount: (candidatesJson.NON_INTERACTIVE_ELEMENT as unknown[])?.length || 0,
    };

    // Save metadata
    const metadata = {
      generatedAt: Date.now(),
      stats
    };

    writeFileSync(
      join(scenarioDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2),
      'utf8'
    );

    return NextResponse.json({
      success: true,
      scenarioId,
      ...metadata
    });

  } catch (error) {
    console.error('Failed to generate outputs:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate outputs',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
