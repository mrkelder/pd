import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Item from 'components/Item';
import 'css/shop.css';


function Shop() {
  const { windowSize } = useSelector(state => state.windowSize);

  return (
    <div id="shop_page">
      { windowSize < 768 ?
        <Fragment>
          <div id="bread_crumbs">
            <Link to="/">Home</Link>
            <span className="arrow">{'>'}</span>
            <span>Products</span>
          </div>
          <h1>Products</h1>
          <select defaultValue="title-ascending">
            <option value="manual">Featured</option>
            <option value="best-selling">Best selling</option>
            <option value="title-ascending">Alphabetically, A-Z</option>
            <option value="title-descending">Alphabetically, Z-A</option>
            <option value="price-ascending">Price, low to high</option>
            <option value="price-descending">Price, high to low</option>
            <option value="created-ascending">Date, old to new</option>
            <option value="created-descending">Date, new to old</option>
          </select>
          <div id="shop_items">
            {
              new Array(21).fill(5).map((i, index) => <Item type="small" key={`item_${index}`} />)
            }
          </div>
        </Fragment>
        :
        <Fragment></Fragment>
      }
    </div>
  );
}

export default Shop;
