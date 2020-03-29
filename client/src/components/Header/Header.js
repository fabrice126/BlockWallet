// Node_modules
import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// Locals
import './Header.css';
// Components
import MenuConnect from './MenuConnect/MenuConnect';
import SearchBar from '../SearchBar/SearchBar';
// Redux Actions
import { initCoins } from '../../store/actions/searchActions';
import { onCloseMenu, onToggleMenu } from '../../store/actions/headerActions';

class Header extends React.PureComponent {
	async componentDidMount() {
		try {
			await this.props._initCoins();
		} catch (error) {
			console.error('error HEADER componentDidMount', error);
		}
	}

	render() {
		const { menuVisible, _onToggleMenu, _onCloseMenu } = this.props;
		return (
			<header className="Header">
				<Link className="Header__link" to="/">
					<div className="Header__logo">
						<span className="Header__logo-letter">B</span>
						<span className="Header__logo-letter">W</span>
					</div>
				</Link>
				<SearchBar />
				<IconButton className="Header__avatar" onClick={_onToggleMenu}>
					<Avatar alt="Profile Image" src="/img/github-img.png" />
				</IconButton>
				<MenuConnect menuVisible={menuVisible} onCloseMenu={_onCloseMenu} />
			</header>
		);
	}
}
Header.propTypes = {
	menuVisible   : PropTypes.bool.isRequired,
	_initCoins    : PropTypes.func.isRequired,
	_onToggleMenu : PropTypes.func.isRequired,
	_onCloseMenu  : PropTypes.func.isRequired,
};
Header.defaultProps = {
};
const mapStateToProps = (state) => {
	const { menuVisible } = state.headerReducer;
	return { menuVisible };
};

const mapDispatchToProps = dispatch => ({
	_initCoins    : coins => dispatch(initCoins(coins)),
	_onCloseMenu  : () => dispatch(onCloseMenu()),
	_onToggleMenu : () => dispatch(onToggleMenu()),
});
export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Header);
