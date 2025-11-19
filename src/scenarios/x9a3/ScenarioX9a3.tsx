import { useState, useEffect, useRef } from 'react';
import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

interface DropdownConfig {
  id: string;
  label: string;
  hasWhitespace: boolean;
  hasPadding: boolean;
  fullWidth: boolean;
  hasCursor: boolean;
  hasReactHandler: boolean;
  hasInlineHandler: boolean;
  hasAddEventListener: boolean;
  hasCaret: boolean;
  multipleElements?: boolean;
  differentHandlers?: boolean;
}

interface DropdownCellProps {
  config: DropdownConfig;
  onAction: (action: 'CLICK' | 'FILL' | 'SELECT', element: string) => void;
}

function DropdownCell({ config, onAction }: DropdownCellProps) {
  const { handleButtonClick } = useInteractionHandlers(onAction);
  const containerRef = useRef<HTMLDivElement>(null);
  const secondElementRef = useRef<HTMLDivElement>(null);
  
  const {
    id,
    label,
    hasWhitespace,
    hasPadding,
    fullWidth,
    hasCursor,
    hasReactHandler,
    hasInlineHandler,
    hasAddEventListener,
    hasCaret,
    multipleElements,
    differentHandlers
  } = config;

  const containerId = `dropdown-${id}-container`;
  const clickableId = `dropdown-${id}-clickable`;

  const handleClick = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    handleButtonClick(e, elementId);
  };

  // Setup addEventListener if needed (for container)
  useEffect(() => {
    if (hasAddEventListener && containerRef.current && !multipleElements) {
      const handler = (e: Event) => {
        e.preventDefault();
        handleButtonClick(e as unknown as React.MouseEvent, clickableId);
      };
      containerRef.current.addEventListener('click', handler);
      return () => {
        containerRef.current?.removeEventListener('click', handler);
      };
    }
  }, [hasAddEventListener, clickableId, handleButtonClick, multipleElements]);

  // Setup addEventListener for second element when differentHandlers is true
  useEffect(() => {
    if (differentHandlers && hasAddEventListener && secondElementRef.current) {
      const handler = (e: Event) => {
        e.preventDefault();
        handleButtonClick(e as unknown as React.MouseEvent, `${clickableId}-2`);
      };
      secondElementRef.current.addEventListener('click', handler);
      return () => {
        secondElementRef.current?.removeEventListener('click', handler);
      };
    }
  }, [differentHandlers, hasAddEventListener, clickableId, handleButtonClick]);

  const paddingStyle = hasPadding ? { padding: '10px 12px' } : {};
  const cursorStyle = hasCursor ? { cursor: 'pointer' } : {};
  // For multiple elements, always use flex: 1 so they sum to parent exactly
  const flexStyle = multipleElements 
    ? { flex: 1 } 
    : (fullWidth ? { flex: 1 } : { flexShrink: 0 });

  const reactHandler = hasReactHandler ? (e: React.MouseEvent) => handleClick(e, clickableId) : undefined;

  const iconSvg = (
    <svg
      className="infinity-icon"
      viewBox="0 0 16 16"
      fill="#7C7C7C"
      height="16"
      width="16"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path
        fill="#7C7C7C"
        d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"
      ></path>
      <path
        fill="#7C7C7C"
        d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"
      ></path>
    </svg>
  );

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-expanded="false"
      className={`ui selection dropdown cp-select default ${multipleElements ? 'has-multiple-children' : ''}`}
      tabIndex={0}
      id={containerId}
    >
      {hasWhitespace && '   '}
      {multipleElements ? (
        <>
          <div
            className={`divider text ${fullWidth ? 'full-width' : ''}`}
            onClick={reactHandler}
            style={{ ...cursorStyle, ...paddingStyle, ...flexStyle }}
            id={clickableId}
          >
            {iconSvg}
            <span>{label} 1</span>
          </div>
          <div
            ref={secondElementRef}
            className={`divider text ${fullWidth ? 'full-width' : ''}`}
            onClick={differentHandlers ? undefined : reactHandler}
            style={{ ...cursorStyle, ...paddingStyle, ...flexStyle }}
            id={`${clickableId}-2`}
          >
            {iconSvg}
            <span>{label} 2</span>
          </div>
        </>
      ) : (
        <div
          className={`divider text ${fullWidth ? 'full-width' : ''}`}
          onClick={reactHandler}
          style={{ ...cursorStyle, ...paddingStyle, ...flexStyle }}
          id={clickableId}
        >
          {iconSvg}
          <span>{label}</span>
        </div>
      )}
      {hasCaret && (
        <svg
          className="infinity-icon caret icon"
          focusable={false}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          color="#666"
          height="16"
          width="16"
          viewBox="0 0 16 16"
          style={{ transform: 'rotate(90deg)', display: 'inline-block', color: '#666', marginLeft: 'auto', flexShrink: 0 }}
          id={`caret-${id}`}
        >
          <polygon fill="currentColor" points="10 8 6 4 6 12 10 8"></polygon>
        </svg>
      )}
      <div className="menu transition sf-hidden"></div>
    </div>
  );
}

export default function ScenarioX9a3({ onAction }: ScenarioProps) {
  const [clicked, setClicked] = useState<Record<string, boolean>>({});

  // Define all dropdown configurations
  const dropdownConfigs: DropdownConfig[] = [
    // Row 1: Single element - whitespace variations
    { id: '1', label: 'Full-width', hasWhitespace: true, hasPadding: true, fullWidth: true, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    { id: '2', label: 'Full-width', hasWhitespace: false, hasPadding: true, fullWidth: true, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    { id: '3', label: 'Partial-width', hasWhitespace: true, hasPadding: true, fullWidth: false, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    { id: '4', label: 'Partial-width', hasWhitespace: false, hasPadding: true, fullWidth: false, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    
    // Row 2: Single element - padding variations
    { id: '5', label: 'Full-width', hasWhitespace: false, hasPadding: true, fullWidth: true, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    { id: '6', label: 'Full-width', hasWhitespace: false, hasPadding: false, fullWidth: true, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    { id: '7', label: 'Partial-width', hasWhitespace: false, hasPadding: true, fullWidth: false, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    { id: '8', label: 'Partial-width', hasWhitespace: false, hasPadding: false, fullWidth: false, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    
    // Row 3: Whitespace + padding combinations
    { id: '9', label: 'WS+P', hasWhitespace: true, hasPadding: true, fullWidth: true, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    { id: '10', label: 'WS+NP', hasWhitespace: true, hasPadding: false, fullWidth: true, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    { id: '11', label: 'NWS+P', hasWhitespace: false, hasPadding: true, fullWidth: true, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    { id: '12', label: 'NWS+NP', hasWhitespace: false, hasPadding: false, fullWidth: true, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    
    // Row 4: Multiple elements - whitespace variations
    { id: '13', label: 'Two same handlers', hasWhitespace: true, hasPadding: true, fullWidth: false, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false, multipleElements: true, differentHandlers: false },
    { id: '14', label: 'Two same handlers', hasWhitespace: false, hasPadding: true, fullWidth: false, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false, multipleElements: true, differentHandlers: false },
    { id: '15', label: 'Two different handlers', hasWhitespace: true, hasPadding: true, fullWidth: false, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: true, hasCaret: false, multipleElements: true, differentHandlers: true },
    { id: '16', label: 'Two different handlers', hasWhitespace: false, hasPadding: true, fullWidth: false, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: true, hasCaret: false, multipleElements: true, differentHandlers: true },
    
    // Row 5: Handler type variations
    { id: '17', label: 'React', hasWhitespace: true, hasPadding: true, fullWidth: true, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    { id: '18', label: 'Inline', hasWhitespace: true, hasPadding: true, fullWidth: true, hasCursor: true, hasReactHandler: false, hasInlineHandler: true, hasAddEventListener: false, hasCaret: false },
    { id: '19', label: 'addEL', hasWhitespace: true, hasPadding: true, fullWidth: true, hasCursor: true, hasReactHandler: false, hasInlineHandler: false, hasAddEventListener: true, hasCaret: false },
    { id: '20', label: 'React+EL', hasWhitespace: true, hasPadding: true, fullWidth: true, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: true, hasCaret: false },
    
    // Row 6: Cursor variations
    { id: '21', label: 'No cursor', hasWhitespace: true, hasPadding: true, fullWidth: true, hasCursor: false, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    { id: '22', label: 'Cursor only', hasWhitespace: true, hasPadding: true, fullWidth: true, hasCursor: true, hasReactHandler: false, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    { id: '23', label: 'Handler only', hasWhitespace: true, hasPadding: true, fullWidth: true, hasCursor: false, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    { id: '24', label: 'Both', hasWhitespace: true, hasPadding: true, fullWidth: true, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    
    // Row 7: With caret variations
    { id: '25', label: 'With caret', hasWhitespace: true, hasPadding: true, fullWidth: false, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: true },
    { id: '26', label: 'With caret', hasWhitespace: false, hasPadding: true, fullWidth: false, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: true },
    { id: '27', label: 'No caret', hasWhitespace: true, hasPadding: true, fullWidth: true, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    { id: '28', label: 'No caret', hasWhitespace: false, hasPadding: true, fullWidth: true, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    
    // Row 8: Complex combinations
    { id: '29', label: 'Complex 1', hasWhitespace: true, hasPadding: true, fullWidth: false, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: true },
    { id: '30', label: 'Complex 2', hasWhitespace: false, hasPadding: false, fullWidth: true, hasCursor: false, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: false, hasCaret: false },
    { id: '31', label: 'Complex 3', hasWhitespace: true, hasPadding: false, fullWidth: true, hasCursor: true, hasReactHandler: false, hasInlineHandler: true, hasAddEventListener: false, hasCaret: false },
    { id: '32', label: 'Complex 4', hasWhitespace: false, hasPadding: true, fullWidth: false, hasCursor: true, hasReactHandler: true, hasInlineHandler: false, hasAddEventListener: true, hasCaret: true },
  ];

  return (
    <>
      <style jsx>{`
        .practice {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          min-height: 100vh;
          padding: 20px;
          background: #f5f5f5;
        }

        .table-container {
          max-width: 1400px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .variations-table {
          width: 100%;
          border-collapse: collapse;
        }

        .variations-table td {
          padding: 15px;
          border: 1px solid #e0e0e0;
          vertical-align: top;
        }

        .variations-table th {
          padding: 10px;
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 600;
          color: #666;
        }

        .cell-label {
          font-size: 0.7rem;
          color: #999;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .ui.selection.dropdown.cp-select.default {
          position: relative;
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: default;
          min-width: 180px;
        }

        .divider.text {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .divider.text.full-width {
          flex: 1;
        }

        /* Multiple children should sum to parent exactly - add visual separator */
        .ui.selection.dropdown.cp-select.default.has-multiple-children > .divider.text:first-of-type {
          border-right: 1px solid #e0e0e0;
        }

        .divider.text:hover {
          background: #f0f0f0;
        }

        .divider.text svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          display: inline-block;
          vertical-align: middle;
        }

        .divider.text span {
          color: #7c7c7c;
          font-size: 14px;
          display: inline-block;
          vertical-align: middle;
        }

        .ui.selection.dropdown.cp-select.default svg.infinity-icon.caret.icon {
          padding: 0 12px;
          flex-shrink: 0;
          width: 16px !important;
          height: 16px !important;
          display: inline-block !important;
          visibility: visible !important;
          opacity: 1 !important;
          color: #666 !important;
          overflow: visible !important;
          margin-left: auto;
        }
        
        .ui.selection.dropdown.cp-select.default svg.infinity-icon.caret.icon polygon {
          fill: currentColor !important;
        }

        .ui.selection.dropdown.cp-select.default svg.infinity-icon.caret.icon:hover {
          color: #333 !important;
        }

        .menu.transition.sf-hidden {
          display: none;
        }
      `}</style>

      <div className="practice">
        <div className="table-container">
          <h1 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Uniquify Test Variations</h1>
          <table className="variations-table">
            <thead>
              <tr>
                <th>Col 1</th>
                <th>Col 2</th>
                <th>Col 3</th>
                <th>Col 4</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(row => (
                <tr key={row}>
                  {[0, 1, 2, 3].map(col => {
                    const configIndex = row * 4 + col;
                    const config = dropdownConfigs[configIndex];
                    if (!config) return <td key={col}></td>;
                    return (
                      <td key={col}>
                        <div className="cell-label">
                          {config.id}. {config.label}
                          {config.hasWhitespace && ' (WS)'}
                          {config.hasPadding && ' (P)'}
                          {config.fullWidth && ' (FW)'}
                          {!config.hasCursor && ' (NC)'}
                          {config.hasCaret && ' (C)'}
                          {config.multipleElements && ' (2x)'}
                        </div>
                        <DropdownCell config={config} onAction={onAction} />
                        {clicked[config.id] && <div style={{ color: 'green', fontSize: '0.8em', marginTop: '5px' }}>Clicked!</div>}
                        {clicked[`caret-${config.id}`] && <div style={{ color: 'blue', fontSize: '0.8em', marginTop: '5px' }}>Caret Clicked!</div>}
                        {clicked[`clickable-child-${config.id}-1`] && <div style={{ color: 'purple', fontSize: '0.8em', marginTop: '5px' }}>Child 1 Clicked!</div>}
                        {clicked[`clickable-child-${config.id}-2`] && <div style={{ color: 'orange', fontSize: '0.8em', marginTop: '5px' }}>Child 2 Clicked!</div>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Legend */}
          <div style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '15px', color: '#333' }}>Legend</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.9rem' }}>
              <div>
                <strong style={{ color: '#666' }}>Abbreviations:</strong>
                <ul style={{ marginTop: '8px', marginLeft: '20px', lineHeight: '1.8' }}>
                  <li><strong>WS</strong> = With Whitespace (parent has whitespace-only text node)</li>
                  <li><strong>P</strong> = With Padding (element has padding: 10px 12px)</li>
                  <li><strong>FW</strong> = Full Width (element uses flex: 1, expands to fill space)</li>
                  <li><strong>NC</strong> = No Cursor (no cursor: pointer style)</li>
                  <li><strong>C</strong> = With Caret (has caret SVG icon)</li>
                  <li><strong>2x</strong> = Multiple Elements (two clickable children)</li>
                  <li><strong>Two same handlers</strong> = Both elements use React onClick handler</li>
                  <li><strong>Two different handlers</strong> = First element uses React onClick, second uses addEventListener</li>
                </ul>
              </div>
              <div>
                <strong style={{ color: '#666' }}>Handler Types:</strong>
                <ul style={{ marginTop: '8px', marginLeft: '20px', lineHeight: '1.8' }}>
                  <li><strong>React Handler</strong> = onClick via React (detectable via __reactFiber?.memoizedProps?.onClick)</li>
                  <li><strong>Inline Handler</strong> = onclick attribute in HTML</li>
                  <li><strong>addEventListener</strong> = Programmatically attached via addEventListener</li>
                  <li><strong>No Handler</strong> = No event handlers attached</li>
                </ul>
              </div>
              <div>
                <strong style={{ color: '#666' }}>Coverage Types:</strong>
                <ul style={{ marginTop: '8px', marginLeft: '20px', lineHeight: '1.8' }}>
                  <li><strong>Full-width</strong> = Clickable area expands to fill entire parent (flex: 1)</li>
                  <li><strong>Partial-width</strong> = Clickable area only covers content (flex-shrink: 0)</li>
                  <li><strong>With caret</strong> = Non-clickable whitespace between text and caret arrow</li>
                </ul>
              </div>
              <div>
                <strong style={{ color: '#666' }}>Uniquify Testing:</strong>
                <ul style={{ marginTop: '8px', marginLeft: '20px', lineHeight: '1.8' }}>
                  <li>Tests how uniquify handles parent-child relationships</li>
                  <li>Whitespace-only parents should be filtered as framework containers</li>
                  <li>Nested elements evaluated by shouldKeepNestedElement logic</li>
                  <li>cursor: pointer marks clickability for detection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

