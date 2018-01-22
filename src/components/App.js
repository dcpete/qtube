import React, { Component } from 'react';

import HeaderContainer from '../containers/HeaderContainer';
import BodyContainer from '../containers/BodyContainer';

class App extends Component {
  render() {
    return(
      <div>
        <HeaderContainer />
        <BodyContainer />
      </div>
    );
  }
};

export default App;