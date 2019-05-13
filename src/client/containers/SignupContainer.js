import React from 'react';
import { connect } from 'react-redux';

import Signup from '../components/Signup';
import { signUp } from '../actions/user_actions';

const mapStateToProps = function (state) {
  return { }
}

const mapDispatchToProps = { 
  signUp,
}

const SignupContainer = connect(mapStateToProps, mapDispatchToProps)(Signup);
export default SignupContainer;