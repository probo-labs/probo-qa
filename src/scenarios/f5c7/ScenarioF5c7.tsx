import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioF5c7({ onAction }: ScenarioProps) {
  const { handleFieldFocus } = useInteractionHandlers(onAction);

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
          font-family: 'Roboto', sans-serif;
          background: #fafafa;
          padding: 20px 15px;
          font-size: 13px;
        }

        .intake-form {
          max-width: 900px;
          margin: 0 auto;
        }

        h1 {
          font-size: 1.4rem;
          margin-bottom: 18px;
          color: #333;
        }

        .section {
          background: white;
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          padding: 18px;
          margin-bottom: 15px;
        }

        .section-title {
          font-size: 0.95rem;
          margin-bottom: 14px;
          color: #555;
          font-weight: 500;
          border-bottom: 1px solid #eee;
          padding-bottom: 6px;
        }

        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 15px;
        }

        .input-field {
          position: relative;
        }

        .input-field input {
          width: 100%;
          padding: 8px 8px 4px 8px;
          border: none;
          border-bottom: 1px solid #ddd;
          font-size: 0.85rem;
          background: transparent;
          transition: border-color 0.2s;
        }

        .input-field input:focus {
          outline: none;
          border-bottom-color: #1976d2;
        }

        .input-field label {
          position: absolute;
          left: 8px;
          top: 8px;
          color: #999;
          font-size: 0.85rem;
          pointer-events: none;
          transition: all 0.2s;
        }

        .input-field input:focus + label,
        .input-field input:not(:placeholder-shown) + label {
          top: -5px;
          font-size: 0.65rem;
          color: #1976d2;
        }
      `}</style>

      <div className="page-container">
        <div className="intake-form">
          <h1>Patient Registration</h1>

          <div className="section">
            <div className="section-title">Demographics</div>
            <div className="field-grid">
              <div className="input-field">
                <input type="text" id="patient-firstname-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>First Name</label>
              </div>
              <div className="input-field">
                <input type="text" id="patient-lastname-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Last Name</label>
              </div>
              <div className="input-field">
                <input type="text" id="dob-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Date of Birth</label>
              </div>
              <div className="input-field">
                <input type="text" id="gender-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Gender</label>
              </div>
              <div className="input-field">
                <input type="text" id="patient-phone-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Phone Number</label>
              </div>
              <div className="input-field">
                <input type="text" id="patient-email-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Email</label>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Address</div>
            <div className="field-grid">
              <div className="input-field">
                <input type="text" id="street-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Street Address</label>
              </div>
              <div className="input-field">
                <input type="text" id="apt-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Apt/Unit</label>
              </div>
              <div className="input-field">
                <input type="text" id="patient-city-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>City</label>
              </div>
              <div className="input-field">
                <input type="text" id="patient-state-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>State</label>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Insurance Information</div>
            <div className="field-grid">
              <div className="input-field">
                <input type="text" id="insurance-company-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Insurance Company</label>
              </div>
              <div className="input-field">
                <input type="text" id="policy-number-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Policy Number</label>
              </div>
              <div className="input-field">
                <input type="text" id="group-number-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Group Number</label>
              </div>
              <div className="input-field">
                <input type="text" id="subscriber-name-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Subscriber Name</label>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Emergency Contact</div>
            <div className="field-grid">
              <div className="input-field">
                <input type="text" id="emergency-name-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Contact Name</label>
              </div>
              <div className="input-field">
                <input type="text" id="emergency-phone-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Contact Phone</label>
              </div>
              <div className="input-field">
                <input type="text" id="emergency-relation-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Relationship</label>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Medical History</div>
            <div className="field-grid">
              <div className="input-field">
                <input type="text" id="allergies-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Allergies</label>
              </div>
              <div className="input-field">
                <input type="text" id="medications-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Current Medications</label>
              </div>
              <div className="input-field">
                <input type="text" id="conditions-input" placeholder=" " onFocus={handleFieldFocus} />
                <label>Medical Conditions</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
