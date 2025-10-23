import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioE9b3({ onAction }: ScenarioProps) {
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
          background: #f5f7fa;
          padding: 20px;
          min-height: 100vh;
        }

        .expense-form {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          padding: 25px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        h1 {
          font-size: 1.4rem;
          margin-bottom: 8px;
          color: #2c3e50;
        }

        .subtitle {
          color: #7f8c8d;
          font-size: 0.85rem;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e8ecef;
        }

        .section-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: #3498db;
          margin-top: 18px;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          margin-bottom: 5px;
          color: #34495e;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 8px 10px;
          border: 1px solid #d1d8dd;
          border-radius: 4px;
          font-size: 0.85rem;
          color: #2c3e50;
          background: white;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 70px;
        }
      `}</style>

      <div className="page-container">
        <div className="expense-form">
          <h1>📋 Business Expense Report</h1>
          <p className="subtitle">Complete all required fields for reimbursement processing</p>

          <div className="section-title">Employee Information</div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="employee-name-input">Employee Name</label>
              <input type="text" id="employee-name-input" placeholder="Full name" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="employee-id-input">Employee ID</label>
              <input type="text" id="employee-id-input" placeholder="EMP-001" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="department-input">Department</label>
              <input type="text" id="department-input" placeholder="Engineering" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="manager-input">Manager</label>
              <input type="text" id="manager-input" placeholder="Manager name" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="email-input">Email Address</label>
              <input type="email" id="email-input" placeholder="employee@company.com" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="phone-input">Phone Number</label>
              <input type="tel" id="phone-input" placeholder="(555) 123-4567" onFocus={handleFieldFocus} />
            </div>
          </div>

          <div className="section-title">Trip Details</div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="trip-purpose-input">Trip Purpose</label>
              <input type="text" id="trip-purpose-input" placeholder="Client meeting" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="project-code-input">Project Code</label>
              <input type="text" id="project-code-input" placeholder="PRJ-2024-001" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="departure-date-input">Departure Date</label>
              <input type="date" id="departure-date-input" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="return-date-input">Return Date</label>
              <input type="date" id="return-date-input" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="destination-input">Destination</label>
              <input type="text" id="destination-input" placeholder="San Francisco, CA" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="client-name-input">Client Name</label>
              <input type="text" id="client-name-input" placeholder="Client company" onFocus={handleFieldFocus} />
            </div>
          </div>

          <div className="section-title">Expense Items</div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="airfare-input">Airfare</label>
              <input type="text" id="airfare-input" placeholder="$0.00" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="hotel-input">Hotel Accommodation</label>
              <input type="text" id="hotel-input" placeholder="$0.00" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="meals-input">Meals &amp; Entertainment</label>
              <input type="text" id="meals-input" placeholder="$0.00" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="transport-input">Ground Transportation</label>
              <input type="text" id="transport-input" placeholder="$0.00" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="parking-input">Parking Fees</label>
              <input type="text" id="parking-input" placeholder="$0.00" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="internet-input">Internet &amp; Phone</label>
              <input type="text" id="internet-input" placeholder="$0.00" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="supplies-input">Office Supplies</label>
              <input type="text" id="supplies-input" placeholder="$0.00" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="other-input">Other Expenses</label>
              <input type="text" id="other-input" placeholder="$0.00" onFocus={handleFieldFocus} />
            </div>
          </div>

          <div className="section-title">Reimbursement</div>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="total-amount-input">Total Amount</label>
              <input type="text" id="total-amount-input" placeholder="$0.00" readOnly onFocus={handleFieldFocus} />
            </div>
            <div className="form-group">
              <label htmlFor="currency-input">Currency</label>
              <input type="text" id="currency-input" placeholder="USD" onFocus={handleFieldFocus} />
            </div>
            <div className="form-group full-width">
              <label htmlFor="notes-input">Additional Notes</label>
              <textarea id="notes-input" placeholder="Any additional information..." onFocus={handleFieldFocus}></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
