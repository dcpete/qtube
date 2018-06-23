import React, { Component } from 'react';
import {
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap';
import classnames from 'classnames';

import LoginContainer from '../containers/LoginContainer';
import SignupContainer from '../containers/SignupContainer';

class Auth extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: this.props.tab ? this.props.tab : 'signup'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    return (
      <Container>
        <Nav tabs justified className="mb-2">
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === 'signup' })}
              onClick={() => { this.toggle('signup'); }}>
              Sign Up
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === 'login' })}
              onClick={() => { this.toggle('login'); }}>
              Log In
            </NavLink>
          </NavItem>
        </Nav>
        <h3 className="text-center py-4">qtube</h3>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="signup">
            <SignupContainer />
          </TabPane>
          <TabPane tabId="login">
            <LoginContainer />
          </TabPane>
        </TabContent>
      </Container>
    );
  }
}

export default Auth;