import React from 'react';
import { connect } from 'react-redux';

import Header from '../components/Header';
import { toggleNavbarCollapsed } from '../actions/navbar_actions';
import { openAuthModal } from '../actions/modal_actions';

const mapStateToProps = function (state) {
  return { 
    collapsed: state.navbar.collapsed
  }
}

const mapDispatchToProps = { 
  openAuthModal,
  toggleNavbarCollapsed
};

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default HeaderContainer;