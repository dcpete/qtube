import { OPEN_MODAL, CLOSE_MODAL } from '../actions/modal_actions';

const initialState = {
  isShown: false,
  component: undefined,
  title: undefined,
  message: undefined,
  alert: undefined,
  showCancelButton: false,
  showOkButton: false,
  okAction: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        isShown: true,
        ...action.payload
      }
    case CLOSE_MODAL:
      return initialState;
    default:
      return state;
  }
}