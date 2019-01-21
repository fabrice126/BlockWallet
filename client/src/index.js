import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App/App';
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.hydrate(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('root'),
);
// registerServiceWorker();
