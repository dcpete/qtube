import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import Search from '../components/Search';
import { fetchChannelsList } from '../actions/channel_actions';

const mapStateToProps = function (state) {
  return { }
}

const mapDispatchToProps = { }

const onSubmit = (values, dispatch, props) => { 
  dispatch(fetchChannelsList(values.search));
}

const SearchForm = reduxForm({
  form: 'search',
  onSubmit
})(Search);

const SearchContainer = connect(mapStateToProps, mapDispatchToProps)(SearchForm);
export default SearchContainer;