import axios from 'axios';

export const LOG_IN_INITIATED = 'LOG_IN_INITIATED';
export const LOG_IN_FAILED = 'LOG_IN_FAILED';
export const LOG_IN_COMPLETED = 'LOG_IN_COMPLETED';

const logInInitiated = () => {
  return {
    type: LOG_IN_INITIATED
  }
}

const logInFailed = () => {
  return {
    type: LOG_IN_FAILED
  }
}

const logInCompleted = (payload) => {
  return {
    type: LOG_IN_COMPLETED,
    payload
  }
}

export const logIn = (email, password) => {
  return (dispatch) => {
    dispatch(logInInitiated());
    const url = '/auth/login';
    const data = {
      email,
      password
    }
    axios.post(url, data)
      .then(response => {
        dispatch(logInCompleted(response.data));
      })
      .catch(err => {
        dispatch(logInFailed());
        console.log(err);
      });
  }
}