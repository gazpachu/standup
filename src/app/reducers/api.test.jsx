import reducer from './api';
import { RESET_RESOURCE } from '../constants/constants';

describe('API reducer', () => {
  it('should return initial state', () => {
    const dummyState = { dummy: 'data' };

    expect(reducer(dummyState, {})).toEqual(dummyState);
  });

  it('should handle RESET_RESOURCE action on empty state', () => {
    expect(reducer(undefined, {
      type: RESET_RESOURCE,
      payload: 'a'
    })).toEqual({});
  });

  it('should handle RESET_RESOURCE action on not empty state', () => {
    const dummyState = { dummy: 'data' };

    expect(reducer(dummyState, {
      type: RESET_RESOURCE,
      payload: 'a'
    })).toEqual({});
  });
});
