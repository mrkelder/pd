import React, { Component, Fragment } from 'react';
import PageManager from 'app/PageManager';
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
          <Fragment>
            <PageManager />
          </Fragment>
        </InfoContext.Provider>
      </Fragment>
    );
  }
}

export default App;