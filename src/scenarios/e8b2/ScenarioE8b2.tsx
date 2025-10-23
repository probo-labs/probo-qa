import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioE8b2({ onAction }: ScenarioProps) {
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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 60px 20px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal {
          max-width: 400px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 40px;
          text-align: center;
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
        }

        .form-group {
          margin-bottom: 25px;
          text-align: left;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #555;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
        }
      `}</style>

      <div className="page-container">
        <div className="modal">
          <h1>Stay Updated!</h1>
          <p className="subtitle">Join our newsletter for the latest updates</p>

          <div className="form-group">
            <label htmlFor="name-input">Name</label>
            <input type="text" id="name-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="email-input">Email</label>
            <input type="email" id="email-input" onFocus={handleFieldFocus} />
          </div>
        </div>
      </div>
    </>
  );
}
