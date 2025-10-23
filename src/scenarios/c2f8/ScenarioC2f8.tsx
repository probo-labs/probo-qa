import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioC2f8({ onAction }: ScenarioProps) {
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
          background: #fff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .logo {
          font-size: 4rem;
          margin-bottom: 30px;
          color: #4285f4;
          font-weight: 300;
        }

        .search-box {
          width: 100%;
          max-width: 600px;
          display: flex;
          align-items: center;
          border: 1px solid #dfe1e5;
          border-radius: 24px;
          padding: 10px 20px;
          box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
        }

        .search-box:hover {
          box-shadow: 0 1px 6px rgba(32, 33, 36, 0.4);
        }

        .search-icon {
          color: #9aa0a6;
          font-size: 1.2rem;
          margin-right: 12px;
        }

        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1rem;
          padding: 8px 0;
        }
      `}</style>

      <div className="page-container">
        <div className="logo">Search</div>

        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input type="text" id="search-input" onFocus={handleFieldFocus} />
        </div>
      </div>
    </>
  );
}
