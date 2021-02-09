import React, { Fragment } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom';
import Header from 'components/Header';
import SideBar from 'components/SideBar';
import Footer from 'components/Footer';
import Main from 'pages/Main';
import ItemPage from 'pages/ItemPage';
import Shop from 'pages/Shop';
import Payment from 'pages/Payment';
import Cart from 'pages/Cart';
import Editor from 'pages/Editor';

function Pages() {
  const { pathname } = useLocation();

  return (
    <Fragment>
      { pathname === '/payment' ?
        <Route exact path="/payment" component={Payment} />
        :
        <Fragment>
          <Header />
          <main>
            <SideBar />
            <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/shop" component={Shop} />
              <Route exact path="/item/*" component={ItemPage} />
              <Route exact path="/cart" component={Cart}/>
              <Route exact path="/editor" component={Editor}/>
              <Route exact path="/*">
                <p>404</p>
              </Route>
            </Switch>
          </main>
          <Footer />
        </Fragment>
      }
    </Fragment>
  );
}

export default Pages;
