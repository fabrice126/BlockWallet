// Node_modules
import React from 'react';
import PropTypes from 'prop-types';
// Locals
import './StickyDataCrypto.css';

class StickyDataCrypto extends React.PureComponent {
	/**
	* Fonction permettant de calculer le montant total ajouter dans les cryptos
	*/
	getTotal() {
		const { wallets } = this.props;
		let total = 0;
		for (let i = 0; i < wallets.length; i++) {
			if (!wallets[i]) continue;
			const { currentValue, quantity } = wallets[i];
			if (!currentValue || !quantity) continue;
			total += currentValue * quantity;
		}
		return total.toFixed(2);
	}

	/**
	* Fonction permettant de calculer le gain total
	*/
	getTotalGain() {
		const { wallets } = this.props;
		let totalGain = 0;
		for (let i = 0; i < wallets.length; i++) {
			if (!wallets[i]) continue;
			const { currentValue, buyValue, quantity } = wallets[i];
			if (!currentValue || !quantity) continue;
			totalGain += (currentValue - buyValue) * quantity;
		}
		return totalGain.toFixed(2);
	}

	render() {
		return (
			<div className="StickyDataCrypto">
				<span>BTC: ${this.props.btcusdt}</span>
				<span>Gain: ${this.getTotalGain()}</span>
				<span>Total: ${this.getTotal()}</span>
			</div>
		);
	}
}
StickyDataCrypto.propTypes = {
	btcusdt : PropTypes.number,
	wallets : PropTypes.arrayOf(
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
StickyDataCrypto.defaultProps = {
	btcusdt : null,
	wallets : [],
};
export default StickyDataCrypto;
