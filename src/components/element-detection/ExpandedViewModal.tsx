'use client';

// Expanded View Modal Component
// Shows full-size images or JSON data

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Simple collapsible JSON viewer component
function JsonViewer({
  data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  name = 'root',
  depth = 0,
  globalCollapsed
}: {
  data: unknown;
  name?: string;
  depth?: number;
  globalCollapsed?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false); // Default all expanded

  // Update collapse state when global state changes
  useEffect(() => {
    if (globalCollapsed !== undefined) {
      setIsCollapsed(globalCollapsed);
    }
  }, [globalCollapsed]);

  if (data === null) return <span className="text-gray-500">null</span>;
  if (data === undefined) return <span className="text-gray-500">undefined</span>;

  const type = typeof data;

  if (type === 'string') {
    return <span className="text-green-400">&quot;{data as string}&quot;</span>;
  }

  if (type === 'number' || type === 'boolean') {
    return <span className="text-blue-400">{String(data)}</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-gray-400">[]</span>;

    return (
      <div className="inline">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-gray-300 cursor-pointer mr-1 font-bold"
        >
          {isCollapsed ? '+' : '−'}
        </button>
        <span className="text-gray-400">[{data.length}]</span>
        {!isCollapsed && (
          <div className="ml-4 border-l border-gray-700 pl-2">
            {data.map((item, index) => (
              <div key={index}>
                <span className="text-gray-500">{index}: </span>
                <JsonViewer data={item} name={String(index)} depth={depth + 1} globalCollapsed={globalCollapsed} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (type === 'object') {
    const objData = data as Record<string, unknown>;
    const keys = Object.keys(objData);
    if (keys.length === 0) return <span className="text-gray-400">{'{}'}</span>;

    return (
      <div className="inline">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-gray-300 cursor-pointer mr-1 font-bold"
        >
          {isCollapsed ? '+' : '−'}
        </button>
        <span className="text-gray-400">{'{}'} {keys.length}</span>
        {!isCollapsed && (
          <div className="ml-4 border-l border-gray-700 pl-2">
            {keys.map((key) => (
              <div key={key}>
                <span className="text-purple-400">{key}: </span>
                <JsonViewer data={objData[key]} name={key} depth={depth + 1} globalCollapsed={globalCollapsed} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <span>{String(data)}</span>;
}

interface ExpandedViewModalProps {
  scenarioId: string;
  filename: string;
  timestamp: number;
  onClose: () => void;
}

export default function ExpandedViewModal({
  scenarioId,
  filename,
  timestamp,
  onClose
}: ExpandedViewModalProps) {
  const [jsonData, setJsonData] = useState<unknown>(null);
  const [globalCollapsed, setGlobalCollapsed] = useState<boolean | undefined>(undefined);
  const isJson = filename === 'candidates.json';
  const url = `/api/scenarios/${scenarioId}/outputs/${filename}?t=${timestamp}`;

  useEffect(() => {
    if (isJson) {
      fetch(url)
        .then(r => r.json())
        .then(setJsonData)
        .catch(err => console.error('Failed to load JSON:', err));
    }
  }, [url, isJson]);

  return (
    <div
      className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-3"
      onClick={onClose}
    >
      <div
        className="bg-white rounded max-w-7xl w-full max-h-[96vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-3 py-2 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold">{filename}</h3>
            {isJson && (
              <div className="flex gap-1">
                <button
                  onClick={() => setGlobalCollapsed(false)}
                  className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Expand All
                </button>
                <button
                  onClick={() => setGlobalCollapsed(true)}
                  className="text-xs px-2 py-0.5 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Collapse All
                </button>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-gray-600 leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-3 bg-white">
          {isJson ? (
            <div className="bg-gray-900 p-2 rounded text-xs overflow-auto font-mono">
              {jsonData ? <JsonViewer data={jsonData} globalCollapsed={globalCollapsed} /> : <span className="text-gray-400">Loading...</span>}
            </div>
          ) : (
            <div className="relative w-full min-h-[400px]">
              <Image
                src={url}
                alt={filename}
                fill
                className="object-contain rounded"
                unoptimized
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
