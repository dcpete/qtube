import { combineReducers } from 'redux';

import ModalReducer from './modal_reducer';
import UserReducer from './user_reducer';
import NavbarReducer from './navbar_reducer';

const rootReducer = combineReducers({
  modal: ModalReducer,
  navbar: NavbarReducer,
  user: UserReducer
});

export default rootReducer;