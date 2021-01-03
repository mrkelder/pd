import React, { Fragment, useState } from 'react';
import logo from 'img/logo.gif';
import { Link, useLocation } from 'react-router-dom';
import bo from 'img/burger_open.svg';
import bc from 'img/burger_close.svg';
import instagram from 'img/instagram.svg';
import { useSelector } from 'react-redux';

function SideBar() {
  const { windowSize } = useSelector(state => state.windowSize);
  const { pathname } = useLocation();
  const [menuOpened, setMenuOpened] = useState(false);

  function openMenu() {
    setMenuOpened(!menuOpened);
  }

  return (
    <aside>
      <Link to="/">
        <img src={logo} alt="logo" id="logo" />
      </Link>
      { windowSize < 768 ?
        <Fragment>
          <button id="menu_button" onClick={openMenu} onFocus={() => { setMenuOpened(true); }} tabIndex="0" style={{ backgroundImage: `url('${menuOpened ? bc : bo}')` }} />
          {menuOpened &&
            <Fragment>
              <Link to="/" style={{ fontWeight: `${pathname === '/' ? 'bold' : 'normal'}` }}>Home</Link>
              <Link to="/shop" style={{ fontWeight: `${pathname === '/shop' ? 'bold' : 'normal'}` }}>Shop</Link>
              <a target="_blank" rel="noreferrer" href="https://www.instagram.com/peaceful_disruption/?hl=en"><img src={instagram} alt="insta" id="insta" /></a>
            </Fragment>
          }
        </Fragment>
        :
        <Fragment>
          <Link to="/" style={{ fontWeight: `${pathname === '/' ? 'bold' : 'normal'}` }}>Home</Link>
          <Link to="/shop" style={{ fontWeight: `${pathname === '/shop' ? 'bold' : 'normal'}` }}>Shop</Link>
          <a target="_blank" rel="noreferrer" href="https://www.instagram.com/peaceful_disruption/?hl=en"><img src={instagram} alt="insta" id="insta" /></a>
        </Fragment>
      }

    </aside>
  );
}

export default SideBar;
