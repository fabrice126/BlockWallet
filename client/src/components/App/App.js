import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../Header/Header';
import './App.css'
import routes from '../../routes';
export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <main>
          <Switch>
            {routes.map((route, i) => <Route key={i} {...route} />)}
          </Switch>
        </main>
      </div>
    );
  }
}