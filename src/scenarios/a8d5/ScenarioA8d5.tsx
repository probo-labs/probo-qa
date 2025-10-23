import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioA8d5({ onAction }: ScenarioProps) {
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
          background: #e9ecef;
          padding: 30px 20px;
        }

        .registration-form {
          max-width: 500px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          padding: 35px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
          font-size: 1.6rem;
          margin-bottom: 25px;
          color: #333;
          text-align: center;
        }

        input {
          width: 100%;
          padding: 12px;
          margin-bottom: 14px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        input:focus {
          outline: none;
          border-color: #4caf50;
        }

        input::placeholder {
          color: #aaa;
        }
      `}</style>

      <div className="page-container">
        <div className="registration-form">
          <h1>Create Account</h1>

          <input type="text" id="username-input" placeholder="Username" onFocus={handleFieldFocus} />
          <input type="email" id="email-input" placeholder="Email Address" onFocus={handleFieldFocus} />
          <input type="password" id="password-input" placeholder="Password" onFocus={handleFieldFocus} />
          <input
            type="password"
            id="confirm-password-input"
            placeholder="Confirm Password"
            onFocus={handleFieldFocus}
          />
          <input type="tel" id="phone-input" placeholder="Phone Number" onFocus={handleFieldFocus} />
          <input type="text" id="address-input" placeholder="Street Address" onFocus={handleFieldFocus} />
          <input type="text" id="city-input" placeholder="City" onFocus={handleFieldFocus} />
          <input type="text" id="zipcode-input" placeholder="ZIP Code" onFocus={handleFieldFocus} />
        </div>
      </div>
    </>
  );
}
