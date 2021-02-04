import React from 'react';
import { Breadcrumbs } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartItem from 'components/CartItem';
import arrow from 'img/arrow.svg';
import 'css/cart.css';

function Cart() {
  const { windowSize } = useSelector(state => state.windowSize);

  return (
    <div id="cart_page">
      <Breadcrumbs id="bread_crumbs" separator={<img src={arrow} alt="arrow" style={{ transform: 'rotate(180deg)', width: '8px' }} />} aria-label="breadcrumb">
        <Link to="/">Home</Link>
        <p>Your Shopping Cart</p>
      </Breadcrumbs>
      { windowSize >= 1000 &&
        <div id="cart_items_options">
          <span>Price</span>
          <span>Quantity</span>
          <span>Total</span>
        </div>
      }
      <div id="cart_items">
        <CartItem />
        {
          new Array(15).fill(1).map((i, index) => <CartItem img="a_hoodie.webp" price={Math.floor(Math.random() * (100 - 0))} key={`cart_${index}`} />)
        }
      </div>
    </div>
  );
}

export default Cart;
