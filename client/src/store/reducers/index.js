import { combineReducers } from 'redux';
import walletReducer from './walletReducer';
import searchReducer from './searchReducer';
import authReducer from './authReducer';
import headerReducer from './headerReducer';

export default combineReducers({
	walletReducer,
	searchReducer,
	authReducer,
	headerReducer,
});
