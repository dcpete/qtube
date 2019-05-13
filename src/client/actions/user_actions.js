import axios from 'axios';

import { closeModal } from './modal_actions';

export const SIGN_UP_INITIATED = 'SIGN_UP_INITIATED';
export const SIGN_UP_FAILED = 'SIGN_UP_FAILED';
export const SIGN_UP_COMPLETED = 'SIGN_UP_COMPLETED';
export const LOG_IN_INITIATED = 'LOG_IN_INITIATED';
export const LOG_IN_FAILED = 'LOG_IN_FAILED';
export const LOG_IN_COMPLETED = 'LOG_IN_COMPLETED';
export const LOG_OUT = 'LOG_OUT';

const getBasename = path => path.substr(0, path.lastIndexOf('/'));

export const signUp = (username, email, password) => {
  return (dispatch) => {
    dispatch({
      type: SIGN_UP_INITIATED
    });
    const url = `${getBasename(window.location.pathname)}/api/auth/signup`;
    const data = {
      username,
      email,
      password
    };
    axios.post(url, data)
      .then(response => {
        dispatch({
          type: SIGN_UP_COMPLETED,
          payload: response.data
        })
        dispatch(closeModal());
      })
      .catch(err => {
        dispatch({
          type: SIGN_UP_FAILED
        });
        console.log(err);
      });
  }
}

export const logIn = (usernameOrEmail, password) => {
  return (dispatch) => {
    dispatch({
      type: LOG_IN_INITIATED
    });
    const url = `${getBasename(window.location.pathname)}/api/auth/login`;
    const data = usernameOrEmail.includes('@')
      ? {
          email: usernameOrEmail,
          password
        }
      : {
          username: usernameOrEmail,
          password
        }
    axios.post(url, data)
      .then(response => {
        dispatch({
          type: LOG_IN_COMPLETED,
          payload: response.data
        });
        dispatch(closeModal());
      })
      .catch(err => {
        dispatch({
          type: LOG_IN_FAILED
        });
        console.log(err);
      });
  }
}

export const logOut = () => {
  return (dispatch) => {
    dispatch({
      type: LOG_OUT
    });
  }
}