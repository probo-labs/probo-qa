import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioA9d6({ onAction }: ScenarioProps) {
  const { handleFieldFocus } = useInteractionHandlers(onAction);

  const questions = [
    'Q1: What is your name?',
    'Q2: What is your age?',
    'Q3: Your occupation?',
    'Q4: How did you hear about us?',
    'Q5: How long have you been a customer?',
    'Q6: Rate our product quality (1-10)',
    'Q7: Rate our customer service (1-10)',
    'Q8: Rate our pricing (1-10)',
    'Q9: Would you recommend us?',
    'Q10: What do you like most?',
    'Q11: What needs improvement?',
    'Q12: Any additional features desired?',
    'Q13: How often do you use our product?',
    'Q14: Which competitor products do you use?',
    'Q15: What is your budget range?',
    'Q16: Your company size?',
    'Q17: Your industry?',
    'Q18: Your job role?',
    'Q19: Decision maker or influencer?',
    'Q20: Preferred contact method?',
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
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f5f5f5;
          padding: 20px 15px;
          font-size: 13px;
        }

        .survey-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          padding: 25px;
        }

        h1 {
          font-size: 1.4rem;
          margin-bottom: 20px;
          color: #333;
        }

        .question-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 15px;
        }

        input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.85rem;
        }

        input:focus {
          outline: none;
          border-color: #666;
        }

        input::placeholder {
          color: #aaa;
          font-size: 0.8rem;
        }
      `}</style>

      <div className="page-container">
        <div className="survey-container">
          <h1>Customer Feedback Survey</h1>

          <div className="question-grid">
            {questions.map((question, index) => (
              <input
                key={index}
                type="text"
                id={`q${index + 1}-input`}
                placeholder={question}
                onFocus={handleFieldFocus}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
