import React, { Fragment } from 'react';
import search_black from 'img/search_black.svg';
import cart from 'img/cart.svg';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Header() {
  const { windowSize } = useSelector(store => store.windowSize);
  const { items } = useSelector(store => store.cart);

  return (
    <Fragment>
      <div id="grey_heading" />
      <header>
        <img src={search_black} alt="search" className="header_links" />
        {windowSize >= 768 && <input type="text" placeholder="Search" />}
        <Link to="/">
          <img src={cart} alt="search" id="cart" className="header_links" />
          {windowSize >= 768 && <p>Cart ({items.length})</p>}
        </Link>
      </header>
    </Fragment>

  )
}

export default Header;
