import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioB9e6({ onAction }: ScenarioProps) {
  const { handleFieldSelect } = useInteractionHandlers(onAction);

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
          padding: 40px 20px;
        }

        .search-container {
          max-width: 900px;
          margin: 0 auto;
        }

        h1 {
          font-size: 1.8rem;
          margin-bottom: 30px;
          color: #333;
        }

        .search-bar {
          background: #f8f9fa;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .filter-group label {
          font-weight: 500;
          color: #555;
          white-space: nowrap;
        }

        .filter-group select {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.95rem;
        }

        .filter-group select:focus {
          outline: none;
          border-color: #007bff;
        }
      `}</style>

      <div className="page-container">
        <div className="search-container">
          <h1>Product Search</h1>

          <div className="search-bar">
            <div className="filter-group">
              <label htmlFor="category-select">Category:</label>
              <select id="category-select" onChange={handleFieldSelect}>
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home & Garden</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="price-select">Price Range:</label>
              <select id="price-select" onChange={handleFieldSelect}>
                <option value="">Any Price</option>
                <option value="under50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="over100">Over $100</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="brand-select">Brand:</label>
              <select id="brand-select" onChange={handleFieldSelect}>
                <option value="">All Brands</option>
                <option value="apple">Apple</option>
                <option value="samsung">Samsung</option>
                <option value="sony">Sony</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
