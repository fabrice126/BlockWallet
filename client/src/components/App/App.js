// Node_modules
import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
// Locals
import routes from '../../routes';
import './App.css';
// Components
import Header from '../Header/Header';

function App() {
	return (
		<BrowserRouter>
			<div>
				<Header />
				<main>
					<Switch>
						{routes.map(route => (
							<Route {...route} key={route.key} />
						))}
					</Switch>
				</main>
			</div>
		</BrowserRouter>
	);
}

export default App;
