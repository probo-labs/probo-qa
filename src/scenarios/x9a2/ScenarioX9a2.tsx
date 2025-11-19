import { useState } from 'react';
import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioX9a2({ onAction }: ScenarioProps) {
  const { handleButtonClick } = useInteractionHandlers(onAction);
  const [clicked, setClicked] = useState<Record<string, boolean>>({});

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setClicked(prev => ({ ...prev, [id]: true }));
    handleButtonClick(e, id);
  };

  return (
    <>
      <style jsx>{`
        .practice {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 30px;
          padding: 20px;
        }

        .ui.selection.dropdown.cp-select.default {
          position: relative;
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: default;
          min-width: 200px;
        }

        .divider.text {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          cursor: pointer;
          flex-shrink: 0;
        }

        /* Second dropdown variant - label expands to full width */
        .divider.text.full-width {
          flex: 1;
        }

        .divider.text:hover {
          background: #f0f0f0;
        }

        .divider.text svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .divider.text span {
          color: #7c7c7c;
          font-size: 14px;
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
        {/* First dropdown: non-clickable whitespace between text and caret */}
        <div className="control">
          <div
            role="listbox"
            aria-expanded="false"
            className="ui selection dropdown cp-select default"
            tabIndex={0}
          >
            <div
              aria-atomic="true"
              aria-live="polite"
              role="alert"
              className="divider text"
              onClick={(e) => handleClick(e, 'dropdown-clickable-area-1')}
              id="dropdown-clickable-area-1"
            >
              <svg
                className="infinity-icon"
                viewBox="0 0 16 16"
                fill="#7C7C7C"
                color="#7C7C7C"
                height="16"
                width="16"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
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
            <svg
              className="infinity-icon caret icon"
              focusable={false}
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              color="#666"
              height="16"
              width="16"
              viewBox="0 0 16 16"
              style={{ transform: 'rotate(90deg)', display: 'inline-block', color: '#666', marginLeft: 'auto' }}
            >
              <polygon fill="currentColor" points="10 8 6 4 6 12 10 8"></polygon>
            </svg>
            <div className="menu transition sf-hidden"></div>
          </div>
        </div>

        {/* Second dropdown: full-width clickable label (no caret) */}
        <div className="control">
          <div
            role="listbox"
            aria-expanded="false"
            className="ui selection dropdown cp-select default"
            tabIndex={0}
          >
            {'   '}
            <div
              aria-atomic="true"
              aria-live="polite"
              role="alert"
              className="divider text full-width"
              onClick={(e) => handleClick(e, 'dropdown-clickable-area-2')}
              id="dropdown-clickable-area-2"
            >
              <svg
                className="infinity-icon"
                viewBox="0 0 16 16"
                fill="#7C7C7C"
                color="#7C7C7C"
                height="16"
                width="16"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
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
              <span>Full-width clickable</span>
            </div>
            <div className="menu transition sf-hidden"></div>
          </div>
        </div>

        {clicked['dropdown-clickable-area-1'] && (
          <div style={{ color: 'green' }}>First dropdown clicked!</div>
        )}
        {clicked['dropdown-clickable-area-2'] && (
          <div style={{ color: 'green' }}>Second dropdown clicked!</div>
        )}
      </div>
    </>
  );
}
