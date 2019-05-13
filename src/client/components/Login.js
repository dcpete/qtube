import React, { Component } from 'react';
import { Field } from 'redux-form';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameOrEmail: "",
      password: "",
    }

    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleLoginSubmit(event) {
    event.preventDefault();
    this.props.logIn(this.state.usernameOrEmail, this.state.password)
  }

  handleUsernameChange(event) {
    this.setState({
      usernameOrEmail: event.target.value
    })
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    })
  }

  render() {
    return (
      <Form onSubmit={this.handleLoginSubmit}>
        <FormGroup>
          <Label for="username">
            Username or Email
          </Label>
          <Input
            name="usernameOrEmail"
            type="text"
            disabled={this.props.isFetchingUser}
            onChange={this.handleUsernameChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">
            Password
          </Label>
          <Input
            name="password"
            type="password"
            disabled={this.props.isFetchingUser}
            onChange={this.handlePasswordChange}
          />
          <p className="text-right">Forgot your password?</p>
        </FormGroup>
        <FormGroup className="mt-4">
          <Button
            block
            color="secondary"
            type="submit"
            disabled={this.props.isFetchingUser}
          >
            Log In
          </Button>
        </FormGroup>
      </Form>
    );
  }
}

export default Login;