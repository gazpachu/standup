import axios from 'axios';
import ReactGA from 'react-ga';
import Honeybadger from 'honeybadger-js';
import {
  readEndpoint,
  setHeaders,
  setEndpointHost,
  setEndpointPath,
  setAccessToken
} from 'redux-json-api';
import {
  setLoading,
  setFetching,
  setAPIReady,
  setNotification,
  resetResource
} from '../../actions/actions';
import store from '../../store';
import * as CONSTANTS from '../../constants/constants';

module.exports = {
  getAPIUrl() {
    return `${CONSTANTS.API_URL}${CONSTANTS.API_PATH}`;
  },

  setup() {
    store.dispatch(setEndpointHost(CONSTANTS.API_URL));
    store.dispatch(setEndpointPath(CONSTANTS.API_PATH));
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Cookie: String(document.cookie)
    };
    if (process.env.NODE_ENV === 'development') {
      headers['Vf-Agile-Fingertips'] = process.env.AGILE_FINGERTIPS;
    }
    store.dispatch(setHeaders(headers));
  },

  start() {
    if (process.env.NODE_ENV === 'development') {
      axios.defaults.headers.common['Vf-Agile-Fingertips'] = process.env.AGILE_FINGERTIPS;
    }
    store.dispatch(readEndpoint('start')).then((data) => {
      axios.defaults.headers.common.Authorization = `Bearer ${data.data.attributes.token}`;
      store.dispatch(setAccessToken(data.data.attributes.token));
      store.dispatch(setAPIReady(true));
      store.dispatch(setFetching(false));

      if (window.location.hostname) {
        if (process.env.NODE_ENV === 'production' && window.location.hostname.indexOf('www') !== -1) {
          if (data.included[0].attributes.email !== null) {
            // if the user is logged in with Yammer, then use user email
            ReactGA.set({ userId: data.included[0].attributes.email });
          }

          Honeybadger.setContext({
            user_email: data.included[0].attributes.email
          });
        }
      }
    }).catch((error) => {
      store.dispatch(setLoading(false));
      store.dispatch(setFetching(false));
      store.dispatch(setNotification({ message: String(error), type: 'error' }));
    });
  },

  loadData(location) {
    const endpoint = location.pathname.substring(1);
    let resource = endpoint;

    if (resource.includes('/')) {
      resource = endpoint.substr(0, resource.lastIndexOf('/'));
    }

    store.dispatch(setLoading(true));
    store.dispatch(setFetching(true));
    store.dispatch(resetResource(resource));
    store.dispatch(readEndpoint(`${endpoint}/${location.search}`)).then(() => {
      store.dispatch(setLoading(false));
      store.dispatch(setFetching(false));
    }).catch((error) => {
      store.dispatch(setLoading(false));
      store.dispatch(setFetching(false));
      store.dispatch(setNotification({ message: String(error), type: 'error' }));
    });
  }
};
