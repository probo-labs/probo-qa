import { useState } from 'react';
import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioX9a1({ onAction }: ScenarioProps) {
  const { handleButtonClick } = useInteractionHandlers(onAction);
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    // This will be recorded by the recorder even though highlighter doesn't detect it
    handleButtonClick(e, 'modal-close-button');
  };

  if (!isOpen) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Modal Closed</h1>
        <p>The close button was clicked successfully.</p>
      </div>
    );
  }

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
          background: rgba(0, 0, 0, 0.5);
          padding: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          position: relative;
          max-width: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 40px;
          z-index: 1001;
        }

        .modal-header {
          margin-bottom: 20px;
        }

        .close-icon {
          position: absolute;
          top: 0;
          right: 0;
          width: 16px;
          height: 16px;
          cursor: pointer;
          fill: currentColor;
          color: inherit;
          transition: fill 0.2s;
        }

        .close-icon:hover {
          fill: #000;
        }

        h1 {
          font-size: 1.8rem;
          margin-bottom: 10px;
          color: #333;
        }

        .subtitle {
          color: #666;
          margin-bottom: 30px;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .content {
          color: #555;
          line-height: 1.6;
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
      `}</style>

      <div className="page-container">
        <div className="modal-overlay">
          <div className="modal">
            <svg
              className="close-icon"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleClose}
              id="modal-close-button"
              focusable="false"
            >
              <path
                d="M7.99976,5.6572 L13.147456,0.509504 L15.410176,2.772224 L10.26248,7.91992 L15.490176,13.147616 L13.227456,15.410336 L7.99976,10.18264 L2.625808,15.556592 L0.363088,13.293872 L5.73704,7.91992 L0.443088,2.625968 L2.705808,0.363248 L7.99976,5.6572 Z"
                fill="currentColor"
              />
            </svg>
            <div className="modal-header">
              <h1>Important Notice</h1>
            </div>
            <p className="subtitle">
              This modal demonstrates the SVG close button detection issue.
            </p>
            <div className="content">
              <p>
                The X button above is an SVG element with <code>cursor: pointer</code> style.
              </p>
              <div className="warning-box">
                <strong>Detection Issue:</strong> The highlighter does NOT detect this SVG
                close button (because it skips SVG elements), but the recorder WILL record
                clicks on it (because it checks cursor:pointer on any element).
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

