import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioEab4({ onAction }: ScenarioProps) {
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
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8f9fa;
          padding: 30px 20px;
          min-height: 100vh;
        }

        .form-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
          font-size: 1.2rem;
          margin-bottom: 15px;
          color: #333;
        }

        h2 {
          font-size: 0.85rem;
          margin-top: 12px;
          margin-bottom: 8px;
          color: #666;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 4px;
        }

        .form-group {
          margin-bottom: 8px;
        }

        .form-group label {
          display: block;
          margin-bottom: 3px;
          color: #555;
          font-weight: 500;
          font-size: 0.75rem;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 5px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
        }

        textarea {
          min-height: 60px;
          resize: vertical;
        }
      `}</style>

      <div className="page-container">
        <div className="form-container">
          <h1>📝 Job Application Form</h1>

          <h2>Personal Information</h2>
          <div className="form-group">
            <label htmlFor="firstname-input">First Name</label>
            <input type="text" id="firstname-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="lastname-input">Last Name</label>
            <input type="text" id="lastname-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="email-input">Email</label>
            <input type="email" id="email-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="phone-input">Phone</label>
            <input type="tel" id="phone-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="address-input">Address</label>
            <input type="text" id="address-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="city-input">City</label>
            <input type="text" id="city-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="state-input">State</label>
            <input type="text" id="state-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="zip-input">Zip Code</label>
            <input type="text" id="zip-input" onFocus={handleFieldFocus} />
          </div>

          <h2>Education</h2>
          <div className="form-group">
            <label htmlFor="degree-input">Degree</label>
            <input type="text" id="degree-input" placeholder="e.g., Bachelor of Science" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="school-input">School</label>
            <input type="text" id="school-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="major-input">Major</label>
            <input type="text" id="major-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="gpa-input">GPA</label>
            <input type="text" id="gpa-input" placeholder="e.g., 3.5" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="gradyear-input">Graduation Year</label>
            <input type="text" id="gradyear-input" placeholder="e.g., 2020" onFocus={handleFieldFocus} />
          </div>

          <h2>Experience (Most Recent Job)</h2>
          <div className="form-group">
            <label htmlFor="company1-input">Company</label>
            <input type="text" id="company1-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="title1-input">Title</label>
            <input type="text" id="title1-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="start1-input">Start Date</label>
            <input type="text" id="start1-input" placeholder="MM/YYYY" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="end1-input">End Date</label>
            <input type="text" id="end1-input" placeholder="MM/YYYY or Present" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="desc1-input">Description</label>
            <textarea id="desc1-input" onFocus={handleFieldFocus}></textarea>
          </div>

          <h2>Experience (Previous Job)</h2>
          <div className="form-group">
            <label htmlFor="company2-input">Company</label>
            <input type="text" id="company2-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="title2-input">Title</label>
            <input type="text" id="title2-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="start2-input">Start Date</label>
            <input type="text" id="start2-input" placeholder="MM/YYYY" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="end2-input">End Date</label>
            <input type="text" id="end2-input" placeholder="MM/YYYY" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="desc2-input">Description</label>
            <textarea id="desc2-input" onFocus={handleFieldFocus}></textarea>
          </div>

          <h2>References</h2>
          <div className="form-group">
            <label htmlFor="ref1name-input">Reference 1 Name</label>
            <input type="text" id="ref1name-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="ref1rel-input">Relationship</label>
            <input type="text" id="ref1rel-input" placeholder="e.g., Former Manager" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="ref1phone-input">Phone</label>
            <input type="tel" id="ref1phone-input" onFocus={handleFieldFocus} />
          </div>

          <h2>Additional</h2>
          <div className="form-group">
            <label htmlFor="portfolio-input">Portfolio URL</label>
            <input type="url" id="portfolio-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="linkedin-input">LinkedIn URL</label>
            <input type="url" id="linkedin-input" onFocus={handleFieldFocus} />
          </div>

          <div className="form-group">
            <label htmlFor="availability-input">Availability Date</label>
            <input type="text" id="availability-input" placeholder="MM/DD/YYYY" onFocus={handleFieldFocus} />
          </div>
        </div>
      </div>
    </>
  );
}
