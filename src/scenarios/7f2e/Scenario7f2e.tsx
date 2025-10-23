import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function Scenario7f2e({ onAction }: ScenarioProps) {
  const { handleFieldFocus } = useInteractionHandlers(onAction);

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          padding: 40px 20px;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 50px 60px;
        }

        .header {
          margin-bottom: 40px;
        }

        h1 {
          font-size: 32px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 10px;
        }

        .subtitle {
          font-size: 16px;
          color: #666;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 24px;
        }

        label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
        }

        input[type="text"],
        input[type="email"],
        input[type="tel"],
        select,
        textarea {
          width: 100%;
          padding: 12px 16px;
          font-size: 15px;
          font-family: inherit;
          border: 1px solid #d0d0d0;
          border-radius: 6px;
          transition: all 0.2s;
          background: white;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }

        textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          width: 100%;
          padding: 14px 32px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          background: #4a90e2;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
        }

        .submit-btn:hover {
          background: #357abd;
        }

        .submit-btn:active {
          transform: scale(0.98);
        }
      `}</style>

      <div className="container">
        <div className="header">
          <h1>Get in Touch</h1>
          <p className="subtitle">
            Have a question or want to work together? Fill out the form below and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name-input">Full Name</label>
            <input
              type="text"
              id="name-input"
              placeholder="John Smith"
              onFocus={handleFieldFocus}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email-input">Email Address</label>
            <input
              type="email"
              id="email-input"
              placeholder="john@company.com"
              onFocus={handleFieldFocus}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone-input">Phone Number</label>
            <input
              type="tel"
              id="phone-input"
              placeholder="+1 (555) 123-4567"
              onFocus={handleFieldFocus}
            />
          </div>

          <div className="form-group">
            <label htmlFor="company-input">Company</label>
            <input
              type="text"
              id="company-input"
              placeholder="Your Company Inc."
              onFocus={handleFieldFocus}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject-select">Subject</label>
            <select
              id="subject-select"
              onFocus={handleFieldFocus}
            >
              <option value="">Select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="sales">Sales</option>
              <option value="support">Technical Support</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message-textarea">Message</label>
            <textarea
              id="message-textarea"
              placeholder="Tell us about your project or question..."
              onFocus={handleFieldFocus}
            />
          </div>

          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>
      </div>
    </>
  );
}
