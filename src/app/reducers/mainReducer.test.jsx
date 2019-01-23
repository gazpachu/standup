import reducer from './mainReducer';
import * as CONSTANTS from '../constants/constants';

const initialMainReducer = {
  isDesktop: true,
  isFetching: false,
  isLoading: true,
  notification: {
    message: '',
    type: ''
  },
  historyLocation: null
};

describe('MainReducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialMainReducer);
  });

  it('should handle SET_LOADING', () => {
    expect(reducer(undefined, {
      type: CONSTANTS.SET_LOADING,
      payload: false
    })).toEqual({
      ...initialMainReducer,
      isLoading: false
    });

    expect(reducer(undefined, {
      type: CONSTANTS.SET_LOADING,
      payload: true
    })).toEqual({
      ...initialMainReducer,
      isLoading: true
    });
  });

  it('should handle SET_FETCHING', () => {
    expect(reducer(undefined, {
      type: CONSTANTS.SET_FETCHING,
      payload: false
    })).toEqual({
      ...initialMainReducer,
      isFetching: false
    });

    expect(reducer(undefined, {
      type: CONSTANTS.SET_FETCHING,
      payload: true
    })).toEqual({
      ...initialMainReducer,
      isFetching: true
    });
  });

  it('should handle SET_DESKTOP', () => {
    expect(reducer(undefined, {
      type: CONSTANTS.SET_DESKTOP,
      payload: false
    })).toEqual({
      ...initialMainReducer,
      isDesktop: false
    });

    expect(reducer(undefined, {
      type: CONSTANTS.SET_DESKTOP,
      payload: true
    })).toEqual({
      ...initialMainReducer,
      isDesktop: true
    });
  });

  it('should handle SET_NOTIFICATION', () => {
    expect(reducer(undefined, {
      type: CONSTANTS.SET_NOTIFICATION,
      payload: 'a'
    })).toEqual({
      ...initialMainReducer,
      notification: 'a'
    });
  });

  it('should handle LOCATION_UPDATE', () => {
    expect(reducer(undefined, {
      type: CONSTANTS.LOCATION_UPDATE,
      payload: 'a'
    })).toEqual({
      ...initialMainReducer,
      historyLocation: 'a'
    });
  });

  it('should handle SET_API_READY', () => {
    expect(reducer(undefined, {
      type: CONSTANTS.SET_API_READY,
      payload: 'a'
    })).toEqual({
      ...initialMainReducer,
      apiReady: 'a'
    });
  });
});
