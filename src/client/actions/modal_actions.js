export const CLOSE_MODAL = 'CLOSE_MODAL';
export const OPEN_MODAL = 'OPEN_MODAL';

export const openModal = (payload) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_MODAL,
      payload
    });
  }
}

export const openAuthModal = (tab) => {
  return (dispatch) => {
    dispatch({
      type: OPEN_MODAL,
      payload: {
        component: 'auth',
        tab,
        title: undefined,
        message: undefined,
        alert: undefined,
        showCancelButton: false,
        showOkButton: false,
        okAction: undefined
      }
    })
  }
}

export const closeModal = (payload) => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_MODAL
    });
  }
}