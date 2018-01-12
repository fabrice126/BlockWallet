import React, { Component } from 'react';
import Header from '../Header/Header';
import './App.css'
//Used for React-Route
import Home from '../../views/Home/Home';
import Advert from '../../views/Advert/Advert';
import Logout from '../../views/Logout/Logout';


import { BrowserRouter, Switch, Route } from 'react-router-dom';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <main>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/advert' component={Advert} />
              <Route path='/logout' component={Logout} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}