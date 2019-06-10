import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from 'react-router-dom';
import MenuConnect from './MenuConnect';

import './Header.css';

export default class Header extends Component {
	constructor() {
		super();
		this.state = {
			menuConnectVisible : false,
		};
	}

    onToggleMenuConnect = () => {
    	const { menuConnectVisible } = this.state;
    	this.setState({ menuConnectVisible: !menuConnectVisible });
    }

    closeMenuConnect = () => {
    	this.setState({ menuConnectVisible: false });
    }

    render() {
    	return (
    		<header id="Header">
    			<Link className="navLink" to="/">
    				<div className="div_logo">
    					<span>B</span>
    					<span>W</span>
    				</div>
    			</Link>
    			<div id="div_search">
    				<div className="search_icon_wrapper">
    					<SearchIcon className="search_icon" />
    				</div>
    				<input type="search" placeholder="XBT/ETH" aria-label="searchLabel" />
    			</div>
    			<IconButton className="avatar_icon" onClick={this.onToggleMenuConnect}>
    				<Avatar alt="Adelle Charles" src="/uploads/profile-img.jpg" />
    			</IconButton>
    			<MenuConnect isVisible={this.state.menuConnectVisible} closeMenuConnect={this.closeMenuConnect} />
    		</header>
    	);
    }
}


// <IconButton aria-label="Menu">
// <MenuIcon />
// </IconButton>
// <Link className="navLink" to='/'>
// <div className="div_logo">
//     <span>G</span>
//     <span>G</span>
// </div>
// </Link>
// <div id="div_search">
// <IconButton aria-label="Search">
//     <SearchIcon />
// </IconButton>
// <input type="search" placeholder="Rechercher" />
// <IconButton aria-label="Search">
//     <ExpandMoreIcon />
// </IconButton>
// </div>
// <IconButton>
// <Avatar onClick={this.onToggleMenuConnect} alt="Adelle Charles" src="/uploads/profile-img.jpg" />
// </IconButton>
// <MenuConnect isVisible={this.state.menuConnectVisible} closeMenuConnect={this.closeMenuConnect} />
