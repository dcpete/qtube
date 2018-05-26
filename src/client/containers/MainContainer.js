import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Main from '../components/Main';

const mapStateToProps = function (state) {
  return { }
}

const mapDispatchToProps = { };

const MainContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Main)
);
export default MainContainer;