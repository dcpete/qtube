import React from 'react';
import { connect } from 'react-redux';

import Channel from '../components/Channel';

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = { }

const ChannelContainer = connect(mapStateToProps, mapDispatchToProps)(Channel)

export default ChannelContainer;