import { useInteractionHandlers } from '../shared/handlers';
import type { ScenarioProps } from '../shared/types';

export default function ScenarioF4c6({ onAction }: ScenarioProps) {
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
          font-family: 'Roboto', -apple-system, sans-serif;
          background: #f5f5f5;
          padding: 30px 20px;
        }

        .checkout-container {
          max-width: 700px;
          margin: 0 auto;
        }

        h1 {
          font-size: 1.8rem;
          margin-bottom: 25px;
          color: #333;
        }

        .card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 25px;
          margin-bottom: 20px;
        }

        .card-title {
          font-size: 1.1rem;
          margin-bottom: 20px;
          color: #555;
          font-weight: 500;
        }

        .input-field {
          position: relative;
          margin-bottom: 22px;
        }

        .input-field input {
          width: 100%;
          padding: 10px 10px 6px 10px;
          border: none;
          border-bottom: 1px solid #ddd;
          font-size: 0.95rem;
          background: transparent;
          transition: border-color 0.3s;
        }

        .input-field input:focus {
          outline: none;
          border-bottom-color: #1976d2;
        }

        .input-field label {
          position: absolute;
          left: 10px;
          top: 10px;
          color: #999;
          font-size: 0.95rem;
          pointer-events: none;
          transition: all 0.3s;
        }

        .input-field input:focus + label,
        .input-field input:not(:placeholder-shown) + label {
          top: -6px;
          font-size: 0.7rem;
          color: #1976d2;
        }
      `}</style>

      <div className="page-container">
        <div className="checkout-container">
          <h1>Checkout</h1>

          <div className="card">
            <div className="card-title">Billing Information</div>

            <div className="input-field">
              <input type="text" id="fullname-input" placeholder=" " onFocus={handleFieldFocus} />
              <label htmlFor="fullname-input">Full Name</label>
            </div>

            <div className="input-field">
              <input type="text" id="address-input" placeholder=" " onFocus={handleFieldFocus} />
              <label htmlFor="address-input">Street Address</label>
            </div>

            <div className="input-field">
              <input type="text" id="city-input" placeholder=" " onFocus={handleFieldFocus} />
              <label htmlFor="city-input">City</label>
            </div>

            <div className="input-field">
              <input type="text" id="zip-input" placeholder=" " onFocus={handleFieldFocus} />
              <label htmlFor="zip-input">ZIP Code</label>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Payment Details</div>

            <div className="input-field">
              <input type="text" id="cardnumber-input" placeholder=" " onFocus={handleFieldFocus} />
              <label htmlFor="cardnumber-input">Card Number</label>
            </div>

            <div className="input-field">
              <input type="text" id="expiry-input" placeholder=" " onFocus={handleFieldFocus} />
              <label htmlFor="expiry-input">Expiry Date</label>
            </div>

            <div className="input-field">
              <input type="text" id="cvv-input" placeholder=" " onFocus={handleFieldFocus} />
              <label htmlFor="cvv-input">CVV</label>
            </div>

            <div className="input-field">
              <input type="text" id="cardholder-input" placeholder=" " onFocus={handleFieldFocus} />
              <label htmlFor="cardholder-input">Cardholder Name</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
