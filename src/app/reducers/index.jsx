import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer } from 'redux-json-api';
import mainReducer from './mainReducer';
import api from './api';

const rootReducer = combineReducers({ mainReducer, api, reducer, routing: routerReducer });

export default rootReducer;
