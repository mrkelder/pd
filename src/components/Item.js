import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { infoContext } from 'app/context';
import { Link } from 'react-router-dom';
import ImgNotFound from 'img/imageNotFound.png';
import 'css/item.css';

function Item({ _id, name, price, img }) {
  const domain = useContext(infoContext);

  return (
    <div className="item">
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
  _id: 'none'
};

Item.propTypes = {
  name: PropTypes.string,
  img: PropTypes.string,
  price: PropTypes.number,
  _id: PropTypes.string
};

export default Item;
