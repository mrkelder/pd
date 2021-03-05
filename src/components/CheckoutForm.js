import React from 'react';
import { useStripe, useElements, CardElement, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import 'css/checkout.css';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmCardPayment('{CLIENT_SECRET}', {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Jenny Rosen',
        },
      }
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} id="checkout_form">
      <CardNumberElement options={{ placeholder: "Card number" }} />
      <CardExpiryElement options={{ placeholder: "Expiration date (MM / YY)" }} />
      <CardCvcElement />
      <button disabled={!stripe} type="submit" style={{ display: "none" }} id="checkout_button"></button>
      {/* <Button className="c_input submit_btn" variant="contained" size="medium" color="primary">Confirm order</Button> */}
    </form>
  );
}

export default CheckoutForm;
