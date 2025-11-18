import { useState } from 'react';
import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioX9a2({ onAction }: ScenarioProps) {
  const { handleButtonClick } = useInteractionHandlers(onAction);
  const [clicked, setClicked] = useState<string | null>(null);

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setClicked('dropdown-clickable-area');
    handleButtonClick(e, 'dropdown-clickable-area');
  };

  const handleCaretClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setClicked('caret-non-clickable');
    // This won't trigger navigation because there's no onclick handler
  };

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body,
        .page-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #f5f5f5;
          padding: 40px;
          min-height: 100vh;
        }

        .practice {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .header h2 {
          font-size: 1.5rem;
          color: #333;
        }

        .control {
          margin: 20px 0;
        }

        .dropdown {
          position: relative;
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          width: 280px;
          cursor: default;
        }

        .divider-text {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          cursor: pointer;
          /* Don't expand - let flexbox create space naturally */
          flex-shrink: 0;
        }

        .divider-text:hover {
          background: #f0f0f0;
        }

        .divider-text svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .divider-text span {
          color: #7c7c7c;
          font-size: 14px;
        }

        .caret-icon {
          width: 16px;
          height: 16px;
          padding: 0 12px;
          flex-shrink: 0;
          color: #666;
          /* Push to the right, creating non-clickable space */
          margin-left: auto;
        }

        .caret-icon:hover {
          color: #333;
        }

        .explanation {
          margin-top: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-left: 4px solid #007bff;
          border-radius: 4px;
        }

        .explanation h3 {
          margin-bottom: 15px;
          color: #007bff;
        }

        .explanation code {
          background: #e9ecef;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.9em;
        }

        .warning-box {
          margin-top: 20px;
          padding: 12px;
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          border-radius: 4px;
          font-size: 0.85rem;
          color: #856404;
        }

        .click-feedback {
          margin-top: 20px;
          padding: 12px;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .click-feedback.success {
          background: #d4edda;
          border-left: 4px solid #28a745;
        }

        .click-feedback.error {
          background: #f8d7da;
          border-left: 4px solid #dc3545;
        }

        .click-feedback.info {
          background: #e7f3ff;
          border-left: 4px solid #007bff;
        }
      `}</style>

      <div className="page-container">
        <div className="practice">
          <div className="header">
            <svg
              className="infinity-icon"
              viewBox="0 0 16 16"
              fill="currentColor"
              width="16"
              height="16"
            >
              <g fill="currentColor">
                <ellipse cx="8.5" cy="2" rx="1.5" ry="1"></ellipse>
                <ellipse cx="8.5" cy="5" rx="1.5" ry="1"></ellipse>
                <ellipse cx="13.5" cy="4" rx="1.5" ry="1"></ellipse>
                <ellipse cx="3.5" cy="4" rx="1.5" ry="1"></ellipse>
                <polygon points="8,16 1,14 1,5 8,7"></polygon>
                <polygon points="9,16 16,14 16,5 9,7"></polygon>
              </g>
            </svg>
            <h2>API Protection Practice</h2>
          </div>

          <div className="control">
            <div className="dropdown" role="listbox" tabIndex={0}>
              {/* Clickable div - contains icon and text */}
              <div
                className="divider-text"
                onClick={handleDropdownClick}
                role="alert"
                aria-live="polite"
                id="dropdown-clickable-area"
              >
                <svg
                  className="infinity-icon"
                  viewBox="0 0 16 16"
                  fill="#7C7C7C"
                  width="16"
                  height="16"
                  focusable="false"
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
                <span>Disabled</span>
              </div>

              {/* Non-clickable caret SVG - SIBLING of clickable div */}
              {/* Space between "Disabled" and caret is created by flexbox (margin-left: auto on caret) */}
              <svg
                className="caret-icon infinity-icon"
                viewBox="0 0 16 16"
                fill="currentColor"
                width="16"
                height="16"
                onClick={handleCaretClick}
                id="caret-non-clickable"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
              >
                <polygon fill="currentColor" points="10 8 6 4 6 12 10 8"></polygon>
              </svg>
            </div>
          </div>

          {clicked && (
            <div className={`click-feedback ${clicked === 'dropdown-clickable-area' ? 'success' : 'error'}`}>
              {clicked === 'dropdown-clickable-area' ? (
                <>
                  <strong>✅ Click registered!</strong> You clicked on the clickable area (icon + &quot;Disabled&quot; text).
                </>
              ) : (
                <>
                  <strong>❌ No action triggered!</strong> You clicked on the caret arrow, but it has no onclick handler.
                </>
              )}
            </div>
          )}

          <div className="explanation">
            <h3>Technical Analysis: Dropdown Click Issue</h3>
            
            <h4 style={{ marginTop: '15px', marginBottom: '10px' }}>DOM Structure Breakdown:</h4>
            <pre style={{ background: '#e9ecef', padding: '12px', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem' }}>
{`<div class="dropdown" role="listbox">
  <!-- Element 1: Clickable container -->
  <div class="divider-text" 
       onclick="..." 
       style="cursor: pointer;">
    <svg>...</svg>  <!-- Inactive practice icon -->
    <span>Disabled</span>  <!-- Text content -->
  </div>
  
  <!-- Element 2: Non-clickable sibling (OUTSIDE clickable div) -->
  <svg class="caret-icon">...</svg>  <!-- ❌ No onclick handler -->
</div>`}
            </pre>

            <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Technical Details:</h4>
            <ul style={{ lineHeight: '1.8', marginLeft: '20px' }}>
              <li><strong>Clickable Element</strong> (<code>div.divider-text</code>):
                <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
                  <li>Has <code>onclick</code> handler attached</li>
                  <li>Contains: SVG icon + <code>&lt;span&gt;Disabled&lt;/span&gt;</code></li>
                  <li>CSS: <code>cursor: pointer</code></li>
                  <li>ARIA: <code>role=&quot;alert&quot;</code>, <code>aria-live=&quot;polite&quot;</code></li>
                </ul>
              </li>
              <li style={{ marginTop: '10px' }}><strong>Non-Clickable Element</strong> (<code>svg.caret-icon</code>):
                <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
                  <li>Sibling of clickable div (same parent: <code>div.dropdown</code>)</li>
                  <li>No <code>onclick</code> handler</li>
                  <li>No <code>cursor: pointer</code> style</li>
                  <li><code>focusable=&quot;false&quot;</code></li>
                  <li>Visually appears to the right of &quot;Disabled&quot; but is outside the clickable container</li>
                </ul>
              </li>
            </ul>

            <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>The Problem:</h4>
            <p style={{ lineHeight: '1.6' }}>
              The caret SVG is a <strong>direct child</strong> of the dropdown container, not a child of the clickable div. 
              When users click on the caret, the click event hits the SVG element which has no handler, so nothing happens. 
              The clickable div only covers its own content (icon + text), not the caret.
            </p>

            <div className="warning-box" style={{ marginTop: '15px' }}>
              <strong>Expected vs Actual:</strong><br />
              <strong>Expected:</strong> The entire dropdown area (including the caret) should be clickable.<br />
              <strong>Actual:</strong> Only the <code>div.divider-text</code> and its children are clickable. 
              The caret SVG, being a sibling, is not.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

