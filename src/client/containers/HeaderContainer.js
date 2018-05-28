import React from 'react';
import { connect } from 'react-redux';

import Header from '../components/Header';
import { logIn } from '../actions/user_actions';
import { toggleNavbarCollapsed } from '../actions/navbar_actions';

const mapStateToProps = function (state) {
  return { 
    collapsed: state.navbar.collapsed
  }
}

const mapDispatchToProps = { 
  logIn,
  toggleNavbarCollapsed
};

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default HeaderContainer;