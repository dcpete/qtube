import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import Signup from '../components/Signup';
import { signUp } from '../actions/user_actions';

const mapStateToProps = function (state) {
  return { }
}

const mapDispatchToProps = { }

const onSubmit = (values, dispatch, props) => { 
  dispatch(signUp(values.username, values.email, values.password));
}

const SignupForm = reduxForm({
  form: 'signup',
  onSubmit
})(Signup);

const SignupContainer = connect(mapStateToProps, mapDispatchToProps)(SignupForm);
export default SignupContainer;