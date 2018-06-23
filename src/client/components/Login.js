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
  renderTextInput({input, placeholder}) {
    return (
      <Input
        type="text"
        placeholder={placeholder}
        {...input}
      />
    );
  }

  render() {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <FormGroup>
          <Label for="username">
            Username or Email
          </Label>
          <Field
            name="username"
            type="text"
            component={this.renderTextInput}
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">
            Password
          </Label>
          <Field
            name="password"
            type="text"
            component={this.renderTextInput}
          />
          <p className="text-right">Forgot your password?</p>
        </FormGroup>
        <FormGroup className="mt-4">
          <Button
            block
            color="secondary"
            type="submit"
          >
            Log In
          </Button>
        </FormGroup>
      </Form>
    );
  }
}

export default Login;