import React, { Component } from 'react';
import { Button } from 'reactstrap';

class Channel extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.setState(() => {
      return {
        player: new YT.Player('qtubePlayerIframe')
      }
    })
  }

  render() {
    return (
      <div>
        <h1>Channel</h1>
        <Button
          color="primary"
          onClick={() => {
            this.state.player.loadVideoById({ 'videoId': 'NouZB6QuCys' });
          }}
        >
          DARE
        </Button>
        <hr />
        <div className="embed-responsive embed-responsive-16by9">
          <iframe
            id="qtubePlayerIframe"
            className="embed-responsive-item"
            src="https://www.youtube-nocookie.com/embed/zpOULjyy-n8?rel=0&autoplay=1&iv_load_policy=3&enablejsapi=1"
            allow="autoplay; encrypted-media"
            allowFullScreen>
          </iframe>
        </div>
      </div>
    )
  }
}

export default Channel;