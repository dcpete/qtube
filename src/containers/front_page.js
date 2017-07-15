import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchChannels } from '../actions';

class FrontPage extends Component {
  componentDidMount() {
    this.props.fetchChannels();
  }

  renderChannels() {
    return _.map(this.props.channels, channel => {
      return (
        <li className="list-group-item" key={channel._id}>
          {channel.name}
        </li>
      );
    });
  }

  render() {
    if (!this.props.channels) {
      return "Loading...";
    }
    return (
      <div>
        <ul className="list-group">
          {this.renderChannels()}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { channels: state.channels };
}

export default connect(mapStateToProps, { fetchChannels })(FrontPage);