import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioC8f3({ onAction }: ScenarioProps) {
  const { handleFieldFocus, handleFieldSelect, handleButtonClick } = useInteractionHandlers(onAction);

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
          font-family: 'Courier New', monospace;
          background: #0a0e27;
          color: #fff;
          font-size: 11px;
          height: 100vh;
          overflow: hidden;
        }

        .toolbar {
          background: #1a1f3a;
          padding: 4px 8px;
          display: flex;
          gap: 4px;
          border-bottom: 1px solid #2a2f4a;
        }

        .toolbar-btn {
          padding: 4px 8px;
          background: #2a2f4a;
          border: 1px solid #3a3f5a;
          color: #ccc;
          font-size: 10px;
          cursor: pointer;
          border-radius: 2px;
        }

        .toolbar-btn:hover {
          background: #3a3f5a;
        }

        .main-layout {
          display: flex;
          height: calc(100vh - 30px);
        }

        .watchlist {
          width: 200px;
          background: #141829;
          border-right: 1px solid #2a2f4a;
          overflow-y: auto;
        }

        .watchlist-header {
          background: #1a1f3a;
          padding: 6px 8px;
          font-size: 10px;
          font-weight: bold;
          border-bottom: 1px solid #2a2f4a;
        }

        .stock-item {
          padding: 4px 8px;
          border-bottom: 1px solid #1a1f3a;
          cursor: pointer;
        }

        .stock-item:hover {
          background: #1a1f3a;
        }

        .stock-symbol {
          font-size: 11px;
          font-weight: bold;
          color: #4a9eff;
        }

        .stock-price {
          font-size: 10px;
          color: #0f0;
        }

        .stock-change {
          font-size: 9px;
        }

        .positive {
          color: #0f0;
        }

        .negative {
          color: #f00;
        }

        .trading-grid {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .order-panel {
          background: #141829;
          padding: 8px;
          border-bottom: 1px solid #2a2f4a;
        }

        .order-controls {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          align-items: center;
        }

        .order-input {
          padding: 3px 6px;
          background: #0a0e27;
          border: 1px solid #2a2f4a;
          color: #fff;
          font-size: 11px;
          width: 80px;
          font-family: inherit;
        }

        .order-input-tiny {
          width: 50px;
        }

        .order-select {
          padding: 3px 6px;
          background: #0a0e27;
          border: 1px solid #2a2f4a;
          color: #fff;
          font-size: 11px;
          font-family: inherit;
        }

        .order-label {
          font-size: 10px;
          color: #888;
          margin-right: 2px;
        }

        .btn-buy {
          padding: 4px 12px;
          background: #0a6640;
          border: 1px solid #0c8050;
          color: #0f0;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          border-radius: 2px;
        }

        .btn-buy:hover {
          background: #0c8050;
        }

        .btn-sell {
          padding: 4px 12px;
          background: #661414;
          border: 1px solid #882020;
          color: #f88;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          border-radius: 2px;
        }

        .btn-sell:hover {
          background: #882020;
        }

        .positions-table {
          flex: 1;
          overflow-y: auto;
          background: #0a0e27;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #1a1f3a;
          padding: 4px 6px;
          text-align: left;
          font-size: 10px;
          font-weight: bold;
          color: #ccc;
          border-bottom: 1px solid #2a2f4a;
          position: sticky;
          top: 0;
        }

        td {
          padding: 3px 6px;
          border-bottom: 1px solid #1a1f3a;
          font-size: 10px;
        }

        tr:hover {
          background: #141829;
        }

        .cell-symbol {
          color: #4a9eff;
          font-weight: bold;
        }

        .cell-actions {
          display: flex;
          gap: 2px;
        }

        .mini-btn {
          padding: 2px 6px;
          font-size: 9px;
          border: none;
          cursor: pointer;
          border-radius: 2px;
        }

        .mini-input {
          width: 40px;
          padding: 2px 4px;
          background: #141829;
          border: 1px solid #2a2f4a;
          color: #fff;
          font-size: 10px;
          font-family: inherit;
        }
      `}</style>

      <div className="page-container">
        <div className="toolbar">
          <button
            className="toolbar-btn"
            id="toolbar-charts"
            onClick={(e) => handleButtonClick(e, 'toolbar-charts')}
          >
            Charts
          </button>
          <button
            className="toolbar-btn"
            id="toolbar-news"
            onClick={(e) => handleButtonClick(e, 'toolbar-news')}
          >
            News
          </button>
          <button
            className="toolbar-btn"
            id="toolbar-alerts"
            onClick={(e) => handleButtonClick(e, 'toolbar-alerts')}
          >
            Alerts
          </button>
          <button
            className="toolbar-btn"
            id="toolbar-history"
            onClick={(e) => handleButtonClick(e, 'toolbar-history')}
          >
            History
          </button>
          <button
            className="toolbar-btn"
            id="toolbar-settings"
            onClick={(e) => handleButtonClick(e, 'toolbar-settings')}
          >
            Settings
          </button>
        </div>

        <div className="main-layout">
          <div className="watchlist">
            <div className="watchlist-header">WATCHLIST</div>
            <div
              className="stock-item"
              id="watch-aapl"
              onClick={(e) => handleButtonClick(e, 'watch-aapl')}
            >
              <div className="stock-symbol">AAPL</div>
              <div className="stock-price">$178.45</div>
              <div className="stock-change positive">+2.34 (1.33%)</div>
            </div>
            <div
              className="stock-item"
              id="watch-msft"
              onClick={(e) => handleButtonClick(e, 'watch-msft')}
            >
              <div className="stock-symbol">MSFT</div>
              <div className="stock-price">$415.20</div>
              <div className="stock-change positive">+5.67 (1.38%)</div>
            </div>
            <div
              className="stock-item"
              id="watch-googl"
              onClick={(e) => handleButtonClick(e, 'watch-googl')}
            >
              <div className="stock-symbol">GOOGL</div>
              <div className="stock-price">$141.80</div>
              <div className="stock-change negative">-1.20 (-0.84%)</div>
            </div>
            <div
              className="stock-item"
              id="watch-tsla"
              onClick={(e) => handleButtonClick(e, 'watch-tsla')}
            >
              <div className="stock-symbol">TSLA</div>
              <div className="stock-price">$242.50</div>
              <div className="stock-change positive">+8.90 (3.81%)</div>
            </div>
          </div>

          <div className="trading-grid">
            <div className="order-panel">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="order-controls">
                  <span className="order-label">Symbol:</span>
                  <input
                    type="text"
                    className="order-input order-input-tiny"
                    id="order-symbol"
                    defaultValue="MSFT"
                    onFocus={handleFieldFocus}
                  />

                  <span className="order-label">Qty:</span>
                  <input
                    type="text"
                    className="order-input order-input-tiny"
                    id="order-qty"
                    defaultValue="100"
                    onFocus={handleFieldFocus}
                  />

                  <span className="order-label">Type:</span>
                  <select
                    className="order-select"
                    id="order-type"
                    onChange={handleFieldSelect}
                  >
                    <option>Market</option>
                    <option>Limit</option>
                    <option>Stop</option>
                  </select>

                  <span className="order-label">Price:</span>
                  <input
                    type="text"
                    className="order-input order-input-tiny"
                    id="order-price"
                    defaultValue="415.20"
                    onFocus={handleFieldFocus}
                  />

                  <span className="order-label">TIF:</span>
                  <select
                    className="order-select"
                    id="order-tif"
                    onChange={handleFieldSelect}
                  >
                    <option>Day</option>
                    <option>GTC</option>
                    <option>IOC</option>
                  </select>

                  <button
                    type="submit"
                    className="btn-buy"
                    id="order-buy-btn"
                    onClick={(e) => handleButtonClick(e, 'order-buy-btn')}
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    className="btn-sell"
                    id="order-sell-btn"
                    onClick={(e) => handleButtonClick(e, 'order-sell-btn')}
                  >
                    SELL
                  </button>
                </div>
              </form>
            </div>

            <div className="positions-table">
              <table>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Qty</th>
                    <th>Avg Price</th>
                    <th>Last</th>
                    <th>P&L</th>
                    <th>P&L %</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="cell-symbol">AAPL</td>
                    <td>200</td>
                    <td>$175.30</td>
                    <td>$178.45</td>
                    <td className="positive">+$630.00</td>
                    <td className="positive">+1.80%</td>
                    <td className="cell-actions">
                      <input
                        type="text"
                        className="mini-input"
                        id="qty-aapl"
                        defaultValue="200"
                        onFocus={handleFieldFocus}
                      />
                      <button
                        className="mini-btn btn-buy"
                        id="buy-btn-aapl"
                        onClick={(e) => handleButtonClick(e, 'buy-btn-aapl')}
                      >
                        BUY
                      </button>
                      <button
                        className="mini-btn btn-sell"
                        id="sell-btn-aapl"
                        onClick={(e) => handleButtonClick(e, 'sell-btn-aapl')}
                      >
                        SELL
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="cell-symbol">MSFT</td>
                    <td>150</td>
                    <td>$408.50</td>
                    <td>$415.20</td>
                    <td className="positive">+$1,005.00</td>
                    <td className="positive">+1.64%</td>
                    <td className="cell-actions">
                      <input
                        type="text"
                        className="mini-input"
                        id="qty-msft"
                        defaultValue="150"
                        onFocus={handleFieldFocus}
                      />
                      <button
                        className="mini-btn btn-buy"
                        id="buy-btn-msft"
                        onClick={(e) => handleButtonClick(e, 'buy-btn-msft')}
                      >
                        BUY
                      </button>
                      <button
                        className="mini-btn btn-sell"
                        id="sell-btn-msft"
                        onClick={(e) => handleButtonClick(e, 'sell-btn-msft')}
                      >
                        SELL
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="cell-symbol">GOOGL</td>
                    <td>100</td>
                    <td>$143.20</td>
                    <td>$141.80</td>
                    <td className="negative">-$140.00</td>
                    <td className="negative">-0.98%</td>
                    <td className="cell-actions">
                      <input
                        type="text"
                        className="mini-input"
                        id="qty-googl"
                        defaultValue="100"
                        onFocus={handleFieldFocus}
                      />
                      <button
                        className="mini-btn btn-buy"
                        id="buy-btn-googl"
                        onClick={(e) => handleButtonClick(e, 'buy-btn-googl')}
                      >
                        BUY
                      </button>
                      <button
                        className="mini-btn btn-sell"
                        id="sell-btn-googl"
                        onClick={(e) => handleButtonClick(e, 'sell-btn-googl')}
                      >
                        SELL
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="cell-symbol">TSLA</td>
                    <td>75</td>
                    <td>$235.80</td>
                    <td>$242.50</td>
                    <td className="positive">+$502.50</td>
                    <td className="positive">+2.84%</td>
                    <td className="cell-actions">
                      <input
                        type="text"
                        className="mini-input"
                        id="qty-tsla"
                        defaultValue="75"
                        onFocus={handleFieldFocus}
                      />
                      <button
                        className="mini-btn btn-buy"
                        id="buy-btn-tsla"
                        onClick={(e) => handleButtonClick(e, 'buy-btn-tsla')}
                      >
                        BUY
                      </button>
                      <button
                        className="mini-btn btn-sell"
                        id="sell-btn-tsla"
                        onClick={(e) => handleButtonClick(e, 'sell-btn-tsla')}
                      >
                        SELL
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="cell-symbol">NVDA</td>
                    <td>50</td>
                    <td>$485.60</td>
                    <td>$492.30</td>
                    <td className="positive">+$335.00</td>
                    <td className="positive">+1.38%</td>
                    <td className="cell-actions">
                      <input
                        type="text"
                        className="mini-input"
                        id="qty-nvda"
                        defaultValue="50"
                        onFocus={handleFieldFocus}
                      />
                      <button
                        className="mini-btn btn-buy"
                        id="buy-btn-nvda"
                        onClick={(e) => handleButtonClick(e, 'buy-btn-nvda')}
                      >
                        BUY
                      </button>
                      <button
                        className="mini-btn btn-sell"
                        id="sell-btn-nvda"
                        onClick={(e) => handleButtonClick(e, 'sell-btn-nvda')}
                      >
                        SELL
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
