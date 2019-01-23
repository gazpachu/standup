import { createStore, applyMiddleware, compose } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { useRouterHistory } from 'react-router';
import thunk from 'redux-thunk';
import { createHistory } from 'history';
import { APP_PATH } from './constants/constants';
import rootReducer from './reducers/index';

const store = createStore(rootReducer, compose(applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

const browserHistory = useRouterHistory(createHistory)({
  basename: `/${APP_PATH}`
});

export const history = syncHistoryWithStore(browserHistory, store);

export default store;
