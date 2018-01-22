import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <div className="header">
        Header
        <div className="text-xs-right">
          <Link className="btn btn-primary" to="/login">
            Log in
          </Link> 
          <Link className="btn btn-primary" to="/signup">
            Sign up
          </Link> 
        </div>
      </div>
    );
  }
}

export default Header;