import axios from 'axios';

export const CREATE_CHANNEL_INITIATED = "CREATE_CHANNEL_INITIATED";
export const CREATE_CHANNEL_FAILED = "CREATE_CHANNEL_FAILED";
export const CREATE_CHANNEL_COMPLETED = "CREATE_CHANNEL_COMPLETED";
export const FETCH_CHANNEL_DATA_INITIATED = "FETCH_CHANNEL_DATA_INITIATED";
export const FETCH_CHANNEL_DATA_FAILED = "FETCH_CHANNEL_DATA_FAILED";
export const FETCH_CHANNEL_DATA_COMPLETED = "FETCH_CHANNEL_DATA_COMPLETED";
export const FETCH_CHANNELS_LIST_INITIATED = "FETCH_CHANNELS_LIST_INITIATED";
export const FETCH_CHANNELS_LIST_FAILED = "FETCH_CHANNELS_LIST_FAILED";
export const FETCH_CHANNELS_LIST_COMPLETED = "FETCH_CHANNELS_LIST_COMPLETED";

export const createChannel = (data) => {
  return (dispatch) => {
    dispatch({ type: CREATE_CHANNEL_COMPLETED });
    axios.post('/channels', data)
      .then(response => {
        dispatch({
          type: CREATE_CHANNEL_COMPLETED,
          payload: response.data
        });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: CREATE_CHANNEL_FAILED });
      })
  }
}

export const fetchChannelData = (channelId) => {
  return (dispatch) => {
    dispatch({ type: FETCH_CHANNEL_DATA_INITIATED });
    axios.get(`/channels/${channelId}`)
      .then(response => {
        dispatch({
          type: FETCH_CHANNEL_DATA_COMPLETED,
          payload: response.data
        });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: FETCH_CHANNEL_DATA_FAILED });
      })
  }
}

export const fetchChannelsList = (search) => {
  return (dispatch) => {
    dispatch({ type: FETCH_CHANNELS_LIST_INITIATED });
    const query = search ? `?name=${search}` : '';
    axios.get(`/channels${query}`)
      .then(response => {
        dispatch({
          type: FETCH_CHANNELS_LIST_COMPLETED,
          payload: response.data
        });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: FETCH_CHANNELS_LIST_FAILED });
      })
  }
}