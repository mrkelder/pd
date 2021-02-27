import React, { useEffect, useState } from 'react';
import { Breadcrumbs } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory  } from 'react-router-dom';
import CartItem from 'components/CartItem';
import Button from 'components/Button';
import arrow from 'img/arrow.svg';
import red_discount from 'img/red_discount.svg';
import 'css/cart.css';

function Cart() {
  const { items, sIns } = useSelector(state => state.cart);
  const { windowSize } = useSelector(state => state.windowSize);
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [details, setDetails] = useState(sIns);
  const [subTotal, setSubTotal] = useState(0);

  function changeDetails({ target: { value } }) {
    setDetails(value);
    dispatch({ type: "cart/specialInstr", payload: { sIns: value } });
  }

  useEffect(() => {
    if (items.length === 1) setSubTotal(items[0].price * items[0].amount);
    else if (items.lengt > 1) setSubTotal(items.reduce((a, b) => a.amount * a.price + b.amount * b.price));
    else setSubTotal(0);
  }, [items]);

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
        {items.length === 0 &&
          <h2 id="cart_epmty">The cart is empty</h2>
        }
        {
          items.map(({ photos, price, _id, amount, name, color, size }) => <CartItem img={photos[0]} option={`${size} / ${color}`} name={name} price={price} id={_id} quantity={amount} key={`cart_${_id}`} />)
        }
      </section>
      <section id="payment">
        <div id="details">
          <h2>Special instructions for seller</h2>
          <textarea value={details} onChange={changeDetails} />
        </div>
        <div id="checkout">
          <div id="free_shipping">
            <img src={red_discount} alt="red_discount" />
            <span>FREE SHIPPING -$10.00</span>
          </div>
          <span id="sub">Subtotal ${subTotal.toFixed(2)}</span>
          <span id="taxes">Taxes and shipping calculated at checkout</span>
          <Button click={() => { push("/shop"); }}>CONTINUE SHOPPING</Button>
          <Button click={() => { push("/payment"); }}>CHECK OUT</Button>
        </div>
      </section>
    </div>
  );
}

export default Cart;
