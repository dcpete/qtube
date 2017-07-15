import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import promise from 'redux-promise';

import reducers from './reducers';
import FrontPage from './containers/front_page';
import ChannelPage from './containers/channel_page';

const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(promise))(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/channels/:id" component={ChannelPage} />
          <Route path="/" component={FrontPage} />
        </Switch>  
      </div>
    </BrowserRouter>    
  </Provider>
  , document.querySelector('.container'));
