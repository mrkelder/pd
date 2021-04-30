import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { infoContext } from 'app/context';
import { Link } from 'react-router-dom';
import ImgNotFound from 'img/imageNotFound.png';
import axios from 'axios';
import 'css/item.css';

function Item({ _id, name, price, img, type, loadSelf }) {
  const domain = useContext(infoContext);
  const imgRef = useRef(null);
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (loadSelf) {
      async function fetchData() {
        const { data } = await axios.get(`http://${domain}/getItem`, { params: { type: _id } });
        setItem(data[0]);
      }
      fetchData();
    }
  }, [_id, domain, loadSelf]);

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
      <Link to={`/item/${_id}`} data-testid="item_link1">
        {item === null ?
          <img ref={imgRef} src={img !== 'none' ? `http://${domain}/static/${img}` : ImgNotFound} alt="item_photo" />
          :
          <img ref={imgRef} src={`http://${domain}/static/${item.photos[0]}`} alt="item_photo" />
        }
      </Link>
      <Link to={`/item/${_id}`} data-testid="item_link2">{item === null ? name : item.name}</Link>
      <p>{item === null ? price.toFixed(2) : item.price.toFixed(2)}</p>
    </div>
  );
}

Item.defaultProps = {
  name: 'T-shirt',
  img: 'none',
  price: 999,
  _id: 'none',
  type: 'big',
  loadSelf: false
};

Item.propTypes = {
  name: PropTypes.string,
  img: PropTypes.string,
  price: PropTypes.number,
  _id: PropTypes.string,
  type: PropTypes.oneOf(['big', 'small']),
  loadSelf: PropTypes.bool
};

export default Item;
