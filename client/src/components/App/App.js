import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Header from '../Header/Header';
import './App.css';
import routes from '../../routes';

function App() {
	return (
		<BrowserRouter>
			<div>
				<Header />
				<main>
					<Switch>
						{routes.map(route => (
							<Route {...route} />
						))}
					</Switch>
				</main>
			</div>
		</BrowserRouter>
	);
}

export default App;
