import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioC3f9({ onAction }: ScenarioProps) {
  const { handleButtonClick } = useInteractionHandlers(onAction);

  // Security feature (correct answer - 1): Password authentication
  // Other clear categories (11 items): Entertainment, Communication, Productivity, Shopping
  const items = [
    { id: 'item-movie-streaming', text: 'Movie streaming', category: 'Entertainment' },
    { id: 'item-email-inbox', text: 'Email inbox', category: 'Communication' },
    { id: 'item-calendar-events', text: 'Calendar events', category: 'Productivity' },
    { id: 'item-music-player', text: 'Music player', category: 'Entertainment' },
    { id: 'item-chat-messages', text: 'Chat messages', category: 'Communication' },
    { id: 'item-password-auth', text: 'Password authentication', category: 'Security' },
    { id: 'item-task-reminders', text: 'Task reminders', category: 'Productivity' },
    { id: 'item-game-library', text: 'Game library', category: 'Entertainment' },
    { id: 'item-video-calling', text: 'Video calling', category: 'Communication' },
    { id: 'item-note-taking', text: 'Note taking', category: 'Productivity' },
    { id: 'item-shopping-cart', text: 'Shopping cart', category: 'Shopping' },
    { id: 'item-payment-checkout', text: 'Payment checkout', category: 'Shopping' },
  ];

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
          background: #f5f7fa;
          padding: 40px 20px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .captcha-container {
          max-width: 500px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 30px;
          border: 2px solid #e0e0e0;
        }

        .captcha-header {
          margin-bottom: 20px;
        }

        h1 {
          font-size: 1.3rem;
          margin-bottom: 10px;
          color: #333;
        }

        .instruction {
          font-size: 0.95rem;
          color: #555;
          padding: 12px;
          background: #f0f4ff;
          border-left: 4px solid #4285f4;
          border-radius: 4px;
        }

        .item-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 20px;
        }

        .item-card {
          padding: 20px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: #ffffff;
          border: 2px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          color: #333;
          transition: all 0.2s;
          min-height: 80px;
        }

        .item-card:hover {
          border-color: #4285f4;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(66, 133, 244, 0.2);
        }

        .item-card:active {
          transform: translateY(0);
        }

        .footer {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #888;
        }

        .recaptcha-logo {
          font-size: 1rem;
        }
      `}</style>

      <div className="page-container">
        <div className="captcha-container">
          <div className="captcha-header">
            <h1>Security Verification</h1>
            <div className="instruction">
              Select the item that represents a <strong>security feature</strong>
            </div>
          </div>

          <div className="item-grid">
            {items.map((item) => (
              <button
                key={item.id}
                id={item.id}
                className="item-card"
                onClick={(e) => handleButtonClick(e, item.id)}
                aria-label={item.text}
              >
                {item.text}
              </button>
            ))}
          </div>

          <div className="footer">
            <span className="recaptcha-logo">🔒</span>
            <span>Protected by ProboVerify</span>
          </div>
        </div>
      </div>
    </>
  );
}
