import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/">
            <p>Root</p>
          </Route>
          <Route exact path="/*">
            <p>Another page</p>
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;