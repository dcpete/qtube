import React, { Component } from 'react';

import HeaderContainer from '../containers/HeaderContainer';
import MainContainer from '../containers/MainContainer';
import QtubeModalContainer from '../containers/QtubeModalContainer';

class App extends Component {
  render() {
    return (
      <div>
        <HeaderContainer />
        <MainContainer />
        <QtubeModalContainer />
      </div>
    )
  }
}

export default App;