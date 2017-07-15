import React, { Component } from 'react';
import { Tab, Tabs } from 'react-bootstrap';

import SearchBar from './search_bar';
import VideoList from './video_list';

class Sidebar extends Component {
  render () {
    const videoSearch = (term) => { this.onSearch(term) };
    const searchSelect = (term) => { this.onSearchSelect(term) };
    const playlistSelect = (term) => { this.onPlaylistSelect(term) };

    return (
      <Tabs className="col-md-4" defaultActiveKey={1} id="uncontrolled-tab-example">
        <Tab eventKey={1} title="Playlist">
          <VideoList
            onVideoSelect= { playlistSelect }
            videos={this.props.playlist}
            selectedVideo={this.selectedVideo} />
        </Tab>
        <Tab eventKey={2} title="Search">
          <SearchBar onSearchTermChange={videoSearch} />
          <VideoList
            onVideoSelect= { searchSelect }
            videos={this.props.searchlist} />
        </Tab>
      </Tabs>
    );
  }

  onPlaylistSelect(term) {
    this.props.onPlaylistSelect(term);
  }

  onSearchSelect(term) {
    this.props.onSearchSelect(term);
  }

  onSearch(term) {
    this.props.onSearchTermChange(term);
  }
}

export default Sidebar;
