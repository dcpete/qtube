import React from 'react';
import { Media } from 'react-bootstrap';

const VideoListItem = ({video, selectedVideo, onVideoSelect}) => {
  const imageUrl = video.snippet.thumbnails.default.url;
  const thisClassName = (video.active) ? "list-group-item list-group-item-active" : "list-group-item";

  return (
    <li
      onClick={() => onVideoSelect(video)}
      className={thisClassName}
    >
      <Media>
        <Media.Left>
          <img className="media-object" src={imageUrl}/>
        </Media.Left>
        <Media.Body>
          <Media.Heading>{video.snippet.title}</Media.Heading>
        </Media.Body>
      </Media>
    </li>
  );
};

export default VideoListItem;
