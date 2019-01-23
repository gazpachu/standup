import * as CONSTANTS from '../constants/constants';

// State is not the application state, only the state this reducer is respondible for
export default function main(state = {
  isLoading: true,
  isFetching: false,
  isDesktop: true,
  notification: { message: '', type: '' },
  historyLocation: null,
  settings: {
    username: '',
    quality: 50,
    micOn: false,
    videoOn: true,
    audioOn: true,
    sfxOn: true
  },
  micOn: true,
  videoOn: true,
  audioOn: true,
  chatOn: false
}, action) {
  switch (action.type) {
    case CONSTANTS.SET_CHAT_ON: return { ...state, chatOn: action.payload };
    case CONSTANTS.SET_MIC_ON: return { ...state, micOn: action.payload };
    case CONSTANTS.SET_VIDEO_ON: return { ...state, videoOn: action.payload };
    case CONSTANTS.SET_AUDIO_ON: return { ...state, audioOn: action.payload };
    case CONSTANTS.SET_SETTINGS: return { ...state, settings: action.payload };
    case CONSTANTS.SET_LOADING: return { ...state, isLoading: action.payload };
    case CONSTANTS.SET_FETCHING: return { ...state, isFetching: action.payload };
    case CONSTANTS.SET_DESKTOP: return { ...state, isDesktop: action.payload };
    case CONSTANTS.SET_NOTIFICATION: return { ...state, notification: action.payload };
    case CONSTANTS.SET_API_READY: return { ...state, apiReady: action.payload };
    case CONSTANTS.LOCATION_UPDATE: return { ...state, historyLocation: action.payload };
    default: return state;
  }
}
