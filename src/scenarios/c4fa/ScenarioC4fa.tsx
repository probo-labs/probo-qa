import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioC4fa({ onAction }: ScenarioProps) {
  const { handleFieldFocus } = useInteractionHandlers(onAction);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const times = ['morning', 'afternoon', 'evening'];
  const timeEmojis = { morning: '🌅', afternoon: '🌞', evening: '🌙' };

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
          font-family: 'Segoe UI', Tahoma, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-size: 12px;
        }

        .scheduler-container {
          max-width: 750px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        h1 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: #333;
          text-align: center;
        }

        .month-label {
          text-align: center;
          font-size: 1.1rem;
          color: #667eea;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: 40px repeat(3, 1fr);
          gap: 3px;
          margin-bottom: 15px;
        }

        .calendar-header {
          background: #f5f5f5;
          padding: 8px;
          text-align: center;
          font-weight: bold;
          font-size: 0.75rem;
          border: 1px solid #ddd;
        }

        .calendar-header.day-col {
          background: #667eea;
          color: white;
          border-color: #5568d3;
        }

        .day-number {
          background: #f9f9f9;
          padding: 8px;
          text-align: center;
          font-weight: 600;
          color: #666;
          border: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .time-slot {
          border: 1px solid #ddd;
          padding: 2px;
          background: white;
        }

        .time-slot input {
          width: 100%;
          border: none;
          padding: 6px 4px;
          font-size: 0.7rem;
          font-family: 'Courier New', monospace;
          background: transparent;
          text-align: center;
        }

        .time-slot input:focus {
          outline: none;
          background: #fff8dc;
        }

        .emoji-hint {
          font-size: 0.9rem;
          display: block;
          margin-bottom: 2px;
        }
      `}</style>

      <div className="page-container">
        <div className="scheduler-container">
          <h1>📅 Monthly Appointment Scheduler</h1>
          <div className="month-label">January 2025</div>

          <div className="calendar-grid">
            {/* Header Row */}
            <div className="calendar-header day-col">Day</div>
            <div className="calendar-header">🌅</div>
            <div className="calendar-header">🌞</div>
            <div className="calendar-header">🌙</div>

            {/* Day Rows */}
            {days.map((day) => (
              <>
                <div key={`day-${day}`} className="day-number">
                  {day}
                </div>
                {times.map((time) => (
                  <div key={`day-${day}-${time}`} className="time-slot">
                    <span className="emoji-hint">{timeEmojis[time as keyof typeof timeEmojis]}</span>
                    <input type="text" id={`day-${day}-${time}`} onFocus={handleFieldFocus} />
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
