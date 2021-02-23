import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { infoContext } from 'app/context';
import { Link } from 'react-router-dom';
import ImgNotFound from 'img/imageNotFound.png';
import 'css/item.css';

function Item({ _id, name, price, img, type }) {
  const domain = useContext(infoContext);
  const imgRef = useRef(null);

  useEffect(() => {
    // If the photo hasn't been loaded
    const image = imgRef.current;
    if (image) {
      image.addEventListener('error', () => {
        if (imgRef.current)
          imgRef.current.src = ImgNotFound;
      });
    }
  }, [imgRef]);

  return (
    <div className={type === 'big' ? 'item' : 'item_s'}>
      <Link to={`/item/${_id}`}>
        <img ref={imgRef} src={img !== 'none' ? `http://${domain}/static/${img}` : ImgNotFound} alt="item_photo" />
      </Link>
      <Link to={`/item/${_id}`}>{name}</Link>
      <p>${price.toFixed(2)}</p>
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
