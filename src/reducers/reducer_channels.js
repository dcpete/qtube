import { FETCH_CHANNELS, FETCH_CHANNEL } from '../actions';

export default function (state = {}, action) {
  switch (action.type) {
    case FETCH_CHANNEL: 
      return { ...state, [action.payload.data._id]: action.payload.data };
    case FETCH_CHANNELS:
      //return {...state, "channels" : action.payload.data };
      return _.mapKeys(action.payload.data, '_id');
    default:
      return state;
  }
}