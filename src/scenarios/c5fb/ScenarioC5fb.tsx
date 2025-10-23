import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioC5fb({ onAction }: ScenarioProps) {
  const { handleButtonClick } = useInteractionHandlers(onAction);

  const keys = [
    // Row 1: Numbers
    { id: 'key-1', char: '1' },
    { id: 'key-2', char: '2' },
    { id: 'key-3', char: '3' },
    { id: 'key-4', char: '4' },
    { id: 'key-5', char: '5' },
    { id: 'key-6', char: '6' },
    { id: 'key-7', char: '7' },
    { id: 'key-8', char: '8' },
    { id: 'key-9', char: '9' },
    { id: 'key-0', char: '0' },
  ];

  const row2 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  const row3 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  const row4 = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

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
          background: #f0f0f0;
          padding: 30px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .keyboard-container {
          text-align: center;
        }

        h1 {
          font-size: 1.3rem;
          margin-bottom: 15px;
          color: #333;
        }

        .output-display {
          background: white;
          border: 2px solid #ccc;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          min-height: 50px;
          font-size: 1.2rem;
          font-family: monospace;
          color: #333;
          text-align: left;
        }

        .keyboard {
          display: inline-block;
          background: #e0e0e0;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .keyboard-row {
          display: flex;
          justify-content: center;
          gap: 1px;
          margin-bottom: 1px;
        }

        .key {
          width: 38px;
          height: 38px;
          border: 1px solid #999;
          border-radius: 4px;
          background: white;
          color: #333;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s;
          box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
        }

        .key:hover {
          background: #4a90e2;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        }

        .key:active {
          transform: translateY(1px);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .key.wide {
          width: 58px;
        }

        .key.extra-wide {
          width: 100px;
        }
      `}</style>

      <div className="page-container">
        <div className="keyboard-container">
          <h1>Virtual Keyboard</h1>

          <div className="output-display"></div>

          <div className="keyboard">
            {/* Row 1: Numbers */}
            <div className="keyboard-row">
              {keys.map((key) => (
                <button
                  key={key.id}
                  className="key"
                  id={key.id}
                  data-char={key.char}
                  onClick={(e) => handleButtonClick(e, key.id)}
                  type="button"
                >
                  {key.char}
                </button>
              ))}
            </div>

            {/* Row 2: QWERTY */}
            <div className="keyboard-row">
              {row2.map((char) => (
                <button
                  key={`key-${char}`}
                  className="key"
                  id={`key-${char}`}
                  data-char={char}
                  onClick={(e) => handleButtonClick(e, `key-${char}`)}
                  type="button"
                >
                  {char.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Row 3: ASDFGH */}
            <div className="keyboard-row">
              {row3.map((char) => (
                <button
                  key={`key-${char}`}
                  className="key"
                  id={`key-${char}`}
                  data-char={char}
                  onClick={(e) => handleButtonClick(e, `key-${char}`)}
                  type="button"
                >
                  {char.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Row 4: ZXCVBN */}
            <div className="keyboard-row">
              {row4.map((char) => (
                <button
                  key={`key-${char}`}
                  className="key"
                  id={`key-${char}`}
                  data-char={char}
                  onClick={(e) => handleButtonClick(e, `key-${char}`)}
                  type="button"
                >
                  {char.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Row 5: Space and special keys */}
            <div className="keyboard-row">
              <button
                className="key wide"
                id="key-backspace"
                data-char="⌫"
                onClick={(e) => handleButtonClick(e, 'key-backspace')}
                type="button"
              >
                ⌫
              </button>
              <button
                className="key extra-wide"
                id="key-space"
                data-char=" "
                onClick={(e) => handleButtonClick(e, 'key-space')}
                type="button"
              >
                Space
              </button>
              <button
                className="key wide"
                id="key-enter"
                data-char="↵"
                onClick={(e) => handleButtonClick(e, 'key-enter')}
                type="button"
              >
                ↵
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
