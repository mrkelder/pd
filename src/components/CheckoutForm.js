import React from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import 'css/checkout.css';
import { useDispatch } from 'react-redux';
import axios from 'axios';

function CheckoutForm({ setWaiting, totalPrice, fN, lN, email, postal, country, city, items, address, actualBilling, details, shipping, setSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const handleSubmit = async event => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    setWaiting(true);
    const { data: client_secret } = await axios.get("http://localhost:8080/getPaymentSecret", {
      params: {
        price: totalPrice * 100,
        description: `${address}, ${city}, ${[...postal].length === 0 ? 'no postal code' : postal}, ${country},${items.map(item => ` ${item.name} (x${item.amount})`)}. Actual billing: ${actualBilling}. Special instructions: ${details}. Shipping: ${shipping === 'fs' ? 'Canada Post Small Packet International Surface' : 'Canada Post Small Packet International Air'}`
      }
    });
    const result = await stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: `${fN} ${lN}`,
          email
        },
      }
    });

    if (result.error) {
      // Show error to your customer
      setSuccess(false);
      setWaiting(false);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        setSuccess(true);
        setWaiting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} id="checkout_form">
      <CardNumberElement options={{ placeholder: "Card number" }} />
      <CardExpiryElement options={{ placeholder: "Expiration date (MM / YY)" }} />
      <CardCvcElement />
      <button disabled={!stripe} type="submit" style={{ display: "none" }} id="checkout_button"></button>
    </form>
  );
}

export default CheckoutForm;
