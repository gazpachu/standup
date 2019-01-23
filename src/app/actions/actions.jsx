import * as CONSTANTS from '../constants/constants';

export function setData(type, payload) {
  return {
    type,
    payload
  };
}

export function setSettings(state) {
  return {
    type: CONSTANTS.SET_SETTINGS,
    payload: state
  };
}

export function locationDidUpdate(location) {
  return {
    type: CONSTANTS.LOCATION_UPDATE,
    payload: {
      ...location
    }
  };
}

export function resetResource(resource) {
  return {
    type: CONSTANTS.RESET_RESOURCE,
    payload: resource
  };
}

export function setLoading(state) {
  return {
    type: CONSTANTS.SET_LOADING,
    payload: state
  };
}

export function setAPIReady(state) {
  return {
    type: CONSTANTS.SET_API_READY,
    payload: state
  };
}

export function setFetching(state) {
  return {
    type: CONSTANTS.SET_FETCHING,
    payload: state
  };
}

export function changeViewport(state) {
  return {
    type: CONSTANTS.SET_DESKTOP,
    payload: state
  };
}

export function setNotification(state) {
  return {
    type: CONSTANTS.SET_NOTIFICATION,
    payload: state
  };
}
