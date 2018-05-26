import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './Home';
import Other from './Other';

class Main extends Component {
  render() {
    return (
      <main className="main-container">
        <div className="container">
          <Route exact path='/' component={Home} />
          <Route path='/other' component={Other} />
        </div>
      </main>
    );
  }
}

export default Main;