import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { searchMiddleWare } from './middleware/searchMiddleware';
import { walletMiddleware } from './middleware/walletMiddleware';

const middlewares = [thunk, searchMiddleWare, walletMiddleware];
const store = createStore(
	rootReducer,
	composeWithDevTools(
		applyMiddleware(...middlewares),
	),
);

export default store;
