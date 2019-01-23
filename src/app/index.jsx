import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import ReactGA from 'react-ga';
import Honeybadger from 'honeybadger-js';
import store, { history } from './store';
import App from './components/app';
import Home from './components/home/home';
import Room from './components/room/room';
import Page from './components/page/page';
import Statistics from './components/statistics/statistics';
import PageNotFound from './components/pageNotFound/pageNotFound';
import './components/bundle.scss';

if (process.env.NODE_ENV === 'production' && window.location.hostname.indexOf('www') !== -1) {
  ReactGA.initialize('UA-86824290-1', {
    debug: false,
    titleCase: false,
    gaOptions: {
      userId: ''
    }
  });
}

if (process.env.NODE_ENV === 'production') {
  Honeybadger.configure({
    apiKey: 'f2cdc518',
    environment: 'production',
    revision: process.env.COMMITHASH
  });
}

function logPageView() {
  const entireUrl = window.location.href;
  if (process.env.NODE_ENV === 'production' && window.location.hostname.indexOf('www') !== -1) {
    ReactGA.set({ page: entireUrl });
    ReactGA.pageview(entireUrl);
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router
      onUpdate={() => {
        window.scrollTo(0, 0);
        logPageView();
      }}
      history={history}
    >
      {/* <Redirect from="/" to="somewhere" /> */}
      <Route path="/" component={App}>
        <IndexRoute component={Home} endpoint="" />
        <Route path="/about" component={Page} title="About" />
        <Route path="/agile-scrum" component={Page} title="Agile & Scrum" />
        <Route path="/rules" component={Page} title="Standup rules" />
        <Route path="/statistics" component={Statistics} title="Statistics" />
        <Route path="/:room" component={Room} title="Room title" />
        <Route path="*" component={PageNotFound} title="Page not found" />
      </Route>
    </Router>
  </Provider>
, document.getElementById('react-root'));
