module.exports = {

  // Globals
  APP_NAME: 'Standup',
  APP_PATH: 'standup',

  // API
  API_URL: process.env.NODE_ENV === 'production' ? '/standup/' : 'https://qa.fingerti.ps/standup/',
  API_PATH: 'api',

  // assets
  ASSETS_PATH: process.env.NODE_ENV === 'production' ? '/standup/assets/static/' : '/assets/static/',

  // Redux actions
  SET_LOADING: 'SET_LOADING',
  SET_FETCHING: 'SET_FETCHING',
  SET_DESKTOP: 'SET_DESKTOP',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  SET_API_READY: 'SET_API_READY',
  RESET_RESOURCE: 'RESET_RESOURCE',
  LOCATION_UPDATE: 'LOCATION_UPDATE',
  SET_SETTINGS: 'SET_SETTINGS',
  SET_MIC_ON: 'SET_MIC_ON',
  SET_VIDEO_ON: 'SET_VIDEO_ON',
  SET_AUDIO_ON: 'SET_AUDIO_ON',
  SET_CHAT_ON: 'SET_CHAT_ON',

  // Storage
  FAVOURITES_STORAGE: 'standup-favourite-rooms',
  SETTINGS_STORAGE: 'standup-settings'

  // Messages
};
