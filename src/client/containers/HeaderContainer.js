import React from 'react';
import { connect } from 'react-redux';

import Header from '../components/Header';
import { toggleNavbarCollapsed } from '../actions/navbar_actions';
import { openAuthModal } from '../actions/modal_actions';
import { logOut } from '../actions/user_actions';

const mapStateToProps = function (state) {
  return { 
    isLoggedIn: state.user.isLoggedIn,
    username: state.user.username,
    collapsed: state.navbar.collapsed
  }
}

const mapDispatchToProps = { 
  openAuthModal,
  toggleNavbarCollapsed,
  logOut
};

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default HeaderContainer;