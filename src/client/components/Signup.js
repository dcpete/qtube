import React, { Component } from 'react';
import { Field } from 'redux-form';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
    }

    this.handleSignupSubmit = this.handleSignupSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleSignupSubmit(event) {
    event.preventDefault();
    this.props.signUp(this.state.username, this.state.email, this.state.password)
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value
    })
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.target.value
    })
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    })
  }

  render() {
    return (
      <Form onSubmit={this.handleSignupSubmit}>
        <FormGroup>
          <Label for="email">
            Email
          </Label>
          <Input
            name="email"
            type="text"
            disabled={this.props.isFetchingUser}
            onChange={this.handleEmailChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="username">
            Username or Email
          </Label>
          <Input
            name="username"
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
          >
            Sign Up
          </Button>
        </FormGroup>
      </Form>
    );
  }
}

export default Signup;