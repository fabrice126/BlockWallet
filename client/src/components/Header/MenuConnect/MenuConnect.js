// Node_modules
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// Locals
import './MenuConnect.css';

export default class MenuConnect extends React.PureComponent {
	render() {
		const { menuVisible, onCloseMenu } = this.props;
		return (
			<div className="MenuConnect" hidden={!menuVisible}>
				<ul className="MenuConnect__list">
					<li className="MenuConnect__item" onClick={onCloseMenu}>
						<Link className="MenuConnect__link" to="/advert">Advert</Link>
					</li>
				</ul>
			</div>
		);
	}
}
MenuConnect.propTypes = {
	menuVisible : PropTypes.bool,
	onCloseMenu : PropTypes.func.isRequired,
};
MenuConnect.defaultProps = {
	menuVisible : false,
};
