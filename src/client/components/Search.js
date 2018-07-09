import React, { Component } from 'react';
import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import { Field } from 'redux-form';

class Search extends Component {
  render() {
    return (
      <div>  
        <InputGroup>
          <InputGroupAddon prepend>
            <InputGroupText>
            <i class="fas fa-search"></i>
            </InputGroupText>
          </InputGroupAddon>
          <Field
            name="search"
            component={({ input }) => {
              return <Input type="text" name={input.name} {...input} />
            }}
          />
        </InputGroup>
      </div>
    );
  }
}

export default Search;