import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <header className="header-container">
        <div className="container">  
          <div className="row">
            <div className="col-12 col-md-4">
              <Link to="/">qtube</Link>
            </div>
            <div className="col-12 col-md-8">
              <Link to="/other">other</Link>
            </div>
          </div>
        </div>  
      </header>
    );
  }
}

export default Header;