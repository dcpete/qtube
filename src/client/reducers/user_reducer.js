import { LOG_IN_COMPLETED } from '../actions/user_actions';

const initialState = {
  username: "",
  email: "",
  token: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_COMPLETED:
      return {
        username: action.payload.user.username,
        email: action.payload.user.email,
        token: action.payload.token
      }
    default:
      return state;  
  }
}