import React, { useContext } from 'react';
import { infoContext } from 'app/context';
import { Link } from 'react-router-dom';

function Item({ _id, name, price, img }) {
  const domain = useContext(infoContext);

  return (
    <div className="item">
      <Link to={`/item/${_id}`}><img src={`http://${domain}/static/${img}`} alt="item_photo"/></Link>
      <Link to={`/item/${_id}`}>{name}</Link>
      <p>${price}.00</p>
    </div>
  );
}

export default Item;
