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
  renderTextInput({input, type, placeholder}) {
    return (
      <Input
        type={type}
        placeholder={placeholder}
        {...input}
      />
    );
  }

  render() {
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <FormGroup>
          <Label for="email">
            Email
          </Label>
          <Field
            name="email"
            type="text"
            component={this.renderTextInput}
          />
        </FormGroup>
        <FormGroup>
          <Label for="username">
            Username
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
            type="password"
            component={this.renderTextInput}
          />
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