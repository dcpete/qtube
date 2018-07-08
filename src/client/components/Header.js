import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarToggler,
  NavItem,
  UncontrolledDropdown
} from 'reactstrap';

class Header extends Component {
  constructor() {
    super();
    this.renderUserButtons = this.renderUserButtons.bind(this);
  }

  renderUserButtons() {
    if (this.props.isLoggedIn) {
      return (
        <div className="ml-auto order-2 order-sm-3">
          <UncontrolledDropdown inNavbar>
            <DropdownToggle nav caret>
              <i className="fa fa-user"></i> {this.props.username}
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem tag="a" href="#">
                My Profile
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem tag="a" href="#" onClick={this.props.logOut}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      )
    }
    else {
      return (
        <div className="ml-auto order-2 order-sm-3">
          <Button
            outline
            color="warning"
            className="mx-2"
            onClick={() => this.props.openAuthModal('signup')}
          >
            Sign Up
          </Button>
          <Button
            outline
            color="warning"
            className="mx-2"
            onClick={() => this.props.openAuthModal('login')}
          >
            Log In
          </Button>
        </div>
      )
    }
    
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
          {this.renderUserButtons()}
          <Collapse isOpen={!collapsed} navbar className="order-3 order-sm-2">
            <Nav navbar>
              <NavItem className="px-2 py-2">
                <Link to="/other">other</Link>
              </NavItem>
              <NavItem className="px-2 py-2">
                <Link to="/channel">Channel</Link>
              </NavItem>
            </Nav>
          </Collapse>
        </div>
      </Navbar>
    );
  }
}

export default Header;