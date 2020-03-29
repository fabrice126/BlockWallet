// Node_modules
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
// Locals
import './Home.css';
// Components
import StickyDataCrypto from '../../components/StickyDataCrypto/StickyDataCrypto';
import CryptoCardList from '../../components/CryptoCardList/CryptoCardList';
// Redux Actions
import { initWallets, addWallet, setWalletFieldState } from '../../store/actions/walletActions';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.ws_btcusdt = null;
		// Lorsque nous ajoutons une crypto alors nous devons scroller vers cette nouvelle case (componentDidUpdate)
		this.mod_btcusdt = null;
	}

	componentDidMount = async () => {
		// création d'un WebSocket pour récupérer le prix courant du BTC
		this.ws_btcusdt = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@aggTrade');
		this.ws_btcusdt.onopen = () => console.log('Connexion à la paire BTC/USDT reussi');
		this.ws_btcusdt.onerror = () => console.error('Impossible de trouver la paire BTC/USDT');
		this.ws_btcusdt.onmessage = (event) => {
			const { p: btcusdt } = JSON.parse(event.data);
			// Afin de ne pas appeler le setState trop souvent, on actualise le prix du BTC tout les 20 hits
			if (!(this.mod_btcusdt % 20) || this.mod_btcusdt === null) {
				this.mod_btcusdt = 0;
				this.props.setWalletFieldState({ btcusdt: Number(Number(btcusdt).toFixed(0)) });
			}
			this.mod_btcusdt++;
		};
		if (!this.props.wallets.length) {
			try {
				await this.props.initWallets();
			} catch (error) {
				console.error('this.props.initWallets()=>', error);
			}
		}
	};

	componentDidUpdate = (prevProps) => {
		const { wallets } = this.props;
		const { wallets: oldWallets } = prevProps;
		if (oldWallets.length && wallets.length && wallets.length > oldWallets.length) {
			window.scroll({
				top      : document.documentElement.scrollHeight,
				behavior : 'smooth',
			});
		}
	};

	componentWillUnmount = () => {
		if (!this.ws_btcusdt) return;
		this.ws_btcusdt.close();
	};

	/**
	 * Ajoute une nouvelle crypto
	 */
	onClickAddWallet = () => {
		const newWallet = {
			currency     : '',
			buyValue     : 0,
			currentValue : 0,
			quantity     : 0,
			exchange     : 'binance',
			img          : '',
			isEditing    : true,
			id           : Date.now(),
		};
		this.props.addWallet(newWallet);
	};

	render() {
		const {
			wallets, errorRequest, btcusdt, currencyExclude,
		} = this.props;
		if (!wallets) return <div>Chargement des données...</div>;
		if (errorRequest != null) return <div>Erreur lors du chargement des données...</div>;
		return (
			<div id="Home">
				<Fab color="primary" aria-label="Add" id="Home__add-product" fab="true" onClick={this.onClickAddWallet}>
					<AddIcon />
				</Fab>
				<StickyDataCrypto btcusdt={btcusdt} wallets={wallets} />
				<CryptoCardList wallets={wallets} currencyExclude={currencyExclude} />
			</div>
		);
	}
}

Home.propTypes = {
	btcusdt         : PropTypes.number,
	errorRequest    : PropTypes.string,
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
	addWallet           : PropTypes.func.isRequired,
	initWallets         : PropTypes.func.isRequired,
	setWalletFieldState : PropTypes.func.isRequired,
};
Home.defaultProps = {
	btcusdt         : null,
	errorRequest    : null,
	wallets         : [],
	currencyExclude : [],
};
const mapStateToProps = state => ({ ...state.walletReducer });

const mapDispatchToProps = dispatch => ({
	addWallet           : wallet => dispatch(addWallet(wallet)),
	initWallets         : wallets => dispatch(initWallets(wallets)),
	setWalletFieldState : wallets => dispatch(setWalletFieldState(wallets)),
});

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps,
	)(Home),
);
