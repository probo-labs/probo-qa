import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioD7a4({ onAction }: ScenarioProps) {
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
          background: #f5f5f5;
          padding: 40px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .calendar-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
          padding: 20px;
          max-width: 350px;
        }

        .calendar-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e0e0e0;
        }

        .month-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #333;
          width: 80px;
          text-align: right;
          padding-right: 12px;
        }

        .month-display {
          flex: 1;
          font-size: 1rem;
          font-weight: 500;
          color: #1a73e8;
        }

        .calendar {
          width: 100%;
        }

        .weekdays {
          display: grid;
          grid-template-columns: 80px repeat(7, 1fr);
          gap: 1px;
          margin-bottom: 2px;
        }

        .weekdays-label {
          width: 80px;
          text-align: right;
          padding-right: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #666;
        }

        .weekday {
          text-align: center;
          font-size: 0.7rem;
          font-weight: 600;
          color: #666;
          padding: 4px 0;
        }

        .week-row {
          display: grid;
          grid-template-columns: 80px repeat(7, 1fr);
          gap: 1px;
          margin-bottom: 1px;
        }

        .week-label {
          width: 80px;
          text-align: right;
          padding-right: 12px;
          font-size: 0.65rem;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .day-cell {
          aspect-ratio: 1;
          border: 1px solid #e0e0e0;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          transition: all 0.15s;
          color: #333;
        }

        .day-cell:hover {
          background: #e8f0fe;
          border-color: #1a73e8;
        }

        .day-cell.other-month {
          color: #ccc;
          background: #fafafa;
        }

        .day-cell.today {
          background: #1a73e8;
          color: white;
          font-weight: 600;
        }

        .day-cell.selected {
          background: #34a853;
          color: white;
          font-weight: 600;
        }
      `}</style>

      <div className="page-container">
        <div className="calendar-container">
          <div className="calendar-header">
            <div className="month-label">Month:</div>
            <div className="month-display">January 2025</div>
          </div>

          <div className="calendar">
            <div className="weekdays">
              <div className="weekdays-label">Days:</div>
              <div className="weekday">S</div>
              <div className="weekday">M</div>
              <div className="weekday">T</div>
              <div className="weekday">W</div>
              <div className="weekday">T</div>
              <div className="weekday">F</div>
              <div className="weekday">S</div>
            </div>

            <div className="week-row">
              <div className="week-label">Week 1:</div>
              <button type="button" className="day-cell other-month" id="day-29" onClick={(e) => handleButtonClick(e, 'day-29')}>29</button>
              <button type="button" className="day-cell other-month" id="day-30" onClick={(e) => handleButtonClick(e, 'day-30')}>30</button>
              <button type="button" className="day-cell other-month" id="day-31" onClick={(e) => handleButtonClick(e, 'day-31')}>31</button>
              <button type="button" className="day-cell" id="day-1" onClick={(e) => handleButtonClick(e, 'day-1')}>1</button>
              <button type="button" className="day-cell" id="day-2" onClick={(e) => handleButtonClick(e, 'day-2')}>2</button>
              <button type="button" className="day-cell" id="day-3" onClick={(e) => handleButtonClick(e, 'day-3')}>3</button>
              <button type="button" className="day-cell" id="day-4" onClick={(e) => handleButtonClick(e, 'day-4')}>4</button>
            </div>

            <div className="week-row">
              <div className="week-label">Week 2:</div>
              <button type="button" className="day-cell" id="day-5" onClick={(e) => handleButtonClick(e, 'day-5')}>5</button>
              <button type="button" className="day-cell" id="day-6" onClick={(e) => handleButtonClick(e, 'day-6')}>6</button>
              <button type="button" className="day-cell" id="day-7" onClick={(e) => handleButtonClick(e, 'day-7')}>7</button>
              <button type="button" className="day-cell" id="day-8" onClick={(e) => handleButtonClick(e, 'day-8')}>8</button>
              <button type="button" className="day-cell" id="day-9" onClick={(e) => handleButtonClick(e, 'day-9')}>9</button>
              <button type="button" className="day-cell" id="day-10" onClick={(e) => handleButtonClick(e, 'day-10')}>10</button>
              <button type="button" className="day-cell" id="day-11" onClick={(e) => handleButtonClick(e, 'day-11')}>11</button>
            </div>

            <div className="week-row">
              <div className="week-label">Week 3:</div>
              <button type="button" className="day-cell" id="day-12" onClick={(e) => handleButtonClick(e, 'day-12')}>12</button>
              <button type="button" className="day-cell" id="day-13" onClick={(e) => handleButtonClick(e, 'day-13')}>13</button>
              <button type="button" className="day-cell" id="day-14" onClick={(e) => handleButtonClick(e, 'day-14')}>14</button>
              <button type="button" className="day-cell today" id="day-15" onClick={(e) => handleButtonClick(e, 'day-15')}>15</button>
              <button type="button" className="day-cell" id="day-16" onClick={(e) => handleButtonClick(e, 'day-16')}>16</button>
              <button type="button" className="day-cell" id="day-17" onClick={(e) => handleButtonClick(e, 'day-17')}>17</button>
              <button type="button" className="day-cell" id="day-18" onClick={(e) => handleButtonClick(e, 'day-18')}>18</button>
            </div>

            <div className="week-row">
              <div className="week-label">Week 4:</div>
              <button type="button" className="day-cell" id="day-19" onClick={(e) => handleButtonClick(e, 'day-19')}>19</button>
              <button type="button" className="day-cell" id="day-20" onClick={(e) => handleButtonClick(e, 'day-20')}>20</button>
              <button type="button" className="day-cell" id="day-21" onClick={(e) => handleButtonClick(e, 'day-21')}>21</button>
              <button type="button" className="day-cell" id="day-22" onClick={(e) => handleButtonClick(e, 'day-22')}>22</button>
              <button type="button" className="day-cell" id="day-23" onClick={(e) => handleButtonClick(e, 'day-23')}>23</button>
              <button type="button" className="day-cell" id="day-24" onClick={(e) => handleButtonClick(e, 'day-24')}>24</button>
              <button type="button" className="day-cell" id="day-25" onClick={(e) => handleButtonClick(e, 'day-25')}>25</button>
            </div>

            <div className="week-row">
              <div className="week-label">Week 5:</div>
              <button type="button" className="day-cell" id="day-26" onClick={(e) => handleButtonClick(e, 'day-26')}>26</button>
              <button type="button" className="day-cell" id="day-27" onClick={(e) => handleButtonClick(e, 'day-27')}>27</button>
              <button type="button" className="day-cell" id="day-28" onClick={(e) => handleButtonClick(e, 'day-28')}>28</button>
              <button type="button" className="day-cell" id="day-29b" onClick={(e) => handleButtonClick(e, 'day-29b')}>29</button>
              <button type="button" className="day-cell" id="day-30b" onClick={(e) => handleButtonClick(e, 'day-30b')}>30</button>
              <button type="button" className="day-cell" id="day-31b" onClick={(e) => handleButtonClick(e, 'day-31b')}>31</button>
              <button type="button" className="day-cell other-month" id="day-1-next" onClick={(e) => handleButtonClick(e, 'day-1-next')}>1</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
