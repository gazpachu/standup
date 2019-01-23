import reducer from './index';

const initialJSONReducer = {
  endpoint: {
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json'
    },
    host: null,
    path: null
  },
  isCreating: 0,
  isDeleting: 0,
  isReading: 0,
  isUpdating: 0
};
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

describe('RootReducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      api: initialJSONReducer,
      mainReducer: initialMainReducer,
      reducer: initialJSONReducer,
      routing: {
        locationBeforeTransitions: null
      }
    });
  });
});
