import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import Login from '../components/Login';

const mapStateToProps = function (state) {
  return { }
}

const mapDispatchToProps = {}

const onSubmit = (values, dispatch, props) => { 
  console.log('submitted login');
}

const LoginForm = reduxForm({
  form: 'login',
  onSubmit
})(Login);

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(LoginForm);
export default LoginContainer;