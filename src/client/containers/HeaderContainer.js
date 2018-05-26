import React from 'react';
import { connect } from 'react-redux';

import Header from '../components/Header';
import { logIn } from '../actions/user_actions';

const mapStateToProps = function (state) {
  return { }
}

const mapDispatchToProps = { 
  logIn
};

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default HeaderContainer;