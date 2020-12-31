import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { infoContext } from 'app/context';
import { Link } from 'react-router-dom';
import ImgNotFound from 'img/imageNotFound.png';
import 'css/item.css';

// TODO: add default photos to the items (to show something if the connection is lost)
function Item({ _id, name, price, img, type }) {
  const domain = useContext(infoContext);

  return (
    <div className={type === 'big' ? 'item' : 'item_s'}>
      <Link to={`/item/${_id}`}><img src={img !== 'none' ? `http://${domain}/static/${img}` : ImgNotFound} alt="item_photo" /></Link>
      <Link to={`/item/${_id}`}>{name}</Link>
      <p>${price}.00</p>
    </div>
  );
}

Item.defaultProps = {
  name: 'T-shirt',
  img: 'none',
  price: 999,
  _id: 'none',
  type: 'big'
};

Item.propTypes = {
  name: PropTypes.string,
  img: PropTypes.string,
  price: PropTypes.number,
  _id: PropTypes.string,
  type: PropTypes.oneOf(['big', 'small'])
};

export default Item;
