import React from 'react';
import { connect } from 'react-redux';

import Login from '../components/Login';
import { logIn } from '../actions/user_actions';

const mapStateToProps = function (state) {
  return {
    isFetchingUser: state.user.isFetching,
  }
}

const mapDispatchToProps = { 
  logIn,
}

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);
export default LoginContainer;