import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioAad7({ onAction }: ScenarioProps) {
  const { handleButtonClick } = useInteractionHandlers(onAction);

  const emojis = [
    // Row 1: Smileys
    { id: 'emoji-smile', emoji: '😊', name: ':smile:' },
    { id: 'emoji-grin', emoji: '😀', name: ':grin:' },
    { id: 'emoji-joy', emoji: '😂', name: ':joy:' },
    { id: 'emoji-rofl', emoji: '🤣', name: ':rofl:' },
    { id: 'emoji-smiley', emoji: '😃', name: ':smiley:' },
    { id: 'emoji-sweat-smile', emoji: '😅', name: ':sweat_smile:' },
    { id: 'emoji-laughing', emoji: '😆', name: ':laughing:' },
    { id: 'emoji-wink', emoji: '😉', name: ':wink:' },
    // Row 2
    { id: 'emoji-blush', emoji: '😊', name: ':blush:' },
    { id: 'emoji-innocent', emoji: '😇', name: ':innocent:' },
    { id: 'emoji-heart-eyes', emoji: '😍', name: ':heart_eyes:' },
    { id: 'emoji-star-struck', emoji: '🤩', name: ':star_struck:' },
    { id: 'emoji-kissing-heart', emoji: '😘', name: ':kissing_heart:' },
    { id: 'emoji-kissing', emoji: '😗', name: ':kissing:' },
    { id: 'emoji-relaxed', emoji: '☺️', name: ':relaxed:' },
    { id: 'emoji-yum', emoji: '😋', name: ':yum:' },
    // Row 3
    { id: 'emoji-stuck-out-tongue', emoji: '😛', name: ':stuck_out_tongue:' },
    { id: 'emoji-stuck-out-tongue-winking', emoji: '😜', name: ':stuck_out_tongue_winking:' },
    { id: 'emoji-zany-face', emoji: '🤪', name: ':zany_face:' },
    { id: 'emoji-stuck-out-tongue-closed-eyes', emoji: '😝', name: ':stuck_out_tongue_closed_eyes:' },
    { id: 'emoji-money-mouth', emoji: '🤑', name: ':money_mouth:' },
    { id: 'emoji-hugging', emoji: '🤗', name: ':hugging:' },
    { id: 'emoji-thinking', emoji: '🤔', name: ':thinking:' },
    { id: 'emoji-zipper-mouth', emoji: '🤐', name: ':zipper_mouth:' },
    // Row 4
    { id: 'emoji-neutral', emoji: '😐', name: ':neutral:' },
    { id: 'emoji-expressionless', emoji: '😑', name: ':expressionless:' },
    { id: 'emoji-no-mouth', emoji: '😶', name: ':no_mouth:' },
    { id: 'emoji-smirk', emoji: '😏', name: ':smirk:' },
    { id: 'emoji-unamused', emoji: '😒', name: ':unamused:' },
    { id: 'emoji-rolling-eyes', emoji: '🙄', name: ':rolling_eyes:' },
    { id: 'emoji-grimacing', emoji: '😬', name: ':grimacing:' },
    { id: 'emoji-lying', emoji: '🤥', name: ':lying:' },
    // Row 5
    { id: 'emoji-relieved', emoji: '😌', name: ':relieved:' },
    { id: 'emoji-pensive', emoji: '😔', name: ':pensive:' },
    { id: 'emoji-sleepy', emoji: '😪', name: ':sleepy:' },
    { id: 'emoji-drooling', emoji: '🤤', name: ':drooling:' },
    { id: 'emoji-sleeping', emoji: '😴', name: ':sleeping:' },
    { id: 'emoji-mask', emoji: '😷', name: ':mask:' },
    { id: 'emoji-face-with-thermometer', emoji: '🤒', name: ':face_with_thermometer:' },
    { id: 'emoji-face-with-head-bandage', emoji: '🤕', name: ':face_with_head_bandage:' },
    // Row 6
    { id: 'emoji-nauseated', emoji: '🤢', name: ':nauseated:' },
    { id: 'emoji-vomiting', emoji: '🤮', name: ':vomiting:' },
    { id: 'emoji-sneezing', emoji: '🤧', name: ':sneezing:' },
    { id: 'emoji-hot', emoji: '🥵', name: ':hot:' },
    { id: 'emoji-cold', emoji: '🥶', name: ':cold:' },
    { id: 'emoji-dizzy', emoji: '😵', name: ':dizzy:' },
    { id: 'emoji-exploding-head', emoji: '🤯', name: ':exploding_head:' },
    { id: 'emoji-cowboy', emoji: '🤠', name: ':cowboy:' },
    // Row 7
    { id: 'emoji-thumbsup', emoji: '👍', name: ':thumbsup:' },
    { id: 'emoji-thumbsdown', emoji: '👎', name: ':thumbsdown:' },
    { id: 'emoji-clap', emoji: '👏', name: ':clap:' },
    { id: 'emoji-raised-hands', emoji: '🙌', name: ':raised_hands:' },
    { id: 'emoji-ok-hand', emoji: '👌', name: ':ok_hand:' },
    { id: 'emoji-raised-hand', emoji: '✋', name: ':raised_hand:' },
    { id: 'emoji-victory', emoji: '✌️', name: ':victory:' },
    { id: 'emoji-crossed-fingers', emoji: '🤞', name: ':crossed_fingers:' },
    // Row 8
    { id: 'emoji-heart', emoji: '❤️', name: ':heart:' },
    { id: 'emoji-orange-heart', emoji: '🧡', name: ':orange_heart:' },
    { id: 'emoji-yellow-heart', emoji: '💛', name: ':yellow_heart:' },
    { id: 'emoji-green-heart', emoji: '💚', name: ':green_heart:' },
    { id: 'emoji-blue-heart', emoji: '💙', name: ':blue_heart:' },
    { id: 'emoji-purple-heart', emoji: '💜', name: ':purple_heart:' },
    { id: 'emoji-black-heart', emoji: '🖤', name: ':black_heart:' },
    { id: 'emoji-fire', emoji: '🔥', name: ':fire:' },
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
          font-family: 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif;
          background: #f9f9f9;
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
          font-size: 1.3rem;
          margin-bottom: 15px;
          color: #333;
        }

        .emoji-grid {
          display: inline-grid;
          grid-template-columns: repeat(8, 54px);
          grid-template-rows: repeat(8, 54px);
          gap: 2px;
          background: white;
          padding: 8px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .emoji-btn {
          position: relative;
          width: 54px;
          height: 54px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          overflow: visible;
        }

        .emoji-btn:hover {
          transform: scale(1.2);
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          border-color: #4a90e2;
        }

        .emoji-btn .tooltip {
          position: absolute;
          bottom: -28px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.85);
          color: white;
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 4px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
          z-index: 20;
          font-family: -apple-system, sans-serif;
        }

        .emoji-btn:hover .tooltip {
          opacity: 1;
        }

        .selected-emoji {
          margin-top: 30px;
          color: #555;
          font-size: 0.9rem;
          font-family: -apple-system, sans-serif;
        }
      `}</style>

      <div className="page-container">
        <div className="picker-container">
          <h1>Emoji Reactions</h1>

          <div className="emoji-grid">
            {emojis.map((emoji) => (
              <button
                key={emoji.id}
                className="emoji-btn"
                id={emoji.id}
                type="button"
                onClick={(e) => handleButtonClick(e, emoji.id)}
              >
                {emoji.emoji}
                <span className="tooltip">{emoji.name}</span>
              </button>
            ))}
          </div>

          <div className="selected-emoji">Hover over emojis to see their names</div>
        </div>
      </div>
    </>
  );
}
