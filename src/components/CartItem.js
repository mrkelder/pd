import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// TODO: make it alive

function CartItem({ img, name, price, option, quantity, id }) {
  const { windowSize } = useSelector(state => state.windowSize);

  return (
    <div className="cart_item">
      <Link to={`/item/${id}`}>
        <div className="cart_item_photo" style={{ backgroundImage: `url('http://localhost:8080/static/a_hoodie.webp')` }} />
      </Link>
      <div className="cart_item_options">
        <h2>SOME NAME</h2>
        <span className="cart_item_option">XS / White</span>
        <span className="cart_item_remove" tabIndex="0">Remove</span>
      </div>
      <div className="cart_item_info">
        <div>
          {windowSize < 1000 && <span>Price</span>}
          <span>$40.00</span>
        </div>
        <div>
          {windowSize < 1000 && <span>Quantity</span>}
          <input type="number" value="4" />
        </div>
        <div>
          {windowSize < 1000 && <span>Total</span>}
          <span>$280.00</span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
