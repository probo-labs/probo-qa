import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioA7d4({ onAction }: ScenarioProps) {
  const { handleFieldFocus } = useInteractionHandlers(onAction);

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
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f0f2f5;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .contact-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          padding: 40px;
          max-width: 500px;
          width: 100%;
        }

        h1 {
          font-size: 2rem;
          margin-bottom: 10px;
          color: #333;
        }

        .subtitle {
          color: #777;
          margin-bottom: 30px;
        }

        input,
        textarea {
          width: 100%;
          padding: 14px;
          margin-bottom: 18px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        input:focus,
        textarea:focus {
          outline: none;
          border-color: #007bff;
        }

        input::placeholder,
        textarea::placeholder {
          color: #999;
        }

        textarea {
          min-height: 120px;
          resize: vertical;
        }
      `}</style>

      <div className="page-container">
        <div className="contact-card">
          <h1>Contact Us</h1>
          <p className="subtitle">We&apos;d love to hear from you</p>

          <input type="text" id="name-input" placeholder="Your Name" onFocus={handleFieldFocus} />
          <input type="email" id="email-input" placeholder="Your Email" onFocus={handleFieldFocus} />
          <textarea id="message-input" placeholder="Your Message" onFocus={handleFieldFocus}></textarea>
        </div>
      </div>
    </>
  );
}
