import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchChannel } from '../actions';

class ChannelPage extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchChannel(id);
  }

  render() {
    const { channel } = this.props;
    const { currentVideo } = channel.state.currentIndex;

    if (!channel) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        {channel.name}
      </div>
    );
  }
}

function mapStateToProps({ channels }, ownProps) {
  return { channel: channels[ownProps.match.params.id] };
}

export default connect(mapStateToProps, { fetchChannel })(ChannelPage);