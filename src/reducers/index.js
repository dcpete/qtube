import { combineReducers } from 'redux';
import ChannelsReducer from './reducer_channels';

const rootReducer = combineReducers({
  channels: ChannelsReducer
});

export default rootReducer;