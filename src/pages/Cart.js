import React, { useState } from 'react';
import { Breadcrumbs } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from 'components/CartItem';
import Button from 'components/Button';
import arrow from 'img/arrow.svg';
import red_discount from 'img/red_discount.svg';
import 'css/cart.css';

function Cart() {
  const { items } = useSelector(state => state.cart);
  const { windowSize } = useSelector(state => state.windowSize);
  const [details, setDetails] = useState('');

  return (
    <div id="cart_page">
      <Breadcrumbs id="bread_crumbs" separator={<img src={arrow} alt="arrow" style={{ transform: 'rotate(180deg)', width: '8px' }} />} aria-label="breadcrumb">
        <Link to="/">Home</Link>
        <p>Your Shopping Cart</p>
      </Breadcrumbs>
      { windowSize >= 1000 &&
        <section id="cart_items_options">
          <span>Price</span>
          <span>Quantity</span>
          <span>Total</span>
        </section>
      }
      <section id="cart_items">
        {
          items.map(({ photos, price, _id, amount }) => <CartItem img={photos[0]} price={price} id={_id} quantity={amount} key={`cart_${_id}`} />)
        }
      </section>
      <section id="payment">
        <div id="details">
          <h2>Special instructions for seller</h2>
          <textarea value={details} onChange={({ target: { value } }) => { setDetails(value); }} />
        </div>
        <div id="checkout">
          <div id="free_shipping">
            <img src={red_discount} alt="red_discount" />
            <span>FREE SHIPPING -$10.00</span>
          </div>
          <span id="sub">Subtotal $230.00</span>
          <span id="taxes">Taxes and shipping calculated at checkout</span>
          <Button>CONTINUE SHOPPING</Button>
          <Button>CHECK OUT</Button>
        </div>
      </section>
    </div>
  );
}

export default Cart;
