import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from 'components/Header';
import SideBar from 'components/SideBar';
import store from 'app/store';
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
      <div>
        <Header />
        <main>
          <SideBar />
          <Switch>
            <Route exact path="/">
              <p>Root</p>
            </Route>
            <Route exact path="/*">
              <p>Another page</p>
            </Route>
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;