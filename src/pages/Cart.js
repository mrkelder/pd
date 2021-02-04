import React, { useState } from 'react';
import { Breadcrumbs } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from 'components/CartItem';
import arrow from 'img/arrow.svg';
import 'css/cart.css';

function Cart() {
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
        <CartItem />
        {
          new Array(1).fill(1).map((i, index) => <CartItem img="a_hoodie.webp" price={5} key={`cart_${index}`} />)
        }
      </section>
      <section id="payment">
        <div id="details">
          <h2>Special instructions for seller</h2>
          <textarea value={details} onChange={({ target: { value } }) => { setDetails(value); }} />
        </div>
      </section>
    </div>
  );
}

export default Cart;
