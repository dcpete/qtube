import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  Button
} from 'reactstrap';

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
    const {
      collapsed,
      toggleNavbarCollapsed
    } = this.props;
    return (
      <Navbar color="dark" dark expand="sm">
        <div className="container d-flex">
          <NavbarToggler
            onClick={toggleNavbarCollapsed}
            className="mr-2"
          />  
          <Link to="/" className="navbar-brand">
            qtube
          </Link>
          <div className="ml-auto order-2 order-sm-3">
            <Button
              outline
              color="warning"
              className="mx-2"
              onClick={this.handleLogIn}
            >
              Log In
            </Button>
          </div>
          <Collapse isOpen={!collapsed} navbar className="order-3 order-sm-2">
            <Nav navbar>
              <NavItem className="px-2 py-2">
                <Link to="/other">other</Link>
              </NavItem>
            </Nav>
          </Collapse>
        </div>
      </Navbar>
    );
  }
}

export default Header;