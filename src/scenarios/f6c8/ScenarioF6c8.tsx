import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioF6c8({ onAction }: ScenarioProps) {
  const { handleButtonClick } = useInteractionHandlers(onAction);

  const colors = [
    // Row 1: Reds
    { id: 'color-8b0000', hex: '#8b0000', name: 'Dark Red' },
    { id: 'color-b22222', hex: '#b22222', name: 'Firebrick' },
    { id: 'color-dc143c', hex: '#dc143c', name: 'Crimson' },
    { id: 'color-ff0000', hex: '#ff0000', name: 'Red' },
    { id: 'color-ff4500', hex: '#ff4500', name: 'Orange Red' },
    { id: 'color-ff6347', hex: '#ff6347', name: 'Tomato' },
    { id: 'color-ff7f50', hex: '#ff7f50', name: 'Coral' },
    { id: 'color-ffa07a', hex: '#ffa07a', name: 'Light Salmon' },
    // Row 2: Oranges
    { id: 'color-ff8c00', hex: '#ff8c00', name: 'Dark Orange' },
    { id: 'color-ffa500', hex: '#ffa500', name: 'Orange' },
    { id: 'color-ffd700', hex: '#ffd700', name: 'Gold' },
    { id: 'color-ffff00', hex: '#ffff00', name: 'Yellow' },
    { id: 'color-ffffe0', hex: '#ffffe0', name: 'Light Yellow' },
    { id: 'color-fffacd', hex: '#fffacd', name: 'Lemon' },
    { id: 'color-fafad2', hex: '#fafad2', name: 'Light Goldenrod' },
    { id: 'color-ffe4b5', hex: '#ffe4b5', name: 'Moccasin' },
    // Row 3: Yellows/Greens
    { id: 'color-f0e68c', hex: '#f0e68c', name: 'Khaki' },
    { id: 'color-bdb76b', hex: '#bdb76b', name: 'Dark Khaki' },
    { id: 'color-adff2f', hex: '#adff2f', name: 'Green Yellow' },
    { id: 'color-7fff00', hex: '#7fff00', name: 'Chartreuse' },
    { id: 'color-7cfc00', hex: '#7cfc00', name: 'Lawn Green' },
    { id: 'color-00ff00', hex: '#00ff00', name: 'Lime' },
    { id: 'color-32cd32', hex: '#32cd32', name: 'Lime Green' },
    { id: 'color-00ff7f', hex: '#00ff7f', name: 'Spring Green' },
    // Row 4: Greens
    { id: 'color-00fa9a', hex: '#00fa9a', name: 'Medium Spring' },
    { id: 'color-90ee90', hex: '#90ee90', name: 'Light Green' },
    { id: 'color-98fb98', hex: '#98fb98', name: 'Pale Green' },
    { id: 'color-8fbc8f', hex: '#8fbc8f', name: 'Dark Sea Green' },
    { id: 'color-3cb371', hex: '#3cb371', name: 'Medium Sea Green' },
    { id: 'color-2e8b57', hex: '#2e8b57', name: 'Sea Green' },
    { id: 'color-228b22', hex: '#228b22', name: 'Forest Green' },
    { id: 'color-008000', hex: '#008000', name: 'Green' },
    // Row 5: Cyans
    { id: 'color-006400', hex: '#006400', name: 'Dark Green' },
    { id: 'color-00ffff', hex: '#00ffff', name: 'Cyan' },
    { id: 'color-00ced1', hex: '#00ced1', name: 'Dark Turquoise' },
    { id: 'color-40e0d0', hex: '#40e0d0', name: 'Turquoise' },
    { id: 'color-48d1cc', hex: '#48d1cc', name: 'Medium Turquoise' },
    { id: 'color-afeeee', hex: '#afeeee', name: 'Pale Turquoise' },
    { id: 'color-7fffd4', hex: '#7fffd4', name: 'Aquamarine' },
    { id: 'color-b0e0e6', hex: '#b0e0e6', name: 'Powder Blue' },
    // Row 6: Blues
    { id: 'color-add8e6', hex: '#add8e6', name: 'Light Blue' },
    { id: 'color-87ceeb', hex: '#87ceeb', name: 'Sky Blue' },
    { id: 'color-87cefa', hex: '#87cefa', name: 'Light Sky Blue' },
    { id: 'color-00bfff', hex: '#00bfff', name: 'Deep Sky Blue' },
    { id: 'color-1e90ff', hex: '#1e90ff', name: 'Dodger Blue' },
    { id: 'color-6495ed', hex: '#6495ed', name: 'Cornflower' },
    { id: 'color-4169e1', hex: '#4169e1', name: 'Royal Blue' },
    { id: 'color-0000ff', hex: '#0000ff', name: 'Blue' },
    // Row 7: Purples
    { id: 'color-0000cd', hex: '#0000cd', name: 'Medium Blue' },
    { id: 'color-00008b', hex: '#00008b', name: 'Dark Blue' },
    { id: 'color-000080', hex: '#000080', name: 'Navy' },
    { id: 'color-191970', hex: '#191970', name: 'Midnight Blue' },
    { id: 'color-7b68ee', hex: '#7b68ee', name: 'Medium Slate' },
    { id: 'color-6a5acd', hex: '#6a5acd', name: 'Slate Blue' },
    { id: 'color-483d8b', hex: '#483d8b', name: 'Dark Slate Blue' },
    { id: 'color-9370db', hex: '#9370db', name: 'Medium Purple' },
    // Row 8: Pinks/Purples
    { id: 'color-8b008b', hex: '#8b008b', name: 'Dark Magenta' },
    { id: 'color-9400d3', hex: '#9400d3', name: 'Dark Violet' },
    { id: 'color-9932cc', hex: '#9932cc', name: 'Dark Orchid' },
    { id: 'color-ba55d3', hex: '#ba55d3', name: 'Medium Orchid' },
    { id: 'color-ff00ff', hex: '#ff00ff', name: 'Magenta' },
    { id: 'color-ee82ee', hex: '#ee82ee', name: 'Violet' },
    { id: 'color-dda0dd', hex: '#dda0dd', name: 'Plum' },
    { id: 'color-ffc0cb', hex: '#ffc0cb', name: 'Pink' },
  ];

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
          font-family: 'Roboto', -apple-system, sans-serif;
          background: #2a2a2a;
          padding: 30px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .picker-container {
          text-align: center;
        }

        h1 {
          font-size: 1.5rem;
          margin-bottom: 20px;
          color: #fff;
        }

        .color-grid {
          display: inline-grid;
          grid-template-columns: repeat(8, 48px);
          grid-template-rows: repeat(8, 48px);
          gap: 1px;
          background: #1a1a1a;
          padding: 1px;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
        }

        .color-swatch {
          position: relative;
          width: 48px;
          height: 48px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          overflow: hidden;
        }

        .color-swatch:hover {
          transform: scale(1.15);
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
        }

        .color-swatch .label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          font-size: 7px;
          padding: 2px;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
          text-align: center;
          line-height: 1;
        }

        .color-swatch:hover .label {
          opacity: 1;
        }

        .selected-color {
          margin-top: 20px;
          color: #fff;
          font-size: 0.9rem;
        }
      `}</style>

      <div className="page-container">
        <div className="picker-container">
          <h1>Design Tool - Color Palette</h1>

          <div className="color-grid">
            {colors.map((color) => (
              <button
                key={color.id}
                className="color-swatch"
                id={color.id}
                style={{ background: color.hex }}
                onClick={(e) => handleButtonClick(e, color.id)}
                type="button"
              >
                <span className="label">{color.hex}</span>
              </button>
            ))}
          </div>

          <div className="selected-color">Hover over colors to see their names</div>
        </div>
      </div>
    </>
  );
}
