import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';
import ModalReducer from './modal_reducer';
import UserReducer from './user_reducer';
import NavbarReducer from './navbar_reducer';

const rootReducer = combineReducers({
  form: FormReducer,
  modal: ModalReducer,
  navbar: NavbarReducer,
  user: UserReducer
});

export default rootReducer;