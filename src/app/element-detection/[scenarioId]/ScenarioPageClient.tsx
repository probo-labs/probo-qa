'use client';

// Client Component for Scenario a3c9 - Sparse Landing Page
// Minimalist SaaS landing page with 3 interactive elements

import { useState } from 'react';

interface ScenarioPageClientProps {
  scenarioId: string;
  instructionHint: string;
}

export default function ScenarioPageClient({ scenarioId, instructionHint }: ScenarioPageClientProps) {
  const handleEmailFocus = async () => {
    // Record every focus event (no guard) to allow sequence recording
    try {
      const response = await fetch(`/api/tests/${scenarioId}/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'FILL',
          element: 'newsletter-email',
          value: '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Dispatch event with validation data for instant UI update
        window.dispatchEvent(new CustomEvent('probo:actionRecorded', {
          detail: data.validation
        }));
      }
    } catch (error) {
      console.error('Failed to record action:', error);
    }
  };

  const handleContactClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/tests/${scenarioId}/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'CLICK',
          element: 'contact-link',
          value: '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Dispatch event with validation data for instant UI update
        window.dispatchEvent(new CustomEvent('probo:actionRecorded', {
          detail: data.validation
        }));
      }
    } catch (error) {
      console.error('Failed to record action:', error);
    }
  };

  const handleSubmitClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Record every click event (no guard) to allow sequence recording
    try {
      const response = await fetch(`/api/tests/${scenarioId}/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'CLICK',
          element: 'submit-button',
          value: '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Dispatch event with validation data for instant UI update
        window.dispatchEvent(new CustomEvent('probo:actionRecorded', {
          detail: data.validation
        }));
      }
    } catch (error) {
      console.error('Failed to record action:', error);
    }
  };

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        header {
          padding: 30px 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          padding: 10px 20px;
          border-radius: 6px;
          transition: background 0.2s;
          cursor: pointer;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 100px 40px;
        }

        h1 {
          font-size: 56px;
          font-weight: 800;
          color: white;
          margin-bottom: 24px;
          line-height: 1.2;
          max-width: 800px;
        }

        .subtitle {
          font-size: 22px;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 80px;
          max-width: 600px;
          line-height: 1.5;
        }

        .newsletter-container {
          background: white;
          padding: 50px 60px;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 500px;
          width: 100%;
        }

        .newsletter-heading {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .newsletter-text {
          font-size: 15px;
          color: #666;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .form-group {
          margin-bottom: 24px;
        }

        input[type="email"] {
          width: 100%;
          padding: 16px 20px;
          font-size: 16px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          transition: all 0.2s;
          font-family: inherit;
        }

        input[type="email"]:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .submit-btn:active {
          transform: translateY(0);
        }
      `}</style>

      <div className="page-container">
        {/* Header with minimal navigation */}
        <header>
          <div className="logo">Streamline</div>
          <a
            href="#"
            className="nav-link"
            id="contact-link"
            onClick={handleContactClick}
          >
            Contact
          </a>
        </header>

        {/* Hero section */}
        <div className="hero">
          <h1>Build Better Workflows, Faster</h1>
          <p className="subtitle">
            The modern platform for teams who ship quality products.
          </p>

          {/* Newsletter signup form */}
          <div className="newsletter-container">
            <h2 className="newsletter-heading">Get Early Access</h2>
            <p className="newsletter-text">
              Join 2,000+ teams already building with Streamline.
            </p>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <input
                  type="email"
                  id="newsletter-email"
                  name="value"
                  placeholder="Enter your work email"
                  onFocus={handleEmailFocus}
                />
              </div>

              <button
                type="submit"
                id="submit-button"
                className="submit-btn"
                onClick={handleSubmitClick}
              >
                Get Started
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
