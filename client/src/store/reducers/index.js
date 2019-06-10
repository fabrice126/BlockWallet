import { combineReducers } from 'redux';
import walletReducer from './walletReducer';
import authReducer from './authReducer';

export default combineReducers({
	walletReducer,
	authReducer,
});
