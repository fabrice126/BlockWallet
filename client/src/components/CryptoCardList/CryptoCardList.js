// Node_modules
import React from 'react';
import ReactTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';
// Locals
import './CryptoCardList.css';
// Components
import CryptoCard from '../CryptoCard/CryptoCard';

class CryptoCardList extends React.PureComponent {
	render() {
		const { wallets, currencyExclude } = this.props;
		return (
			<div className="CryptoCardList">
				<ReactTransitionGroup className="CryptoCardList__transitionGroup" transitionName="fade" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
					{
						wallets && wallets.map((wallet, index) => {
							if (!wallet) return false;
							return <CryptoCard key={wallet.id} wallet={wallet} index={index} currencyExclude={currencyExclude} />;
						})
					}
				</ReactTransitionGroup>
			</div>
		);
	}
}
CryptoCardList.propTypes = {
	currencyExclude : PropTypes.arrayOf(PropTypes.string),
	wallets         : PropTypes.arrayOf(
		PropTypes.shape({
			isEditing    : PropTypes.bool,
			buyValue     : PropTypes.number,
			currentValue : PropTypes.number,
			quantity     : PropTypes.number,
			exchange     : PropTypes.string,
			currency     : PropTypes.string,
			img          : PropTypes.string,
		}),
	),
};
CryptoCardList.defaultProps = {
	wallets         : [],
	currencyExclude : [],
};
export default CryptoCardList;
