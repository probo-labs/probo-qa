// API endpoint to generate scenario outputs using Playwright
// POST /api/scenarios/{scenarioId}/generate-outputs

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60; // 60 seconds timeout for Playwright operations

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ scenarioId: string }> }
) {
  const { scenarioId } = await params;
  const cacheDir = process.env.SCENARIO_CACHE_DIR || '.cache/scenarios';
  const scenarioDir = join(process.cwd(), cacheDir, scenarioId);

  try {
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

    // Navigate to scenario page - use request URL to detect host and port
    const requestUrl = new URL(request.url);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
    const scenarioUrl = `${baseUrl}/element-detection/${scenarioId}`;

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
      return typeof (window as any).ProboLabs?.highlight?.generateJSON === 'function';
    }, { timeout: 5000 });

    // Generate JSON - need to handle this differently because generateJSON has issues with React elements
    // Get the raw data first, then manually serialize
    const candidatesJson = await page.evaluate(async () => {
      const json: any = {};

      // Capture viewport
      json.viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
        documentWidth: document.documentElement.clientWidth,
        documentHeight: document.documentElement.clientHeight,
        timestamp: new Date().toISOString()
      };

      // Get elements for each type and strip the 'element' property
      const ElementTag = (window as any).ProboLabs.ElementTag;
      for (const elementType of Object.values(ElementTag)) {
        const elements = await (window as any).ProboLabs.findElements(elementType);
        // Strip out the 'element' property which causes circular reference issues
        json[elementType as string] = elements.map(({element, ...rest}: any) => rest);
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
      // Highlight elements of this type
      await page.evaluate((elementType) => {
        (window as any).ProboLabs.highlight.execute([elementType]);
      }, type);

      // Take screenshot
      await page.screenshot({
        path: join(scenarioDir, file),
        fullPage: true
      });

      // Remove highlights
      await page.evaluate(() => {
        (window as any).ProboLabs.highlight.unexecute();
      });
    }

    await browser.close();

    // Calculate stats
    const stats = {
      clickableCount: candidatesJson.CLICKABLE?.length || 0,
      fillableCount: candidatesJson.FILLABLE?.length || 0,
      selectableCount: candidatesJson.SELECTABLE?.length || 0,
      nonInteractiveCount: candidatesJson.NON_INTERACTIVE_ELEMENT?.length || 0,
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
