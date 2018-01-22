import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import reducers from './reducers';
import AppContainer from './containers/AppContainer'

const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(thunk))(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <div>  
        <AppContainer />
      </div>  
    </BrowserRouter>
  </Provider>
  , document.querySelector('.container'));
