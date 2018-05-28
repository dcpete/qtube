import { combineReducers } from 'redux';

import UserReducer from './user_reducer';
import NavbarReducer from './navbar_reducer';

const rootReducer = combineReducers({
  navbar: NavbarReducer,
  user: UserReducer
});

export default rootReducer;