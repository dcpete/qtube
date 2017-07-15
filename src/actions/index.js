import axios from 'axios';

export const FETCH_CHANNELS = 'fetch_channels';
export const FETCH_CHANNEL = 'fetch_channel';

const ROOT_URL = 'http://www.datplayer.net';

export function fetchChannels() {
  const request = axios.get(`${ROOT_URL}/api/dat`);

  return {
    type: FETCH_CHANNELS,
    payload: request
  };
}

export function fetchChannel(id) {
  const request = axios.get(`${ROOT_URL}/api/dat/${id}`);

  return {
    type: FETCH_CHANNEL,
    payload: request
  };
}