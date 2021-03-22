import { infoContext } from 'app/context';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import imgNotFound from 'img/imageNotFound.png';

function CartItem({ img, name, price, option, quantity, id }) {
  const { windowSize } = useSelector(state => state.windowSize);
  const dispatch = useDispatch();
  const [valueQ, setValueQ] = useState(1);
  const domain = useContext(infoContext);

  useEffect(() => {
    setValueQ(quantity);
  }, [quantity]);

  function removeItem() {
    dispatch({ type: "cart/removeElement", payload: { _id: id } });
  }

  function changeValue({ target: { value } }) {
    if (value > 0) {
      dispatch({ type: "cart/changeAmount", payload: { _id: id, number: Number(value) } });
      setValueQ(value);
    }
    else {
      dispatch({ type: "cart/changeAmount", payload: { _id: id, number: 1 } });
      setValueQ(1);
    }
  }

  return (
    <div className="cart_item">
      <Link to={`/item/${id}`}>
        <div className="cart_item_photo" style={img === 'default' ? { backgroundImage: `url('${imgNotFound}')` } : { backgroundImage: `url('http://${domain}/static/${img}')` }} />
      </Link>
      <div className="cart_item_options">
        <h2>{name.toUpperCase()}</h2>
        <span className="cart_item_option">{option}</span>
        <span className="cart_item_remove" tabIndex="0" onClick={removeItem}>Remove</span>
      </div>
      <div className="cart_item_info">
        <div>
          {windowSize < 1000 && <span>Price</span>}
          <span>${price.toFixed(2)}</span>
        </div>
        <div>
          {windowSize < 1000 && <span>Quantity</span>}
          <input onChange={changeValue} type="number" value={valueQ} />
        </div>
        <div>
          {windowSize < 1000 && <span>Total</span>}
          <span>${(price * valueQ).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

CartItem.propTypes = {
  img: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.number,
  option: PropTypes.string,
  quantity: PropTypes.number,
  id: PropTypes.string
};

CartItem.defaultProps = {
  img: 'default',
  name: 'Hoodie',
  price: 999,
  option: 'None / None',
  quantity: 1,
  id: 'none'
};

export default CartItem;
