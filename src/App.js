import React, { Component, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from 'components/Header';
import SideBar from 'components/SideBar';
import Footer from 'components/Footer';
import Main from 'pages/Main';
import store from 'app/store';
import { infoContext as InfoContext } from 'app/context';
import 'css/index.css';

class App extends Component {
  componentDidMount() {
    window.addEventListener('resize', () => {
      const windowSize = document.getElementsByTagName('html')[0].clientWidth;
      store.dispatch({ type: 'windowSize/resize', payload: windowSize });
    });
  }

  render() {
    return (
      <Fragment>
        <InfoContext.Provider value={'localhost:8080'}>
          <Header />
          <main>
            <SideBar />
            <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/*">
                <p>Another page</p>
              </Route>
            </Switch>
          </main>
          <Footer />
        </InfoContext.Provider>
      </Fragment>
    );
  }
}

export default App;