// Node_modules
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Locals
import './CryptoCard.css';
// Components
import CryptoCardHeader from './CryptoCardHeader/CryptoCardHeader';
import CryptoCardBody from './CryptoCardBody/CryptoCardBody';
// Redux Actions
import { deleteWallet, saveWallet, setWalletFieldState } from '../../store/actions/walletActions';

class CryptoCard extends React.Component {
	constructor(props) {
		super(props);
		const { wallet } = props;
		this.timeoutCardDraggable = null;
		this.state = {
			currencyInput : wallet.currency || '',
			quantityInput : wallet.quantity || 0,
			buyValueInput : wallet.buyValue || 0,
			isEditing     : wallet.isEditing || false,
			draggable     : '',
		};
	}

	componentDidMount() {
		const { wallet, currencyExclude } = this.props;
		// If excluded crypto are in this wallet
		if (!currencyExclude.includes(wallet.currency)) {
			this.createNewSocket(wallet);
		}
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		const { isEditing, draggable } = this.state;
		const { wallet } = this.props;
		if (
			wallet.currentValue === nextProps.wallet.currentValue
			&& wallet.quantity === nextProps.wallet.quantity
			&& wallet.currency === nextProps.wallet.currency
			&& wallet.exchange === nextProps.wallet.exchange
			&& isEditing === nextState.isEditing
			&& draggable === nextState.draggable
		) {
			return false;
		}
		// console.log('----UPDATE =>', wallet.currency);
		return true;
	};

	onSave = (e) => {
		e.preventDefault();
		const { index, wallet } = this.props;
		const {
			currencyInput, quantityInput, buyValueInput, isEditing,
		} = this.state;
		if (!currencyInput || Number(buyValueInput) < 0 || Number(quantityInput) < 0) return;
		let newWallet = {
			...wallet,
			currency : currencyInput,
			buyValue : Number(buyValueInput),
			quantity : Number(quantityInput),
		};
		// Si la currency change alors on supprime le socket vers l'ancienne monnaie pour le recréer vers la nouvelle monnaie
		if (wallet.currency !== newWallet.currency) {
			const coinFound = this.props.coins.find(coin => coin.symbol.toUpperCase() === newWallet.currency.toUpperCase());
			if (!coinFound) return console.log("this coin doesn't exists");
			const { id: idCMC } = coinFound;
			newWallet = { ...newWallet, idCMC };
			// Si l'ancien wallet n'a pas de websocket (nouveau wallet)
			if (wallet.websocket) {
				this.closeSocket(wallet);
			}
			this.createNewSocket(newWallet);
		}
		this.props.saveWallet(newWallet, index);
		this.setState({ isEditing: !isEditing }, () => { });
	};

	onDelete = () => {
		const { wallet, index } = this.props;
		if (wallet.websocket) {
			this.closeSocket(wallet);
		}
		this.props.deleteWallet(index);
	};

	createNewSocket = (wallet) => {
		const { index } = this.props;
		if (!wallet.currency) return;
		wallet.websocket = new WebSocket(`wss://stream.binance.com:9443/ws/${wallet.currency.toLowerCase()}btc@aggTrade`);
		wallet.websocket.onopen = () => console.log(`Connexion à la paire BTC/${wallet.currency} reussi`);
		wallet.websocket.onerror = () => console.error(`Impossible de trouver la paire à la paire BTC/${wallet.currency}`);
		wallet.websocket.onmessage = (event) => {
			// Nous devons recupérer l'objet wallet des props afin qu'il soit a jour
			const { btcusdt, wallet: propsWallet } = this.props;
			if (btcusdt === null) return;
			const { p: currentValue } = JSON.parse(event.data);
			const newCurrentValue = Number((Number(currentValue) * btcusdt).toFixed(2));
			// Si la valeur est la même on ne fait rien
			if (propsWallet.currentValue === newCurrentValue) return;
			const newWallet = { ...propsWallet, currentValue: newCurrentValue };
			this.props.saveWallet(newWallet, index);
		};
	};

	closeSocket = (wallet) => {
		if (wallet && wallet.websocket) {
			wallet.websocket.close();
			console.log(`Socket closed: ${wallet.currency}`);
		} else {
			console.error('No socket for this currency');
		}
	};

	onChangeSelectExchange = (e) => {
		const { wallet, index } = this.props;
		const newWallet = {
			...wallet,
			exchange : e.target.value,
		};
		this.props.saveWallet(newWallet, index);
	};

	onInputChange = (e) => {
		const value = Number.isNaN(e.target.valueAsNumber) ? e.target.value : e.target.valueAsNumber;
		this.setState({ [e.target.name]: value });
	};

	onEdit = () => {
		const { isEditing } = this.state;
		this.setState({ isEditing: !isEditing });
	};

	onMouseDownCard = () => {
		this.timeoutCardDraggable = setTimeout(() => {
			const { draggable } = this.state;
			this.setState({ draggable: draggable ? '' : 'draggable' });
		}, 1500);
	}

	onMouseUpCard = () => {
		window.clearTimeout(this.timeoutCardDraggable);
	}

	componentWillUnmount = () => {
		const { wallet } = this.props;
		if (!wallet.websocket) return;
		wallet.websocket.close();
		console.log('Sockets closed');
	};

	render() {
		const { isEditing, draggable } = this.state;
		const { wallet } = this.props;
		const { currency, exchange, idCMC } = wallet;
		const img = `https://s2.coinmarketcap.com/static/img/coins/128x128/${idCMC}.png`;
		const exchangeGeneralStyle = `${exchange}-general-style`;
		return (
			<div className={`CryptoCard CryptoCard__${exchangeGeneralStyle} ${draggable}`} onMouseDown={this.onMouseDownCard} onMouseUp={this.onMouseUpCard} role="button" tabIndex={0}>
				<CryptoCardHeader
					onSave={this.onSave}
					onEdit={this.onEdit}
					onDelete={this.onDelete}
					onInputChange={this.onInputChange}
					currency={currency}
					exchange={exchange}
					isEditing={isEditing}
					img={img}
				/>
				<CryptoCardBody onInputChange={this.onInputChange} onChangeSelectExchange={this.onChangeSelectExchange} wallet={wallet} isEditing={isEditing} />
			</div>
		);
	}
}

CryptoCard.propTypes = {
	wallet : PropTypes.shape({
		isEditing    : PropTypes.bool,
		buyValue     : PropTypes.number,
		currentValue : PropTypes.number,
		quantity     : PropTypes.number,
		exchange     : PropTypes.string,
		currency     : PropTypes.string,
		img          : PropTypes.string,
	}),
	index           : PropTypes.number.isRequired,
	saveWallet      : PropTypes.func.isRequired,
	deleteWallet    : PropTypes.func.isRequired,
	currencyExclude : PropTypes.arrayOf(PropTypes.string),
	btcusdt         : PropTypes.number,
	coins           : PropTypes.arrayOf(PropTypes.object),
};

CryptoCard.defaultProps = {
	wallet : {
		isEditing    : false,
		buyValue     : 0,
		currentValue : 0,
		quantity     : 0,
		exchange     : '',
		currency     : '',
		img          : '',
	},
	currencyExclude : [],
	btcusdt         : 0,
	coins           : [],
};
const mapStateToProps = state => ({
	btcusdt : state.walletReducer.btcusdt,
	coins   : state.searchReducer.coins,
});

const mapDispatchToProps = dispatch => ({
	setWalletFieldState : wallets => dispatch(setWalletFieldState(wallets)),
	deleteWallet        : wallet => dispatch(deleteWallet(wallet)),
	saveWallet          : (wallet, index) => dispatch(saveWallet(wallet, index)),
});
export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CryptoCard);
