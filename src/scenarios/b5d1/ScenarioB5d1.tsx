import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioB5d1({ onAction }: ScenarioProps) {
  const { handleFieldFocus, handleFieldSelect } = useInteractionHandlers(onAction);

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          background: #f8f9fa;
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        .container {
          display: flex;
          height: 100vh;
          width: 100%;
        }

        .sidebar {
          width: 300px;
          background: white;
          border-right: 1px solid #e0e0e0;
          overflow-y: auto;
          padding: 20px;
        }

        .sidebar-header {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f0f0f0;
        }

        .filter-section {
          margin-bottom: 16px;
        }

        .filter-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #555;
          margin-bottom: 6px;
        }

        input[type="text"],
        input[type="number"],
        input[type="date"],
        select {
          width: 100%;
          padding: 8px 10px;
          font-size: 13px;
          font-family: inherit;
          border: 1px solid #d0d0d0;
          border-radius: 4px;
          background: white;
          transition: border-color 0.2s;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: #4a90e2;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .checkbox-item input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .checkbox-item label {
          font-size: 13px;
          color: #333;
          cursor: pointer;
        }

        .date-range {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .date-input-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .date-input-wrapper span {
          font-size: 11px;
          color: #888;
        }

        .button-group {
          display: flex;
          gap: 8px;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
        }

        .btn {
          flex: 1;
          padding: 10px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #4a90e2;
          color: white;
        }

        .btn-primary:hover {
          background: #357abd;
        }

        .btn-secondary {
          background: #e0e0e0;
          color: #555;
        }

        .btn-secondary:hover {
          background: #d0d0d0;
        }

        .main-content {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
        }

        .main-header {
          font-size: 28px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 20px;
        }

        .placeholder-table {
          background: white;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          color: #999;
          font-size: 14px;
        }
      `}</style>

      <div className="container">
        <div className="sidebar">
          <div className="sidebar-header">Filter Orders</div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="filter-section">
              <label className="filter-label" htmlFor="search-input">Search</label>
              <input
                type="text"
                id="search-input"
                placeholder="Order ID, customer name..."
                onFocus={handleFieldFocus}
              />
            </div>

            <div className="filter-section">
              <label className="filter-label">Date Range</label>
              <div className="date-range">
                <div className="date-input-wrapper">
                  <span>From</span>
                  <input type="date" id="date-from-input" onFocus={handleFieldFocus} />
                </div>
                <div className="date-input-wrapper">
                  <span>To</span>
                  <input type="date" id="date-to-input" onFocus={handleFieldFocus} />
                </div>
              </div>
            </div>

            <div className="filter-section">
              <label className="filter-label" htmlFor="status-select">Order Status</label>
              <select id="status-select" onChange={handleFieldSelect}>
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-section">
              <label className="filter-label" htmlFor="payment-select">Payment Status</label>
              <select id="payment-select" onChange={handleFieldSelect}>
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div className="filter-section">
              <label className="filter-label" htmlFor="category-select">Product Category</label>
              <select id="category-select" onChange={handleFieldSelect}>
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home & Garden</option>
                <option value="books">Books</option>
              </select>
            </div>

            <div className="filter-section">
              <label className="filter-label">Price Range</label>
              <div className="date-range">
                <div className="date-input-wrapper">
                  <span>Min</span>
                  <input type="number" id="price-min-input" placeholder="0" onFocus={handleFieldFocus} />
                </div>
                <div className="date-input-wrapper">
                  <span>Max</span>
                  <input type="number" id="price-max-input" placeholder="1000" onFocus={handleFieldFocus} />
                </div>
              </div>
            </div>

            <div className="filter-section">
              <label className="filter-label" htmlFor="shipping-select">Shipping Method</label>
              <select id="shipping-select" onChange={handleFieldSelect}>
                <option value="">All Methods</option>
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="overnight">Overnight</option>
              </select>
            </div>

            <div className="filter-section">
              <label className="filter-label">Customer Type</label>
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input type="checkbox" id="customer-new-check" onChange={handleFieldSelect} />
                  <label htmlFor="customer-new-check">New Customer</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="customer-returning-check" onChange={handleFieldSelect} />
                  <label htmlFor="customer-returning-check">Returning Customer</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="customer-vip-check" onChange={handleFieldSelect} />
                  <label htmlFor="customer-vip-check">VIP</label>
                </div>
              </div>
            </div>

            <div className="filter-section">
              <label className="filter-label">Special Flags</label>
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input type="checkbox" id="flag-gift-check" onChange={handleFieldSelect} />
                  <label htmlFor="flag-gift-check">Gift Wrap</label>
                </div>
                <div className="checkbox-item">
                  <input type="checkbox" id="flag-priority-check" onChange={handleFieldSelect} />
                  <label htmlFor="flag-priority-check">Priority Order</label>
                </div>
              </div>
            </div>

            <div className="button-group">
              <button type="button" className="btn btn-secondary">Reset</button>
              <button type="submit" className="btn btn-primary">Apply Filters</button>
            </div>
          </form>
        </div>

        <div className="main-content">
          <h1 className="main-header">Orders</h1>
          <div className="placeholder-table">
            Select filters and click &quot;Apply Filters&quot; to view orders
          </div>
        </div>
      </div>
    </>
  );
}
