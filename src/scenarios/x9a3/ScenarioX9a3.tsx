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
  containerStyle?: React.CSSProperties;
}

function DropdownCell({ config, onAction, containerStyle }: DropdownCellProps) {
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

  const reactHandler = hasReactHandler ? (e: React.MouseEvent) => handleClick(e, clickableId) : undefined;
  const cursorStyle = hasCursor ? { cursor: 'pointer' } : {};
  const paddingStyle = hasPadding ? { padding: '10px 12px' } : {};
  
  // Flex style: when caret present, don't expand. When no caret and fullWidth, expand.
  const flexStyle = multipleElements 
    ? { flex: 1 } 
    : (hasCaret ? {} : (fullWidth ? { flex: 1 } : {}));

  // Icon SVG - matches reference exactly
  const iconSvg = (
    <svg
      className="infinity-icon"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      fill="#7C7C7C"
      color="#7C7C7C"
      height="16"
      width="16"
      viewBox="0 0 16 16"
      transform="rotate(0)"
      style={{ backgroundColor: '#f5deb3' }}
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

  // Caret SVG - matches reference exactly
  const caretSvg = hasCaret ? (
    <svg
      className="infinity-icon caret icon"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      icon-name="caret down"
      color="inherit"
      height="16"
      width="16"
      viewBox="0 0 16 16"
      transform="rotate(90)"
      style={{ backgroundColor: '#d3d3d3' }}
    >
      <polygon fill="currentColor" points="10 8 6 4 6 12 10 8"></polygon>
    </svg>
  ) : null;

  // EXACT structure from reference - reuse full outer structure, variations only in listbox
  return (
    <div className="header clickable" style={containerStyle || {}}>
      <svg
        className="infinity-icon"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        icon-name="api protection"
        color="inherit"
        height="16"
        width="16"
        alt=""
        viewBox="0 0 16 16"
        transform="rotate(0)"
        style={{ backgroundColor: '#e6e6fa' }}
      >
        <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
          <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
          <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
          <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
          <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
          <polygon points="8,16 1,14 1,5 8,7 "></polygon>
          <polygon points="9,16 16,14 16,5 9,7 "></polygon>
        </g>
      </svg>
      <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
      <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
        {/* VARIATIONS HAPPEN ONLY INSIDE THIS div role="listbox" */}
        <div
          ref={containerRef}
          role="listbox"
          aria-expanded="false"
          className={`ui selection dropdown cp-select default ${multipleElements ? 'has-multiple-children' : ''}`}
          tabIndex={0}
          id={containerId}
          style={{ backgroundColor: '#f0fff0' }}
        >
          {hasWhitespace && '   '}
          {multipleElements ? (
            <>
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className={`divider text ${fullWidth && !hasCaret ? 'full-width' : ''}`}
                onClick={reactHandler}
                style={{ ...cursorStyle, ...paddingStyle, ...flexStyle, backgroundColor: '#fff5ee' }}
                id={clickableId}
              >
                {iconSvg}
                <span style={{ backgroundColor: '#ffe4b5' }}>{label} 1</span>
              </div>
              <div
                ref={secondElementRef}
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className={`divider text ${fullWidth && !hasCaret ? 'full-width' : ''}`}
                onClick={differentHandlers ? undefined : reactHandler}
                style={{ ...cursorStyle, ...paddingStyle, ...flexStyle, backgroundColor: '#f5f5dc' }}
                id={`${clickableId}-2`}
              >
                {iconSvg}
                <span style={{ backgroundColor: '#ffe4b5' }}>{label} 2</span>
              </div>
            </>
          ) : (
            <div
              aria-atomic="true"
              aria-live="polite"
              role="alert"
              className={`divider text ${fullWidth && !hasCaret ? 'full-width' : ''}`}
              onClick={reactHandler}
              style={{ ...cursorStyle, ...paddingStyle, ...flexStyle, backgroundColor: '#fff5ee' }}
              id={clickableId}
            >
              {iconSvg}
              <span style={{ backgroundColor: '#ffe4b5' }}>{label}</span>
            </div>
          )}
          {caretSvg}
          <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
        </div>
      </div>
      <div
        className="collapse-indicator"
        onClick={(e) => {
          e.preventDefault();
          handleButtonClick(e, `collapse-indicator-${id}`);
        }}
        style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
      >
        <svg
          className="infinity-icon"
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          icon-name="chevron down"
          color="inherit"
          height="16"
          width="16"
          alt=""
          viewBox="0 0 9 9"
          transform="rotate(0)"
          style={{ backgroundColor: '#e0ffff' }}
        >
          <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
        </svg>
      </div>
    </div>
  );
}

export default function ScenarioX9a3({ onAction }: ScenarioProps) {
  const { handleButtonClick } = useInteractionHandlers(onAction);
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

        /* CSS for reference structure */
        .header.clickable {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          min-width: 0;
        }

        .header.clickable h2 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .header.clickable .control {
          margin-left: auto;
          flex: 1;
          min-width: 0;
        }

        /* Base styles for infinity-icon SVGs */
        .infinity-icon {
          width: 16px;
          height: 16px;
          display: inline-block;
          vertical-align: middle;
        }

        /* EXACT CSS from reference - parent flex container */
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
          width: 100%;
          max-width: 100%;
        }

        /* EXACT CSS from reference - clickable div */
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

        /* Multiple children should sum to parent exactly */
        .ui.selection.dropdown.cp-select.default.has-multiple-children > .divider.text:first-of-type {
          border-right: 1px solid #e0e0e0;
        }

        .divider.text:hover {
          background: #f0f0f0;
        }

        .divider.text svg {
          width: 16px;
          height: 16px;
          cursor: inherit;
        }

        .divider.text span {
          color: #7c7c7c;
          font-size: 14px;
        }

        /* EXACT CSS from reference - caret (sibling, not child) */
        .ui.selection.dropdown.cp-select.default svg.infinity-icon.caret.icon {
          padding: 0 12px;
          margin-left: auto;
          flex-shrink: 0;
        }

        .menu.transition.sf-hidden {
          display: none;
        }
      `}</style>

      <div className="practice">
        {/* EXACT COPY OF REFERENCE */}
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'reference-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Disabled</span>
              </div>
              <svg
                className="infinity-icon caret icon"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                icon-name="caret down"
                color="inherit"
                height="16"
                width="16"
                alt=""
                viewBox="0 0 16 16"
                transform="rotate(90)"
                style={{ backgroundColor: '#d3d3d3' }}
              >
                <polygon fill="currentColor" points="10 8 6 4 6 12 10 8"></polygon>
              </svg>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'reference-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        <h1 style={{ marginBottom: '20px', fontSize: '1.5rem', marginTop: '40px' }}>Uniquify Test Variations</h1>
        
        {/* Table of Contents */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          background: '#f8f9fa', 
          borderRadius: '8px', 
          border: '1px solid #e0e0e0',
          position: 'sticky',
          top: '20px',
          zIndex: 100
        }}>
          <h2 style={{ fontSize: '0.9rem', marginBottom: '8px', color: '#333' }}>Table of Contents</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '4px', fontSize: '0.75rem' }}>
            {dropdownConfigs.map(config => (
              <a
                key={config.id}
                href={`#variant-${config.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`variant-${config.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                style={{
                  color: '#0066cc',
                  textDecoration: 'none',
                  padding: '2px 4px',
                  borderRadius: '2px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8f4f8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {config.id}. {config.label}
                {config.hasWhitespace && ' (WS)'}
                {config.hasPadding && ' (P)'}
                {config.fullWidth && ' (FW)'}
                {!config.hasCursor && ' (NC)'}
                {config.hasCaret && ' (C)'}
                {config.multipleElements && ' (2x)'}
              </a>
            ))}
          </div>
        </div>

        {/* VARIANT 1 - Based on Duplicate B with variant-specific changes */}
        <div id="variant-1" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          1. Full-width (WS) (P) (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              {'   '}
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text full-width"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-1-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Full-width</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-1-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 2 - Full-width, no whitespace, has padding, no caret */}
        <div id="variant-2" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          2. Full-width (P) (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text full-width"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-2-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Full-width</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-2-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 3 - Partial-width, has whitespace, has padding, no caret */}
        <div id="variant-3" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          3. Partial-width (WS) (P) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              {'   '}
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-3-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Partial-width</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-3-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 4 - Partial-width, no whitespace, has padding, no caret */}
        <div id="variant-4" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          4. Partial-width (P) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-4-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Partial-width</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-4-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 5 - Full-width, no whitespace, has padding, no caret (same as variant 2) */}
        <div id="variant-5" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          5. Full-width (P) (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text full-width"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-5-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Full-width</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-5-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 6 - Full-width, no whitespace, NO padding, no caret */}
        <div id="variant-6" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          6. Full-width (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text full-width"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-6-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Full-width</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-6-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 7 - Partial-width, no whitespace, has padding, no caret */}
        <div id="variant-7" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          7. Partial-width (P) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-7-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Partial-width</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-7-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 8 - Partial-width, no whitespace, no padding, no caret */}
        <div id="variant-8" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          8. Partial-width (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-8-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Partial-width</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-8-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 9 - WS+P (Full-width), has whitespace, has padding, no caret */}
        <div id="variant-9" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          9. WS+P (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              {'   '}
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text full-width"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-9-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>WS+P</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-9-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 10 - WS+NP (Full-width), has whitespace, no padding, no caret */}
        <div id="variant-10" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          10. WS+NP (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              {'   '}
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text full-width"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-10-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>WS+NP</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-10-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 11 - NWS+P (Full-width), no whitespace, has padding, no caret */}
        <div id="variant-11" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          11. NWS+P (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text full-width"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-11-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>NWS+P</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-11-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 12 - NWS+NP (Full-width), no whitespace, no padding, no caret */}
        <div id="variant-12" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          12. NWS+NP (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text full-width"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-12-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>NWS+NP</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-12-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 13 - Two same handlers, has whitespace, has padding, partial-width, no caret, multipleElements */}
        <div id="variant-13" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          13. Two same handlers (WS) (P) (2x) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              {'   '}
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-13-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Two same handlers 1</span>
              </div>
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-13-v2-dropdown-clickable-2');
                }}
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#f5f5dc' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Two same handlers 2</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-13-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 14 - Two same handlers, no whitespace, has padding, partial-width, no caret, multipleElements */}
        <div id="variant-14" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          14. Two same handlers (P) (2x) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-14-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Two same handlers 1</span>
              </div>
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-14-v2-dropdown-clickable-2');
                }}
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#f5f5dc' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Two same handlers 2</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-14-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 15 - Two different handlers, has whitespace, has padding, partial-width, no caret, multipleElements, differentHandlers */}
        <div id="variant-15" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          15. Two different handlers (WS) (P) (2x) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              {'   '}
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-15-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Two different handlers 1</span>
              </div>
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text"
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#f5f5dc' }}
                id="variant-15-v2-dropdown-clickable-2"
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Two different handlers 2</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-15-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 16 - Two different handlers, no whitespace, has padding, partial-width, no caret, multipleElements, differentHandlers */}
        <div id="variant-16" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          16. Two different handlers (P) (2x) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg
            className="infinity-icon"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            icon-name="api protection"
            color="inherit"
            height="16"
            width="16"
            alt=""
            viewBox="0 0 16 16"
            transform="rotate(0)"
            style={{ backgroundColor: '#e6e6fa' }}
          >
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div
              role="listbox"
              aria-expanded="false"
              className="ui selection dropdown cp-select default"
              tabIndex={0}
              style={{ backgroundColor: '#f0fff0' }}
            >
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text"
                onClick={(e) => {
                  e.preventDefault();
                  handleButtonClick(e, 'variant-16-v2-dropdown-clickable');
                }}
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Two different handlers 1</span>
              </div>
              <div
                aria-atomic="true"
                aria-live="polite"
                role="alert"
                className="divider text"
                style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#f5f5dc' }}
                id="variant-16-v2-dropdown-clickable-2"
              >
                <svg
                  className="infinity-icon"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7C7C7C"
                  icon-name="inactive practice"
                  color="#7C7C7C"
                  height="16"
                  width="16"
                  alt=""
                  viewBox="0 0 16 16"
                  transform="rotate(0)"
                  style={{ backgroundColor: '#f5deb3' }}
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
                <span style={{ backgroundColor: '#ffe4b5' }}>Two different handlers 2</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div
            className="collapse-indicator"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick(e, 'variant-16-v2-collapse-indicator');
            }}
            style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}
          >
            <svg
              className="infinity-icon"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              icon-name="chevron down"
              color="inherit"
              height="16"
              width="16"
              alt=""
              viewBox="0 0 9 9"
              transform="rotate(0)"
              style={{ backgroundColor: '#e0ffff' }}
            >
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 17 - React handler, has whitespace, has padding, full-width, has cursor, no caret */}
        <div id="variant-17" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          17. React (WS) (P) (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }}>
              {'   '}
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text full-width" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-17-v2-dropdown-clickable'); }} style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}>
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>React</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-17-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 18 - Inline handler, has whitespace, has padding, full-width, has cursor, no caret */}
        <div id="variant-18" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          18. Inline (WS) (P) (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }}>
              {'   '}
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text full-width" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-18-v2-dropdown-clickable'); }} style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}>
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>Inline</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-18-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 19 - addEL, has whitespace, has padding, full-width, has cursor, no caret, no onClick (uses addEventListener) */}
        <div id="variant-19" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          19. addEL (WS) (P) (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }} id="variant-19-v2-dropdown-container">
              {'   '}
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text full-width" style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }} id="variant-19-v2-dropdown-clickable">
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>addEL</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-19-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 20 - React+EL, has whitespace, has padding, full-width, has cursor, no caret */}
        <div id="variant-20" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          20. React+EL (WS) (P) (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }} id="variant-20-v2-dropdown-container">
              {'   '}
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text full-width" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-20-v2-dropdown-clickable'); }} style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }} id="variant-20-v2-dropdown-clickable">
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>React+EL</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-20-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 21 - No cursor, has whitespace, has padding, full-width, no cursor, has handler, no caret */}
        <div id="variant-21" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          21. No cursor (WS) (P) (FW) (non-unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }}>
              {'   '}
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text full-width" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-21-v2-dropdown-clickable'); }} style={{ padding: '10px 12px', backgroundColor: '#fff5ee' }}>
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>No cursor</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-21-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 22 - Cursor only, has whitespace, has padding, full-width, has cursor, no handler, no caret */}
        <div id="variant-22" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          22. Cursor only (WS) (P) (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }}>
              {'   '}
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text full-width" style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}>
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>Cursor only</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-22-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 23 - Handler only, has whitespace, has padding, full-width, no cursor, has handler, no caret */}
        <div id="variant-23" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          23. Handler only (WS) (P) (FW) (non-unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }}>
              {'   '}
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text full-width" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-23-v2-dropdown-clickable'); }} style={{ padding: '10px 12px', backgroundColor: '#fff5ee' }}>
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>Handler only</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-23-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 24 - Both, has whitespace, has padding, full-width, has cursor, has handler, no caret */}
        <div id="variant-24" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          24. Both (WS) (P) (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }}>
              {'   '}
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text full-width" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-24-v2-dropdown-clickable'); }} style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}>
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>Both</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-24-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 25 - With caret, has whitespace, has padding, partial-width, has cursor, has handler, has caret */}
        <div id="variant-25" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          25. With caret (WS) (P) (C) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }}>
              {'   '}
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-25-v2-dropdown-clickable'); }} style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}>
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>With caret</span>
              </div>
              <svg className="infinity-icon caret icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="caret down" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(90)" style={{ backgroundColor: '#d3d3d3' }}>
                <polygon fill="currentColor" points="10 8 6 4 6 12 10 8"></polygon>
              </svg>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-25-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 26 - With caret, no whitespace, has padding, partial-width, has cursor, has handler, has caret */}
        <div id="variant-26" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          26. With caret (P) (C) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }}>
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-26-v2-dropdown-clickable'); }} style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}>
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>With caret</span>
              </div>
              <svg className="infinity-icon caret icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="caret down" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(90)" style={{ backgroundColor: '#d3d3d3' }}>
                <polygon fill="currentColor" points="10 8 6 4 6 12 10 8"></polygon>
              </svg>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-26-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 27 - No caret, has whitespace, has padding, full-width, has cursor, has handler, no caret */}
        <div id="variant-27" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          27. No caret (WS) (P) (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }}>
              {'   '}
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text full-width" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-27-v2-dropdown-clickable'); }} style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}>
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>No caret</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-27-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 28 - No caret, no whitespace, has padding, full-width, has cursor, has handler, no caret */}
        <div id="variant-28" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          28. No caret (P) (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }}>
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text full-width" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-28-v2-dropdown-clickable'); }} style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}>
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>No caret</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-28-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 29 - Complex 1, has whitespace, has padding, partial-width, has cursor, has handler, has caret */}
        <div id="variant-29" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          29. Complex 1 (WS) (P) (C) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }}>
              {'   '}
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-29-v2-dropdown-clickable'); }} style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }}>
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>Complex 1</span>
              </div>
              <svg className="infinity-icon caret icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="caret down" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(90)" style={{ backgroundColor: '#d3d3d3' }}>
                <polygon fill="currentColor" points="10 8 6 4 6 12 10 8"></polygon>
              </svg>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-29-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 30 - Complex 2, no whitespace, no padding, full-width, no cursor, has handler, no caret */}
        <div id="variant-30" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          30. Complex 2 (FW) (non-unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }}>
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text full-width" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-30-v2-dropdown-clickable'); }} style={{ backgroundColor: '#fff5ee' }}>
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>Complex 2</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-30-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 31 - Complex 3, has whitespace, no padding, full-width, has cursor, inline handler, no caret */}
        <div id="variant-31" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          31. Complex 3 (WS) (FW) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }}>
              {'   '}
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text full-width" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-31-v2-dropdown-clickable'); }} style={{ cursor: 'pointer', backgroundColor: '#fff5ee' }}>
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>Complex 3</span>
              </div>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-31-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

        {/* VARIANT 32 - Complex 4, no whitespace, has padding, partial-width, has cursor, has handler, has addEventListener, has caret */}
        <div id="variant-32" style={{ marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600', color: '#666' }}>
          32. Complex 4 (P) (C) (unifiable)
        </div>
        <div className="header clickable" style={{ marginBottom: '40px', padding: '20px', background: '#ffe4e1', border: '1px solid #ddd', borderRadius: '8px' }}>
          <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="api protection" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#e6e6fa' }}>
            <g fill="currentColor" style={{ backgroundColor: '#dda0dd' }}>
              <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
              <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
              <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
              <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
              <polygon points="8,16 1,14 1,5 8,7 "></polygon>
              <polygon points="9,16 16,14 16,5 9,7 "></polygon>
            </g>
          </svg>
          <h2 style={{ backgroundColor: '#f0e68c' }}>API Protection Practice</h2>
          <div className="control" style={{ backgroundColor: '#e0f0ff' }}>
            <div role="listbox" aria-expanded="false" className="ui selection dropdown cp-select default" tabIndex={0} style={{ backgroundColor: '#f0fff0' }} id="variant-32-v2-dropdown-container">
              <div aria-atomic="true" aria-live="polite" role="alert" className="divider text" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-32-v2-dropdown-clickable'); }} style={{ cursor: 'pointer', padding: '10px 12px', backgroundColor: '#fff5ee' }} id="variant-32-v2-dropdown-clickable">
                <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="#7C7C7C" icon-name="inactive practice" color="#7C7C7C" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(0)" style={{ backgroundColor: '#f5deb3' }}>
                  <path fill="#7C7C7C" d="M8,0L0,3.2l2.1,10.7L8,16l5.9-2.1L16,3.2L8,0z M8,13c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S10.8,13,8,13z"></path>
                  <path fill="#7C7C7C" d="M10.8,5.3L10.8,5.3c-0.4-0.4-1-0.4-1.4,0L8.1,6.6L6.7,5.3c-0.4-0.4-1-0.4-1.4,0l0,0c-0.4,0.4-0.4,1,0,1.4l1.3,1.3L5.3,9.4c-0.4,0.4-0.4,1,0,1.4l0,0c0.4,0.4,1,0.4,1.4,0l1.3-1.3l1.3,1.3c0.4,0.4,1,0.4,1.4,0l0,0c0.4-0.4,0.4-1,0-1.4L9.5,8.1l1.3-1.3C11.2,6.3,11.2,5.7,10.8,5.3z"></path>
                </svg>
                <span style={{ backgroundColor: '#ffe4b5' }}>Complex 4</span>
              </div>
              <svg className="infinity-icon caret icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="caret down" color="inherit" height="16" width="16" alt="" viewBox="0 0 16 16" transform="rotate(90)" style={{ backgroundColor: '#d3d3d3' }}>
                <polygon fill="currentColor" points="10 8 6 4 6 12 10 8"></polygon>
              </svg>
              <div className="menu transition sf-hidden" style={{ backgroundColor: '#f5f5dc' }}></div>
            </div>
          </div>
          <div className="collapse-indicator" onClick={(e) => { e.preventDefault(); handleButtonClick(e, 'variant-32-v2-collapse-indicator'); }} style={{ cursor: 'pointer', backgroundColor: '#f5fffa' }}>
            <svg className="infinity-icon" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor" icon-name="chevron down" color="inherit" height="16" width="16" alt="" viewBox="0 0 9 9" transform="rotate(0)" style={{ backgroundColor: '#e0ffff' }}>
              <path fill="currentColor" d="M4.47,5.67,7.91,2,9,3.17,4.47,8,0,3.17,1,2Z"></path>
            </svg>
          </div>
        </div>

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
    </>
  );
}
