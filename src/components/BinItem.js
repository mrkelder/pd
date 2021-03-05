import React, { useContext } from 'react';
import imageNotFound from 'img/imageNotFound.png';
import PropTypes from 'prop-types';
import { infoContext } from 'app/context';
import 'css/binItem.css';

function BinItem({ name, price, amount, option, img }) {
  const domain = useContext(infoContext);

  return (
    <div className="bin_item">
      <div className="bin_item_info">
        <div className="bin_item_image" style={img === 'none' ? { backgroundImage: `url('${imageNotFound}')`, backgroundSize: '105%' } : { backgroundImage: `url('http://${domain}/static/${img}')` }}>
          <div>{amount <= 99 ? amount : '+99'}</div>
        </div>
        <div className="info">
          <span>{name}</span>
          <span>{option}</span>
        </div>
      </div>
      <span className="bin_item_price">${price.toFixed(2)}</span>
    </div>
  );
}

BinItem.propTypes = {
  name: PropTypes.string,
  price: PropTypes.number,
  amount: PropTypes.number,
  option: PropTypes.string,
  img: PropTypes.string
};

BinItem.defaultProps = {
  name: 'AWESOME HOODIE',
  price: 999,
  amount: 1,
  option: 'XS / White',
  img: 'none'
}

export default BinItem;
