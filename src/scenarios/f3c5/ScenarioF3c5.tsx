import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioF3c5({ onAction }: ScenarioProps) {
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
          font-family: 'Roboto', -apple-system, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .login-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          padding: 40px;
          max-width: 400px;
          width: 100%;
        }

        h1 {
          font-size: 1.8rem;
          margin-bottom: 30px;
          color: #333;
          text-align: center;
        }

        .input-field {
          position: relative;
          margin-bottom: 30px;
        }

        .input-field input {
          width: 100%;
          padding: 12px 12px 8px 12px;
          border: none;
          border-bottom: 2px solid #ddd;
          font-size: 1rem;
          background: transparent;
          transition: border-color 0.3s;
        }

        .input-field input:focus {
          outline: none;
          border-bottom-color: #667eea;
        }

        .input-field label {
          position: absolute;
          left: 12px;
          top: 12px;
          color: #999;
          font-size: 1rem;
          pointer-events: none;
          transition: all 0.3s;
        }

        .input-field input:focus + label,
        .input-field input:not(:placeholder-shown) + label {
          top: -8px;
          font-size: 0.75rem;
          color: #667eea;
        }
      `}</style>

      <div className="page-container">
        <div className="login-card">
          <h1>Sign In</h1>

          <div className="input-field">
            <input type="email" id="email-input" placeholder=" " onFocus={handleFieldFocus} />
            <label htmlFor="email-input">Email</label>
          </div>

          <div className="input-field">
            <input type="password" id="password-input" placeholder=" " onFocus={handleFieldFocus} />
            <label htmlFor="password-input">Password</label>
          </div>
        </div>
      </div>
    </>
  );
}
