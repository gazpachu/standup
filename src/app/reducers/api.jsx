import { reducer } from 'redux-json-api';
import reduceReducers from 'reduce-reducers';
import { RESET_RESOURCE } from '../constants/constants';

const api = reduceReducers(reducer, (state, action) => {
  // if the action type is _not_ RESET_RESOURCE, no action taken
  if (action.type !== RESET_RESOURCE) {
    return state;
  }

  return state;
});

export default api;
