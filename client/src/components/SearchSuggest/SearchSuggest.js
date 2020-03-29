// Node_modules
import React from 'react';
import PropTypes from 'prop-types';
// Locals
import './SearchSuggest.css';

class SearchSuggest extends React.PureComponent {
	render() {
		const { searchCoins, isFocused, onSelectCoin } = this.props;
		return (
			<div className="SearchSuggest">
				{
					isFocused && searchCoins && searchCoins.length > 0 && searchCoins.map(coin => (
						// We use onMouseDown because this event is fired before onBlur
						<div key={coin.id} className="SearchSuggest__item" onMouseDown={onSelectCoin} role="button" data-currency={coin.symbol} tabIndex="0">
							<span className="SearchSuggest__center">
								<img className="SearchSuggest__image" alt="Crypto" width="16" height="16" src={`https://s2.coinmarketcap.com/static/img/coins/32x32/${coin.id}.png`} />
							</span>
							<span className="SearchSuggest__center">
								{coin.name} - ({coin.symbol})
							</span>
						</div>
					))}
			</div>
		);
	}
}

SearchSuggest.propTypes = {
	onSelectCoin : PropTypes.func.isRequired,
	searchCoins  : PropTypes.arrayOf(PropTypes.object),
	isFocused    : PropTypes.bool,
};
SearchSuggest.defaultProps = {
	searchCoins : [],
	isFocused   : false,
};


export default SearchSuggest;
