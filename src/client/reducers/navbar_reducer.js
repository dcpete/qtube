import { TOGGLE_NAVBAR_COLLAPSED } from '../actions/navbar_actions';

const initialState = {
  collapsed: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_NAVBAR_COLLAPSED:
      return {
        ...state,
        collapsed: !state.collapsed
      }
    default:
      return state;
  }
}