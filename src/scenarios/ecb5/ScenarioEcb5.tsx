import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioEcb5({ onAction }: ScenarioProps) {
  const { handleButtonClick } = useInteractionHandlers(onAction);

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
          background: #f8f9fa;
          padding: 40px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .booking-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
          padding: 20px;
          max-width: 600px;
        }

        .header {
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e0e0e0;
        }

        .header-row {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .header-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #555;
          width: 80px;
        }

        .header-value {
          flex: 1;
          font-size: 0.95rem;
          color: #1a73e8;
          font-weight: 500;
        }

        .schedule-grid {
          width: 100%;
        }

        .grid-header {
          display: grid;
          grid-template-columns: 80px repeat(5, 1fr);
          gap: 1px;
          margin-bottom: 2px;
        }

        .time-label-header {
          font-size: 0.7rem;
          font-weight: 600;
          color: #666;
          padding: 4px 8px;
        }

        .day-header {
          text-align: center;
          font-size: 0.7rem;
          font-weight: 600;
          color: #666;
          padding: 4px 0;
        }

        .time-row {
          display: grid;
          grid-template-columns: 80px repeat(5, 1fr);
          gap: 1px;
          margin-bottom: 1px;
        }

        .time-label {
          font-size: 0.65rem;
          color: #888;
          padding: 4px 8px;
          display: flex;
          align-items: center;
        }

        .slot {
          aspect-ratio: 1.2;
          border: 1px solid #e0e0e0;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          transition: all 0.15s;
          color: #333;
        }

        .slot:hover {
          background: #e3f2fd;
          border-color: #1976d2;
        }

        .slot.booked {
          background: #f5f5f5;
          color: #999;
          cursor: not-allowed;
        }

        .slot.selected {
          background: #4caf50;
          color: white;
          font-weight: 600;
        }
      `}</style>

      <div className="page-container">
        <div className="booking-container">
          <div className="header">
            <div className="header-row">
              <div className="header-label">Doctor:</div>
              <div className="header-value">Dr. Sarah Johnson</div>
            </div>
            <div className="header-row">
              <div className="header-label">Week:</div>
              <div className="header-value">January 27 - 31, 2025</div>
            </div>
          </div>

          <div className="schedule-grid">
            <div className="grid-header">
              <div className="time-label-header">Time:</div>
              <div className="day-header">Mon 27</div>
              <div className="day-header">Tue 28</div>
              <div className="day-header">Wed 29</div>
              <div className="day-header">Thu 30</div>
              <div className="day-header">Fri 31</div>
            </div>

            <div className="time-row">
              <div className="time-label">8:00 AM:</div>
              <button type="button" className="slot" id="slot-mon-8" onClick={(e) => handleButtonClick(e, 'slot-mon-8')}>✓</button>
              <button type="button" className="slot" id="slot-tue-8" onClick={(e) => handleButtonClick(e, 'slot-tue-8')}>✓</button>
              <button type="button" className="slot booked" id="slot-wed-8" disabled>×</button>
              <button type="button" className="slot" id="slot-thu-8" onClick={(e) => handleButtonClick(e, 'slot-thu-8')}>✓</button>
              <button type="button" className="slot" id="slot-fri-8" onClick={(e) => handleButtonClick(e, 'slot-fri-8')}>✓</button>
            </div>

            <div className="time-row">
              <div className="time-label">9:00 AM:</div>
              <button type="button" className="slot" id="slot-mon-9" onClick={(e) => handleButtonClick(e, 'slot-mon-9')}>✓</button>
              <button type="button" className="slot booked" id="slot-tue-9" disabled>×</button>
              <button type="button" className="slot" id="slot-wed-9" onClick={(e) => handleButtonClick(e, 'slot-wed-9')}>✓</button>
              <button type="button" className="slot" id="slot-thu-9" onClick={(e) => handleButtonClick(e, 'slot-thu-9')}>✓</button>
              <button type="button" className="slot booked" id="slot-fri-9" disabled>×</button>
            </div>

            <div className="time-row">
              <div className="time-label">10:00 AM:</div>
              <button type="button" className="slot" id="slot-mon-10" onClick={(e) => handleButtonClick(e, 'slot-mon-10')}>✓</button>
              <button type="button" className="slot" id="slot-tue-10" onClick={(e) => handleButtonClick(e, 'slot-tue-10')}>✓</button>
              <button type="button" className="slot" id="slot-wed-10" onClick={(e) => handleButtonClick(e, 'slot-wed-10')}>✓</button>
              <button type="button" className="slot booked" id="slot-thu-10" disabled>×</button>
              <button type="button" className="slot" id="slot-fri-10" onClick={(e) => handleButtonClick(e, 'slot-fri-10')}>✓</button>
            </div>

            <div className="time-row">
              <div className="time-label">11:00 AM:</div>
              <button type="button" className="slot booked" id="slot-mon-11" disabled>×</button>
              <button type="button" className="slot" id="slot-tue-11" onClick={(e) => handleButtonClick(e, 'slot-tue-11')}>✓</button>
              <button type="button" className="slot" id="slot-wed-11" onClick={(e) => handleButtonClick(e, 'slot-wed-11')}>✓</button>
              <button type="button" className="slot" id="slot-thu-11" onClick={(e) => handleButtonClick(e, 'slot-thu-11')}>✓</button>
              <button type="button" className="slot" id="slot-fri-11" onClick={(e) => handleButtonClick(e, 'slot-fri-11')}>✓</button>
            </div>

            <div className="time-row">
              <div className="time-label">1:00 PM:</div>
              <button type="button" className="slot" id="slot-mon-13" onClick={(e) => handleButtonClick(e, 'slot-mon-13')}>✓</button>
              <button type="button" className="slot" id="slot-tue-13" onClick={(e) => handleButtonClick(e, 'slot-tue-13')}>✓</button>
              <button type="button" className="slot booked" id="slot-wed-13" disabled>×</button>
              <button type="button" className="slot" id="slot-thu-13" onClick={(e) => handleButtonClick(e, 'slot-thu-13')}>✓</button>
              <button type="button" className="slot" id="slot-fri-13" onClick={(e) => handleButtonClick(e, 'slot-fri-13')}>✓</button>
            </div>

            <div className="time-row">
              <div className="time-label">2:00 PM:</div>
              <button type="button" className="slot" id="slot-mon-14" onClick={(e) => handleButtonClick(e, 'slot-mon-14')}>✓</button>
              <button type="button" className="slot" id="slot-tue-14" onClick={(e) => handleButtonClick(e, 'slot-tue-14')}>✓</button>
              <button type="button" className="slot" id="slot-wed-14" onClick={(e) => handleButtonClick(e, 'slot-wed-14')}>✓</button>
              <button type="button" className="slot" id="slot-thu-14" onClick={(e) => handleButtonClick(e, 'slot-thu-14')}>✓</button>
              <button type="button" className="slot booked" id="slot-fri-14" disabled>×</button>
            </div>

            <div className="time-row">
              <div className="time-label">3:00 PM:</div>
              <button type="button" className="slot" id="slot-mon-15" onClick={(e) => handleButtonClick(e, 'slot-mon-15')}>✓</button>
              <button type="button" className="slot booked" id="slot-tue-15" disabled>×</button>
              <button type="button" className="slot" id="slot-wed-15" onClick={(e) => handleButtonClick(e, 'slot-wed-15')}>✓</button>
              <button type="button" className="slot" id="slot-thu-15" onClick={(e) => handleButtonClick(e, 'slot-thu-15')}>✓</button>
              <button type="button" className="slot" id="slot-fri-15" onClick={(e) => handleButtonClick(e, 'slot-fri-15')}>✓</button>
            </div>

            <div className="time-row">
              <div className="time-label">4:00 PM:</div>
              <button type="button" className="slot" id="slot-mon-16" onClick={(e) => handleButtonClick(e, 'slot-mon-16')}>✓</button>
              <button type="button" className="slot" id="slot-tue-16" onClick={(e) => handleButtonClick(e, 'slot-tue-16')}>✓</button>
              <button type="button" className="slot" id="slot-wed-16" onClick={(e) => handleButtonClick(e, 'slot-wed-16')}>✓</button>
              <button type="button" className="slot booked" id="slot-thu-16" disabled>×</button>
              <button type="button" className="slot" id="slot-fri-16" onClick={(e) => handleButtonClick(e, 'slot-fri-16')}>✓</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
