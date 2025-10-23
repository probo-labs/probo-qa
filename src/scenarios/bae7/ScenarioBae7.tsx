import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioBae7({ onAction }: ScenarioProps) {
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
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f5f5f5;
          padding: 20px;
          font-size: 13px;
        }

        .admin-panel {
          max-width: 1100px;
          margin: 0 auto;
          background: white;
          border-radius: 6px;
          padding: 20px;
        }

        h1 {
          font-size: 1.3rem;
          margin-bottom: 18px;
          color: #333;
        }

        .filter-toolbar {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px 12px;
          align-items: center;
        }

        .filter-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .filter-item label {
          font-size: 0.8rem;
          color: #666;
          white-space: nowrap;
        }

        .filter-item select,
        .filter-item input {
          padding: 5px 8px;
          border: 1px solid #ddd;
          border-radius: 3px;
          font-size: 0.8rem;
        }

        .filter-item select:focus,
        .filter-item input:focus {
          outline: none;
          border-color: #007bff;
        }
      `}</style>

      <div className="page-container">
        <div className="admin-panel">
          <h1>User Management</h1>

          <div className="filter-toolbar">
            <div className="filter-item">
              <label htmlFor="status-filter">Status:</label>
              <select id="status-filter" onChange={handleFieldSelect}>
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="role-filter">Role:</label>
              <select id="role-filter" onChange={handleFieldSelect}>
                <option value="">All</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="dept-filter">Department:</label>
              <select id="dept-filter" onChange={handleFieldSelect}>
                <option value="">All</option>
                <option value="engineering">Engineering</option>
                <option value="sales">Sales</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="location-filter">Location:</label>
              <select id="location-filter" onChange={handleFieldSelect}>
                <option value="">All</option>
                <option value="us">US</option>
                <option value="eu">EU</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="team-filter">Team:</label>
              <select id="team-filter" onChange={handleFieldSelect}>
                <option value="">All</option>
                <option value="backend">Backend</option>
                <option value="frontend">Frontend</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="level-filter">Level:</label>
              <select id="level-filter" onChange={handleFieldSelect}>
                <option value="">All</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="created-filter">Created:</label>
              <input type="text" id="created-filter" placeholder="Date" onFocus={handleFieldFocus} />
            </div>

            <div className="filter-item">
              <label htmlFor="modified-filter">Modified:</label>
              <input type="text" id="modified-filter" placeholder="Date" onFocus={handleFieldFocus} />
            </div>

            <div className="filter-item">
              <label htmlFor="search-filter">Search:</label>
              <input type="text" id="search-filter" placeholder="Name or email" onFocus={handleFieldFocus} />
            </div>

            <div className="filter-item">
              <label htmlFor="limit-filter">Show:</label>
              <select id="limit-filter" onChange={handleFieldSelect}>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
