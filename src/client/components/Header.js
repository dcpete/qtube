import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  constructor() {
    super();
    this.handleLogIn = this.handleLogIn.bind(this);
  }

  handleLogIn() {
    const email = 'testemail@test.com';
    const password = 'this is my login password meow'
    this.props.logIn(email, password);
  }

  render() {
    return (
      <header className="header-container">
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
          <Link to="/" className="navbar-brand">
            qtube
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mainMenuSupportedContent"
            aria-controls="mainMenuSupportedContent"
            aria-expanded="false"
            aria-label="Toggle main menu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="mainMenuSupportedContent"
          >
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to="/other">other</Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={this.handleLogIn}
                >
                  Log In
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;