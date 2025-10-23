import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioBce9({ onAction }: ScenarioProps) {
  const { handleButtonClick } = useInteractionHandlers(onAction);

  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seats = [1, 2, 3, 4, 5, 6, 7, 8];
  const occupiedSeats = new Set(['a3', 'a7', 'b4', 'b8', 'c2', 'd1', 'd5', 'e3', 'e4', 'f2', 'f6']);

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
          background: #1a1a1a;
          padding: 30px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .theater-container {
          text-align: center;
        }

        h1 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: #fff;
        }

        .stage {
          background: #4a4a4a;
          color: #fff;
          padding: 8px;
          margin-bottom: 20px;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .seating-area {
          display: inline-block;
          background: #2a2a2a;
          padding: 15px;
          border-radius: 8px;
        }

        .row {
          display: flex;
          align-items: center;
          margin-bottom: 2px;
        }

        .row-label {
          width: 40px;
          text-align: right;
          padding-right: 10px;
          color: #999;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .seats {
          display: flex;
          gap: 2px;
        }

        .seat-btn {
          width: 36px;
          height: 36px;
          border: 1px solid #555;
          border-radius: 4px;
          background: #3a3a3a;
          color: #999;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .seat-btn:hover:not(:disabled) {
          background: #4a90e2;
          border-color: #4a90e2;
          color: white;
          transform: scale(1.1);
          z-index: 10;
        }

        .seat-btn.selected {
          background: #2ecc71;
          border-color: #27ae60;
          color: white;
        }

        .seat-btn:disabled {
          background: #8b0000;
          border-color: #6b0000;
          color: #999;
          cursor: not-allowed;
        }

        .legend {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 20px;
          font-size: 0.85rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #ccc;
        }

        .legend-box {
          width: 24px;
          height: 24px;
          border: 1px solid #555;
          border-radius: 3px;
        }

        .legend-box.available {
          background: #3a3a3a;
        }
        .legend-box.selected {
          background: #2ecc71;
        }
        .legend-box.occupied {
          background: #8b0000;
        }
      `}</style>

      <div className="page-container">
        <div className="theater-container">
          <h1>Select Your Seat</h1>
          <div className="stage">STAGE</div>

          <div className="seating-area">
            {rows.map((row) => (
              <div key={row} className="row">
                <span className="row-label">{row}:</span>
                <div className="seats">
                  {seats.map((seat) => {
                    const seatId = `seat-${row.toLowerCase()}${seat}`;
                    const isOccupied = occupiedSeats.has(`${row.toLowerCase()}${seat}`);
                    return (
                      <button
                        key={seat}
                        className="seat-btn"
                        id={seatId}
                        data-seat={`${row}${seat}`}
                        disabled={isOccupied}
                        onClick={(e) => !isOccupied && handleButtonClick(e, seatId)}
                        type="button"
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="legend">
            <div className="legend-item">
              <div className="legend-box available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-box selected"></div>
              <span>Selected</span>
            </div>
            <div className="legend-item">
              <div className="legend-box occupied"></div>
              <span>Occupied</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
