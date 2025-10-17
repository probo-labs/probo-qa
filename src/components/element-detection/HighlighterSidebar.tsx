'use client';

// Highlighter Sidebar Component
// Displays thumbnails of highlighter outputs (screenshots + JSON)

import { useState } from 'react';
import ExpandedViewModal from './ExpandedViewModal';

interface HighlighterSidebarProps {
  scenarioId: string;
  isOpen: boolean;
  metadata: {
    generatedAt: number;
    stats: {
      clickableCount: number;
      fillableCount: number;
      selectableCount: number;
      nonInteractiveCount: number;
    };
  } | null;
  onClose: () => void;
  onRegenerate: () => void;
}

export default function HighlighterSidebar({
  scenarioId,
  isOpen,
  metadata,
  onClose,
  onRegenerate
}: HighlighterSidebarProps) {
  const [expandedView, setExpandedView] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (!metadata) return null;

  // Simple filenames without timestamps
  const imageUrl = (filename: string) =>
    `/api/scenarios/${scenarioId}/outputs/${filename}?t=${metadata.generatedAt}`;

  // Calculate how long ago the outputs were generated
  const timeAgo = () => {
    const now = Date.now();
    const diff = now - metadata.generatedAt;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await onRegenerate();
    } catch (err) {
      console.error('Failed to regenerate outputs:', err);
      alert('Failed to regenerate outputs. Check console for details.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
          fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-[60]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="p-3 border-b bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs">
              Cached • {timeAgo()}
            </span>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-lg leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-3 bg-blue-50 border-b text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">CLICKABLE:</span>
            <span className="font-mono font-bold">{metadata.stats.clickableCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">FILLABLE:</span>
            <span className="font-mono font-bold">{metadata.stats.fillableCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">SELECTABLE:</span>
            <span className="font-mono font-bold">{metadata.stats.selectableCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">NON-INTERACTIVE:</span>
            <span className="font-mono font-bold">{metadata.stats.nonInteractiveCount}</span>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        <div className="p-3 space-y-2 overflow-y-auto h-[calc(100vh-220px)]">
          <Thumbnail
            label="Base (no highlights)"
            src={imageUrl('base.png')}
            onClick={() => setExpandedView('base.png')}
          />

          <Thumbnail
            label={`Clickable (${metadata.stats.clickableCount})`}
            src={imageUrl('clickable.png')}
            onClick={() => setExpandedView('clickable.png')}
          />

          <Thumbnail
            label={`Fillable (${metadata.stats.fillableCount})`}
            src={imageUrl('fillable.png')}
            onClick={() => setExpandedView('fillable.png')}
          />

          <Thumbnail
            label={`Selectable (${metadata.stats.selectableCount})`}
            src={imageUrl('selectable.png')}
            onClick={() => setExpandedView('selectable.png')}
          />

          <Thumbnail
            label={`Non-Interactive (${metadata.stats.nonInteractiveCount})`}
            src={imageUrl('non-interactive.png')}
            onClick={() => setExpandedView('non-interactive.png')}
          />

          {/* JSON Link */}
          <div
            className="border rounded p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setExpandedView('candidates.json')}
          >
            <div className="text-xs font-medium text-gray-900">📄 Candidates JSON</div>
            <div className="text-xs text-gray-500 mt-1">Click to view full data</div>
          </div>
        </div>

        {/* Footer - Regenerate Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gray-50 border-t">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="w-full text-blue-600 bg-white hover:bg-blue-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed px-3 py-2 rounded border border-blue-200 text-sm font-medium transition-colors"
            title="Rerun highlighter to regenerate all outputs"
          >
            {isRegenerating ? 'Highlighting...' : '↻ Rerun Highlighter'}
          </button>
        </div>
      </div>

      {/* Expanded Modal */}
      {expandedView && (
        <ExpandedViewModal
          scenarioId={scenarioId}
          filename={expandedView}
          timestamp={metadata.generatedAt}
          onClose={() => setExpandedView(null)}
        />
      )}
    </>
  );
}

// Thumbnail Component
function Thumbnail({
  label,
  src,
  onClick
}: {
  label: string;
  src: string;
  onClick: () => void;
}) {
  return (
    <div
      className="border rounded overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <img
        src={src}
        alt={label}
        className="w-full h-24 object-cover bg-gray-100"
      />
      <div className="p-2 text-xs font-medium bg-white border-t">{label}</div>
    </div>
  );
}
