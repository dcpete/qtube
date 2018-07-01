import {
  LOG_IN_INITIATED,
  LOG_IN_FAILED,
  LOG_IN_COMPLETED,
  SIGN_UP_INITIATED,
  SIGN_UP_FAILED,
  SIGN_UP_COMPLETED,
  LOG_OUT
} from '../actions/user_actions';

const initialState = {
  isFetching: false,
  email: undefined,
  token: undefined,
  uid: undefined,
  username: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_INITIATED:
    case SIGN_UP_INITIATED:
      return {
        ...state,
        isFetching: true
      }
    case LOG_IN_COMPLETED:
    case SIGN_UP_COMPLETED:
      return {
        isFetching: false,
        email: action.payload.email,
        token: action.payload.token,
        uid: action.payload.uid,
        username: action.payload.username
      }
    case SIGN_UP_FAILED:
    case LOG_IN_FAILED:
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
}