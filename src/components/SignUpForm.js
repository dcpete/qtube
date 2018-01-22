import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import renderField from './renderField';
import { validateUserFields, validateUserFieldsSuccess, validateUserFieldsFailure, resetValidateUserFields } from '../actions/validateUserFields';
import { signUpUser, signUpUserSuccess, signUpUserFailure, } from '../actions/users';

// Client side validation
function validate(values) {
  var errors = {};
  var hasErrors = false;

  if (!values.name.trim()) {
    errors.name = 'Enter a username';
    hasErrors = true;
  }
  if (!values.email.trim()) {
    errors.email = 'Enter an email address';
    hasErrors = true;
  }
  if (!values.password.trim()) {
    errors.password = 'Enter a password';
    hasErrors = true;
  }
  if (!values.confirmPassword.trim()) {
    errors.confirmPassword = 'Confirm your password';
    hasErrors = true;
  }
  if (values.password.trim() && values.confirmPassword.trim() && values.password.trim() !== values.confirmPassword.trim()) {
    errors.password = 'Passwords do not match';
    hasErrors = true;
  }
  return errors;
}

const asyncValidate = (values, dispatch) => {
  return dispatch(validateUserFields(values))
    .then((result) => {
      //Note: Error's "data" is in result.payload.response.data
      // success's "data" is in result.payload.data
      if (!result.payload.response) { //1st onblur
        return;
      }

      let {data, status} = result.payload.response;

      //if status is not 200 or any one of the fields exist, then there is a field error
      if (status != 200 || data.username || data.email) {
        //let other components know of error by updating the redux` state
        dispatch(validateUserFieldsFailure(data));
        throw data;
      } else {
        //let other components know that everything is fine by updating the redux` state
        dispatch(validateUserFieldsSuccess(data)); //ps: this is same as dispatching RESET_USER_FIELDS
      }
    });
};

const validateAndSignUpUser = (values, dispatch) => {
  return dispatch(signUpUser(values))
    .then((result) => {

      // Note: Error's "data" is in result.payload.response.data (inside "response")
      // success's "data" is in result.payload.data
      if (result.payload.response && result.payload.response.status !== 200) {
        dispatch(signUpUserFailure(result.payload.response.data));
        throw new SubmissionError(result.payload.response.data);
      }

      //Store JWT Token to browser session storage 
      //If you use localStorage instead of sessionStorage, then this w/ persisted across tabs and new windows.
      //sessionStorage = persisted only in current tab
      sessionStorage.setItem('jwtToken', result.payload.data.token);
      //let other components know that everything is fine by updating the redux` state
      dispatch(signUpUserSuccess(result.payload.data)); //ps: this is same as dispatching RESET_USER_FIELDS
    });
};


class SignUpForm extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentWillMount() {
    //Important! If your component is navigating based on some global state(from say componentWillReceiveProps)
    //always reset that global state back to null when you REMOUNT
    this.props.resetMe();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.status === 'authenticated' && nextProps.user.user && !nextProps.user.error) {
      this.context.router.push('/');
    }
  }

  render() {
    debugger;
    const {asyncValidating, handleSubmit, submitting, asyncValidate, validate} = this.props;
    return (
      <div className='container'>
        <form onSubmit={ handleSubmit(validateAndSignUpUser) }>
          <Field
                 name="name"
                 type="text"
                 component={ renderField }
                 label="Full Name*" />
          <Field
                 name="username"
                 type="text"
                 component={ renderField }
                 label="@username*" />
          <Field
                 name="email"
                 type="email"
                 component={ renderField }
                 label="Email*" />
          <Field
                 name="password"
                 type="password"
                 component={ renderField }
                 label="Password*" />
          <Field
                 name="confirmPassword"
                 type="password"
                 component={ renderField }
                 label="Confirm Password*" />
          <div>
            <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={ submitting }>
              Submit
            </button>
            <Link
                  to="/"
                  className="btn btn-error"> Cancel
            </Link>
          </div>
        </form>
      </div>
    )
  }
}

export default reduxForm({
  form: 'SignUpForm', // a unique identifier for this form
  validate, // <--- validation function given to redux-form
  asyncValidate
})(SignUpForm)

