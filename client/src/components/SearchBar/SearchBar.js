// Node_modules
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// Locals
import './SearchBar.css';
import { searchCoinsService } from '../../services/searchServices';
// Components
import SearchSuggest from '../SearchSuggest/SearchSuggest';

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isFocused   : false,
			searchCoins : [],
			searchValue : '',
		};
	}

	/**
	 * When user type a currency in input element, we search for matching coins
	 */
	onChangeSearchCoins = (e) => {
		const { value } = e.target;
		if (!value) {
			return this.setState({ searchCoins: [], searchValue: value });
		}
		const searchCoins = searchCoinsService(value, this.props.coins);
		this.setState({ searchCoins, searchValue: value });
	};

	/**
	 * When a coin is selected in SearchSuggest component, we update the input search with the currency name
	 */
	onSelectCoin = (e) => {
		if (!e.currentTarget || !e.currentTarget.getAttribute('data-currency')) {
			return;
		}
		const searchValue = e.currentTarget.getAttribute('data-currency');
		const searchCoins = searchCoinsService(searchValue, this.props.coins);

		this.setState({ searchCoins, searchValue });
	}

	/**
	 * When the input search is focused, we display the SearchSuggest component
	 */
	onFocusSearchCoins = () => {
		this.setState({ isFocused: true });
	};

	/**
	 * When the input search is focused, we hide the SearchSuggest component
	 */
	onBlurSearchCoins = () => {
		this.setState({ isFocused: false });
	};

	render() {
		const { isFocused, searchCoins, searchValue } = this.state;
		return (
			<div className="Search" onBlur={this.onBlurSearchCoins}>
				<div className="Search__icon-wrapper">
					<SearchIcon className="Search__icon" />
				</div>
				<input className="Search__input" type="search" placeholder="XBT/ETH" aria-label="searchLabel" value={searchValue} onChange={this.onChangeSearchCoins} onFocus={this.onFocusSearchCoins} />
				<SearchSuggest isFocused={isFocused} searchCoins={searchCoins} onSelectCoin={this.onSelectCoin} />
			</div>
		);
	}
}

SearchBar.propTypes = {
	coins : PropTypes.arrayOf(PropTypes.object),
};
SearchBar.defaultProps = {
	coins : [],
};
const mapStateToProps = state => ({ coins: state.searchReducer.coins });

export default connect(
	mapStateToProps,
	null,
)(SearchBar);
