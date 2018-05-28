export const TOGGLE_NAVBAR_COLLAPSED = 'TOGGLE_NAVBAR_COLLAPSED';

const toggleCollapsed = () => {
  return {
    type: TOGGLE_NAVBAR_COLLAPSED
  }
}

export const toggleNavbarCollapsed = () => {
  return (dispatch) => {
    dispatch(toggleCollapsed());
  }
}