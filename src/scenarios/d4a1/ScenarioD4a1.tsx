import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioD4a1({ onAction }: ScenarioProps) {
  const { handleFieldFocus, handleFieldSelect } = useInteractionHandlers(onAction);

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
          padding: 40px 20px;
          min-height: 100vh;
        }

        .settings-card {
          max-width: 500px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 30px;
        }

        h1 {
          font-size: 1.5rem;
          margin-bottom: 30px;
          color: #333;
        }

        .form-row {
          display: flex;
          align-items: center;
          margin-bottom: 25px;
        }

        .form-row label {
          width: 150px;
          text-align: right;
          padding-right: 20px;
          color: #666;
          font-size: 0.9rem;
        }

        .form-row input,
        .form-row select {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .form-row input:focus,
        .form-row select:focus {
          outline: none;
          border-color: #4caf50;
        }
      `}</style>

      <div className="page-container">
        <div className="settings-card">
          <h1>Personal Settings</h1>

          <div className="form-row">
            <label htmlFor="name-input">Name:</label>
            <input type="text" id="name-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-row">
            <label htmlFor="email-input">Email:</label>
            <input type="email" id="email-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-row">
            <label htmlFor="timezone-input">Timezone:</label>
            <select id="timezone-input" onChange={handleFieldSelect}>
              <option value="">Select timezone</option>
              <option value="EST">Eastern Time</option>
              <option value="CST">Central Time</option>
              <option value="PST">Pacific Time</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
