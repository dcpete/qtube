import React, {Component} from 'react';
import { FormControl } from 'react-bootstrap';

class SearchBar extends Component {
  render() {
    return (
      <div className="search-bar">
        <FormControl
          componentClass="input"
          placeholder="Search Youtube"
          onChange={event => this.onInputChange(event.target.value)}
        />
      </div>
    )
  }

  onInputChange(term) {
    this.setState({ term });
    this.props.onSearchTermChange(term);
  }
}

export default SearchBar;
