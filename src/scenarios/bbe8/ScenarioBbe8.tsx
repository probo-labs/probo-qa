import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioBbe8({ onAction }: ScenarioProps) {
  const { handleFieldFocus } = useInteractionHandlers(onAction);

  const rows = Array.from({ length: 20 }, (_, i) => i + 1);

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
          background: #fafafa;
          padding: 15px;
          font-size: 11px;
        }

        .invoice-container {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          border: 1px solid #ccc;
          padding: 15px;
        }

        h1 {
          font-size: 1.1rem;
          margin-bottom: 12px;
          color: #333;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #e0e0e0;
          padding: 6px;
          text-align: left;
          font-size: 0.75rem;
          border: 1px solid #999;
        }

        td {
          padding: 4px;
          border: 1px solid #ccc;
        }

        .inline-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .inline-row label {
          font-size: 0.7rem;
          color: #666;
          white-space: nowrap;
        }

        .inline-row input {
          flex: 1;
          padding: 3px 5px;
          border: 1px solid #999;
          font-size: 0.75rem;
          font-family: 'Courier New', monospace;
        }

        .inline-row input:focus {
          outline: none;
          background: #ffffcc;
        }
      `}</style>

      <div className="page-container">
        <div className="invoice-container">
          <h1>Invoice Line Items</h1>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Tax Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((rowNum) => (
                <tr key={rowNum}>
                  <td>{rowNum}</td>
                  <td>
                    <div className="inline-row">
                      <label>Item:</label>
                      <input type="text" id={`item-${rowNum}-input`} onFocus={handleFieldFocus} />
                    </div>
                  </td>
                  <td>
                    <div className="inline-row">
                      <label>Qty:</label>
                      <input type="text" id={`qty-${rowNum}-input`} onFocus={handleFieldFocus} />
                    </div>
                  </td>
                  <td>
                    <div className="inline-row">
                      <label>$:</label>
                      <input type="text" id={`price-${rowNum}-input`} onFocus={handleFieldFocus} />
                    </div>
                  </td>
                  <td>
                    <div className="inline-row">
                      <label>Tax:</label>
                      <input type="text" id={`tax-${rowNum}-input`} onFocus={handleFieldFocus} />
                    </div>
                  </td>
                  <td>
                    <div className="inline-row">
                      <label>Total:</label>
                      <input type="text" id={`total-${rowNum}-input`} onFocus={handleFieldFocus} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
