import React, { Component } from 'react';

class VideoDisplay extends Component {

  render() {
    const { video } = this.props;

    if (!video) {
      return (
        <div className="video-container col-md-8">
          <img src="https://i.ytimg.com/vi/Es44QTJmuZ0/maxresdefault.jpg"/>
        </div>
      );
    }

    const url = `https://www.youtube.com/embed/${video.videoId}?autoplay=1`;

    return (
      <div className="video-detail col-md-8">
        <div className="embed-responsive embed-responsive-16by9">
          <iframe className="embed-responsive-item" src={url}></iframe>
        </div>
        <div className="details">
          <div>{video.title}</div>
        </div>
      </div>
    );
  }
}

export default VideoDisplay;
