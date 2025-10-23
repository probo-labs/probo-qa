import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioD5a2({ onAction }: ScenarioProps) {
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
          background: #2c3e50;
          padding: 15px;
          color: #ecf0f1;
          min-height: 100vh;
        }

        .config-panel {
          max-width: 950px;
          margin: 0 auto;
          background: #34495e;
          border-radius: 6px;
          padding: 20px;
        }

        h1 {
          font-size: 1.2rem;
          margin-bottom: 12px;
          color: #ecf0f1;
          border-bottom: 1px solid #4a5f7f;
          padding-bottom: 8px;
        }

        .section-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #3498db;
          margin-top: 10px;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .config-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 15px;
        }

        .form-row {
          display: flex;
          align-items: center;
        }

        .form-row label {
          width: 130px;
          text-align: right;
          padding-right: 10px;
          color: #bdc3c7;
          font-size: 0.75rem;
        }

        .form-row input {
          flex: 1;
          padding: 4px 8px;
          border: 1px solid #7f8c8d;
          border-radius: 2px;
          font-size: 0.75rem;
          background: #2c3e50;
          color: #ecf0f1;
        }

        .form-row input:focus {
          outline: none;
          border-color: #3498db;
        }
      `}</style>

      <div className="page-container">
        <div className="config-panel">
          <h1>🖥️ Server Configuration Panel</h1>

          <div className="section-title">Database Settings</div>
          <div className="config-grid">
            <div className="form-row">
              <label htmlFor="db-host-input">DB Host:</label>
              <input type="text" id="db-host-input" placeholder="localhost" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="db-port-input">DB Port:</label>
              <input type="text" id="db-port-input" placeholder="5432" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="db-name-input">DB Name:</label>
              <input type="text" id="db-name-input" placeholder="production" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="db-user-input">DB User:</label>
              <input type="text" id="db-user-input" placeholder="admin" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="db-pass-input">DB Password:</label>
              <input type="password" id="db-pass-input" placeholder="••••••••" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="db-pool-input">Connection Pool:</label>
              <input type="text" id="db-pool-input" placeholder="20" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="db-timeout-input">DB Timeout:</label>
              <input type="text" id="db-timeout-input" placeholder="30000" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="db-ssl-input">SSL Mode:</label>
              <input type="text" id="db-ssl-input" placeholder="require" onFocus={handleFieldFocus} />
            </div>
          </div>

          <div className="section-title">Cache Settings</div>
          <div className="config-grid">
            <div className="form-row">
              <label htmlFor="redis-host-input">Redis Host:</label>
              <input type="text" id="redis-host-input" placeholder="localhost" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="redis-port-input">Redis Port:</label>
              <input type="text" id="redis-port-input" placeholder="6379" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="cache-ttl-input">TTL (seconds):</label>
              <input type="text" id="cache-ttl-input" placeholder="3600" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="max-memory-input">Max Memory:</label>
              <input type="text" id="max-memory-input" placeholder="512MB" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="eviction-input">Eviction Policy:</label>
              <input type="text" id="eviction-input" placeholder="allkeys-lru" onFocus={handleFieldFocus} />
            </div>
          </div>

          <div className="section-title">Email Settings</div>
          <div className="config-grid">
            <div className="form-row">
              <label htmlFor="smtp-host-input">SMTP Host:</label>
              <input type="text" id="smtp-host-input" placeholder="smtp.gmail.com" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="smtp-port-input">SMTP Port:</label>
              <input type="text" id="smtp-port-input" placeholder="587" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="smtp-user-input">SMTP User:</label>
              <input type="text" id="smtp-user-input" placeholder="user@example.com" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="smtp-pass-input">SMTP Password:</label>
              <input type="password" id="smtp-pass-input" placeholder="••••••••" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="from-email-input">From Address:</label>
              <input type="text" id="from-email-input" placeholder="no-reply@app.com" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="tls-enabled-input">TLS Enabled:</label>
              <input type="text" id="tls-enabled-input" placeholder="true" onFocus={handleFieldFocus} />
            </div>
          </div>

          <div className="section-title">API &amp; Logging</div>
          <div className="config-grid">
            <div className="form-row">
              <label htmlFor="rate-limit-input">Rate Limit:</label>
              <input type="text" id="rate-limit-input" placeholder="100/min" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="api-timeout-input">API Timeout:</label>
              <input type="text" id="api-timeout-input" placeholder="5000" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="retry-count-input">Retry Count:</label>
              <input type="text" id="retry-count-input" placeholder="3" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="base-url-input">Base URL:</label>
              <input type="text" id="base-url-input" placeholder="/api/v1" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="log-level-input">Log Level:</label>
              <input type="text" id="log-level-input" placeholder="info" onFocus={handleFieldFocus} />
            </div>
            <div className="form-row">
              <label htmlFor="log-path-input">Log File Path:</label>
              <input type="text" id="log-path-input" placeholder="/var/log/app.log" onFocus={handleFieldFocus} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
