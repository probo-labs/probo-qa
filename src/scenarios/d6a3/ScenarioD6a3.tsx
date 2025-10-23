import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioD6a3({ onAction }: ScenarioProps) {
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
          font-family: 'Courier New', monospace;
          background: #0a0e1a;
          padding: 10px;
          color: #00ff00;
          font-size: 11px;
          min-height: 100vh;
        }

        .order-panel {
          max-width: 950px;
          margin: 0 auto;
          background: #0f1419;
          border: 1px solid #1a2332;
          padding: 12px;
        }

        h1 {
          font-size: 0.95rem;
          margin-bottom: 10px;
          color: #00ff00;
          text-transform: uppercase;
        }

        .section {
          margin-bottom: 4px;
          border: 1px solid #1a2332;
          padding: 4px;
        }

        .section-title {
          font-size: 0.7rem;
          color: #00aaff;
          margin-bottom: 2px;
          font-weight: bold;
        }

        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 2px 8px;
        }

        .legs-table,
        .conditions-table {
          width: 100%;
          border-collapse: collapse;
        }

        .legs-table th,
        .legs-table td,
        .conditions-table th,
        .conditions-table td {
          padding: 2px 4px;
          text-align: left;
          border: 1px solid #1a2332;
          font-size: 0.7rem;
        }

        .legs-table input,
        .conditions-table input,
        .legs-table select,
        .conditions-table select {
          width: 100%;
          padding: 2px 4px;
          border: 1px solid #333;
          background: #000;
          color: #00ff00;
          font-family: 'Courier New', monospace;
          font-size: 0.7rem;
        }

        .form-row {
          display: flex;
          align-items: center;
        }

        .form-row label {
          width: 90px;
          text-align: right;
          padding-right: 6px;
          color: #888;
          font-size: 0.7rem;
        }

        .form-row input,
        .form-row select {
          flex: 1;
          padding: 2px 4px;
          border: 1px solid #333;
          border-radius: 2px;
          font-size: 0.7rem;
          background: #000;
          color: #00ff00;
          font-family: 'Courier New', monospace;
        }

        .form-row input:focus {
          outline: none;
          border-color: #00aaff;
        }
      `}</style>

      <div className="page-container">
        <div className="order-panel">
          <h1>⚡ Trading Platform Order Entry</h1>

          <div className="section">
            <div className="section-title">Order Details</div>
            <div className="field-grid">
              <div className="form-row">
                <label htmlFor="symbol-input">Symbol:</label>
                <input type="text" id="symbol-input" placeholder="AAPL" onFocus={handleFieldFocus} />
              </div>
              <div className="form-row">
                <label htmlFor="order-type-input">Type:</label>
                <select id="order-type-input" onChange={handleFieldSelect}>
                  <option>Market</option>
                  <option>Limit</option>
                  <option>Stop</option>
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="side-input">Side:</label>
                <select id="side-input" onChange={handleFieldSelect}>
                  <option>Buy</option>
                  <option>Sell</option>
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="quantity-input">Quantity:</label>
                <input type="text" id="quantity-input" placeholder="100" onFocus={handleFieldFocus} />
              </div>
              <div className="form-row">
                <label htmlFor="price-input">Price:</label>
                <input type="text" id="price-input" placeholder="150.00" onFocus={handleFieldFocus} />
              </div>
              <div className="form-row">
                <label htmlFor="tif-input">TIF:</label>
                <select id="tif-input" onChange={handleFieldSelect}>
                  <option>DAY</option>
                  <option>GTC</option>
                  <option>IOC</option>
                </select>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Advanced Settings</div>
            <div className="field-grid">
              <div className="form-row">
                <label htmlFor="stop-price-input">Stop Price:</label>
                <input type="text" id="stop-price-input" onFocus={handleFieldFocus} />
              </div>
              <div className="form-row">
                <label htmlFor="limit-price-input">Limit Price:</label>
                <input type="text" id="limit-price-input" onFocus={handleFieldFocus} />
              </div>
              <div className="form-row">
                <label htmlFor="trail-stop-input">Trail Stop:</label>
                <input type="text" id="trail-stop-input" onFocus={handleFieldFocus} />
              </div>
              <div className="form-row">
                <label htmlFor="oco-input">OCO:</label>
                <select id="oco-input" onChange={handleFieldSelect}>
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="bracket-input">Bracket:</label>
                <select id="bracket-input" onChange={handleFieldSelect}>
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Risk Management</div>
            <div className="field-grid">
              <div className="form-row">
                <label htmlFor="max-loss-input">Max Loss:</label>
                <input type="text" id="max-loss-input" onFocus={handleFieldFocus} />
              </div>
              <div className="form-row">
                <label htmlFor="max-gain-input">Max Gain:</label>
                <input type="text" id="max-gain-input" onFocus={handleFieldFocus} />
              </div>
              <div className="form-row">
                <label htmlFor="pos-size-input">Position Size:</label>
                <input type="text" id="pos-size-input" onFocus={handleFieldFocus} />
              </div>
              <div className="form-row">
                <label htmlFor="leverage-input">Leverage:</label>
                <input type="text" id="leverage-input" onFocus={handleFieldFocus} />
              </div>
              <div className="form-row">
                <label htmlFor="margin-input">Margin:</label>
                <input type="text" id="margin-input" onFocus={handleFieldFocus} />
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Execution Options</div>
            <div className="field-grid">
              <div className="form-row">
                <label htmlFor="algo-input">Algo:</label>
                <select id="algo-input" onChange={handleFieldSelect}>
                  <option>TWAP</option>
                  <option>VWAP</option>
                  <option>Sniper</option>
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="darkpool-input">Dark Pool:</label>
                <select id="darkpool-input" onChange={handleFieldSelect}>
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="routing-input">Routing:</label>
                <select id="routing-input" onChange={handleFieldSelect}>
                  <option>Smart</option>
                  <option>Direct</option>
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="fill-type-input">Fill Type:</label>
                <select id="fill-type-input" onChange={handleFieldSelect}>
                  <option>Any</option>
                  <option>AON</option>
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="urgency-input">Urgency:</label>
                <select id="urgency-input" onChange={handleFieldSelect}>
                  <option>Normal</option>
                  <option>High</option>
                </select>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Order Legs (Multi-Leg Orders)</div>
            <table className="legs-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Action</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="text" id="leg1-symbol" placeholder="AAPL" onFocus={handleFieldFocus} /></td>
                  <td>
                    <select id="leg1-action" onChange={handleFieldSelect}>
                      <option>Buy</option>
                      <option>Sell</option>
                    </select>
                  </td>
                  <td><input type="text" id="leg1-qty" placeholder="100" onFocus={handleFieldFocus} /></td>
                  <td><input type="text" id="leg1-price" placeholder="150" onFocus={handleFieldFocus} /></td>
                </tr>
                <tr>
                  <td><input type="text" id="leg2-symbol" onFocus={handleFieldFocus} /></td>
                  <td>
                    <select id="leg2-action" onChange={handleFieldSelect}>
                      <option>Buy</option>
                      <option>Sell</option>
                    </select>
                  </td>
                  <td><input type="text" id="leg2-qty" onFocus={handleFieldFocus} /></td>
                  <td><input type="text" id="leg2-price" onFocus={handleFieldFocus} /></td>
                </tr>
                <tr>
                  <td><input type="text" id="leg3-symbol" onFocus={handleFieldFocus} /></td>
                  <td>
                    <select id="leg3-action" onChange={handleFieldSelect}>
                      <option>Buy</option>
                      <option>Sell</option>
                    </select>
                  </td>
                  <td><input type="text" id="leg3-qty" onFocus={handleFieldFocus} /></td>
                  <td><input type="text" id="leg3-price" onFocus={handleFieldFocus} /></td>
                </tr>
                <tr>
                  <td><input type="text" id="leg4-symbol" onFocus={handleFieldFocus} /></td>
                  <td>
                    <select id="leg4-action" onChange={handleFieldSelect}>
                      <option>Buy</option>
                      <option>Sell</option>
                    </select>
                  </td>
                  <td><input type="text" id="leg4-qty" onFocus={handleFieldFocus} /></td>
                  <td><input type="text" id="leg4-price" onFocus={handleFieldFocus} /></td>
                </tr>
                <tr>
                  <td><input type="text" id="leg5-symbol" onFocus={handleFieldFocus} /></td>
                  <td>
                    <select id="leg5-action" onChange={handleFieldSelect}>
                      <option>Buy</option>
                      <option>Sell</option>
                    </select>
                  </td>
                  <td><input type="text" id="leg5-qty" onFocus={handleFieldFocus} /></td>
                  <td><input type="text" id="leg5-price" onFocus={handleFieldFocus} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section">
            <div className="section-title">Conditional Orders</div>
            <table className="conditions-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Operator</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <select id="cond1-field" onChange={handleFieldSelect}>
                      <option>Price</option>
                      <option>Volume</option>
                      <option>Time</option>
                    </select>
                  </td>
                  <td>
                    <select id="cond1-op" onChange={handleFieldSelect}>
                      <option>&gt;</option>
                      <option>&lt;</option>
                      <option>=</option>
                    </select>
                  </td>
                  <td><input type="text" id="cond1-val" onFocus={handleFieldFocus} /></td>
                </tr>
                <tr>
                  <td>
                    <select id="cond2-field" onChange={handleFieldSelect}>
                      <option>Price</option>
                      <option>Volume</option>
                      <option>Time</option>
                    </select>
                  </td>
                  <td>
                    <select id="cond2-op" onChange={handleFieldSelect}>
                      <option>&gt;</option>
                      <option>&lt;</option>
                      <option>=</option>
                    </select>
                  </td>
                  <td><input type="text" id="cond2-val" onFocus={handleFieldFocus} /></td>
                </tr>
                <tr>
                  <td>
                    <select id="cond3-field" onChange={handleFieldSelect}>
                      <option>Price</option>
                      <option>Volume</option>
                      <option>Time</option>
                    </select>
                  </td>
                  <td>
                    <select id="cond3-op" onChange={handleFieldSelect}>
                      <option>&gt;</option>
                      <option>&lt;</option>
                      <option>=</option>
                    </select>
                  </td>
                  <td><input type="text" id="cond3-val" onFocus={handleFieldFocus} /></td>
                </tr>
                <tr>
                  <td>
                    <select id="cond4-field" onChange={handleFieldSelect}>
                      <option>Price</option>
                      <option>Volume</option>
                      <option>Time</option>
                    </select>
                  </td>
                  <td>
                    <select id="cond4-op" onChange={handleFieldSelect}>
                      <option>&gt;</option>
                      <option>&lt;</option>
                      <option>=</option>
                    </select>
                  </td>
                  <td><input type="text" id="cond4-val" onFocus={handleFieldFocus} /></td>
                </tr>
                <tr>
                  <td>
                    <select id="cond5-field" onChange={handleFieldSelect}>
                      <option>Price</option>
                      <option>Volume</option>
                      <option>Time</option>
                    </select>
                  </td>
                  <td>
                    <select id="cond5-op" onChange={handleFieldSelect}>
                      <option>&gt;</option>
                      <option>&lt;</option>
                      <option>=</option>
                    </select>
                  </td>
                  <td><input type="text" id="cond5-val" onFocus={handleFieldFocus} /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="section">
            <div className="section-title">Fees &amp; Account</div>
            <div className="field-grid">
              <div className="form-row">
                <label htmlFor="commission-input">Commission:</label>
                <input type="text" id="commission-input" placeholder="0.005" onFocus={handleFieldFocus} />
              </div>
              <div className="form-row">
                <label htmlFor="exchange-fee-input">Exchange Fee:</label>
                <input type="text" id="exchange-fee-input" placeholder="0.002" onFocus={handleFieldFocus} />
              </div>
              <div className="form-row">
                <label htmlFor="clearing-input">Clearing:</label>
                <input type="text" id="clearing-input" placeholder="0.001" onFocus={handleFieldFocus} />
              </div>
              <div className="form-row">
                <label htmlFor="regulatory-input">Regulatory:</label>
                <input type="text" id="regulatory-input" placeholder="0.0001" onFocus={handleFieldFocus} />
              </div>
              <div className="form-row">
                <label htmlFor="account-num-input">Account #:</label>
                <input type="text" id="account-num-input" onFocus={handleFieldFocus} />
              </div>
              <div className="form-row">
                <label htmlFor="account-type-input">Acct Type:</label>
                <select id="account-type-input" onChange={handleFieldSelect}>
                  <option>Cash</option>
                  <option>Margin</option>
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="currency-input">Currency:</label>
                <select id="currency-input" onChange={handleFieldSelect}>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="settlement-input">Settlement:</label>
                <select id="settlement-input" onChange={handleFieldSelect}>
                  <option>T+2</option>
                  <option>T+1</option>
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="order-notes-input">Notes:</label>
                <input type="text" id="order-notes-input" onFocus={handleFieldFocus} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
