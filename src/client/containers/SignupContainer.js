import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import Signup from '../components/Signup';

const mapStateToProps = function (state) {
  return { }
}

const mapDispatchToProps = {}

const onSubmit = (values, dispatch, props) => { 
  console.log('submitted signup');
}

const SignupForm = reduxForm({
  form: 'signup',
  onSubmit
})(Signup);

const SignupContainer = connect(mapStateToProps, mapDispatchToProps)(SignupForm);
export default SignupContainer;