import React from 'react';
import { connect } from 'react-redux';

import Header from '../components/Header';

const mapStateToProps = function (state) {
  return { }
}

const mapDispatchToProps = { };

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);
export default HeaderContainer;