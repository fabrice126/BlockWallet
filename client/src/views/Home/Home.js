import React from 'react';
import PropTypes from 'prop-types';
// Local
import './Home.css';
// import Modal from '../../components/Modal/Modal';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ReactTransitionGroup from 'react-addons-css-transition-group';
import axios from 'axios';
import CryptoCard from '../../components/CryptoCard/CryptoCard';

class Home extends React.Component {
	static requestInitialData = async () => {
	  const result = await axios.get(`${process.env.REACT_APP_API_HOST}/api/wallet`);
	  return result;
	}

	constructor(props) {
	  super(props);
	  let initialData;
	  if (props.staticContext) {
	    initialData = props.staticContext.initialData;
	  } else {
	    initialData = window.__initialData__;
	    delete window.__initialData__;
	  }
	  this.ws_btcusdt = null;
	  // Lorsque nous ajoutons une crypto alors nous devons scroller vers cette nouvelle case (componentDidUpdate)
	  this.deleted = false;
	  this.mod_btcusdt = null;
	  this.state = {
	    wallets         : initialData,
	    errorRequest    : null,
	    btcusdt         : null,
	    currencyExclude : ['PART', 'DENT', 'XRB', 'TEL'],
	  };
	}


	componentDidMount = async () => {
	  // création d'un WebSocket pour récupérer le prix courant du BTC
	  this.ws_btcusdt = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@aggTrade');
	  this.ws_btcusdt.onopen = () => console.log('Connexion à la paire BTC/USDT reussi');
	  this.ws_btcusdt.onerror = () => console.error('Impossible de trouver la paire à la paire BTC/USDT');
	  this.ws_btcusdt.onmessage = (event) => {
	    const { p: btcusdt } = JSON.parse(event.data);
	    // Afin de ne pas appeler le setState trop souvent, on actualise le prix du BTC tout les 20 hits
	    if (!(this.mod_btcusdt % 20) || this.mod_btcusdt === null) {
	      this.mod_btcusdt = 0;
	      this.setState({ btcusdt: Number(Number(btcusdt).toFixed(0)) });
	    }
	    this.mod_btcusdt++;
	  };
	  if (!this.state.wallets) {
			try {
				const res = await Home.requestInitialData();
				const wallets = res.data;
				this.setState({ wallets }, () => {
					for (let i = 0; i < wallets.length; i++) {
						if (this.state.currencyExclude.includes(wallets[i].currency)) continue;
						this.createNewSocket(wallets[i], i);
					}
				});
			} catch (error) {
				console.error('Home.requestInitialData', error);
			}
	  }
	}

	componentDidUpdate = (prevProps, prevState) => {
	  if (prevState.wallets && prevState.wallets.length !== this.state.wallets.length && !this.deleted) {
	    window.scrollTo(0, document.documentElement.scrollHeight);
	  }
	  this.deleted = false;
	}

	componentWillUnmount = () => {
	  this.ws_btcusdt.close();
	  this.state.wallets.forEach((wallet) => {
	    if (!wallet.websocket) console.error(`Impossible to close ${wallet.currency}`);
	    else wallet.websocket.close();
	  });
	  console.log('Sockets closed');
	}

	/**
	* Fonction permettant de calculer le gain total
	*/
	getTotalGain() {
	  const { wallets } = this.state;
	  let totalGain = 0;
	  for (let i = 0; i < wallets.length; i++) {
	    if (!wallets[i]) continue;
	    const { currentValue, buyValue, quantity } = wallets[i];
	    if (!currentValue || !quantity) continue;
	    totalGain += (currentValue - buyValue) * quantity;
	  }
	  return totalGain.toFixed(2);
	}

	/**
	* Fonction permettant de calculer le montant total
	*/
	getTotal() {
	  const { wallets } = this.state;
	  let total = 0;
	  for (let i = 0; i < wallets.length; i++) {
	    if (!wallets[i]) continue;
	    const { currentValue, quantity } = wallets[i];
	    if (!currentValue || !quantity) continue;
	    total += wallets[i].currentValue * wallets[i].quantity;
	  }
	  return total.toFixed(2);
	}


	changeSelectExchange = (e, i) => {
	  if (i < 0) return false;
	  const { wallets } = this.state;
	  // const wallets = [...this.state.wallets];
	  wallets[i].exchange = e.target.value;
	  this.setState({ wallets });
	}

	deleteCrypto = (i) => {
	  if (i < 0) return false;
	  this.deleted = true;
	  const { wallets } = this.state;
	  // const wallets = [...this.state.wallets];
	  this.closeSocket(wallets[i]);
	  // On met le wallet a null
	  wallets[i] = null;
	  this.setState({ wallets });
	}

	save = (i, wallet) => {
	  const { wallets } = this.state;
	  // const wallets = [...this.state.wallets];
	  // On a modifier la monnaie on doit fermer le socket et en recréer un nouveau
	  if (wallets[i].currency !== wallet.currency) {
	    this.closeSocket(wallets[i]);
	    this.createNewSocket(wallet, i);
	  }
	  wallets[i] = wallet;
	  this.setState({ wallets });
	}

	createNewSocket = (wallet, i) => {
	  wallet.websocket = new WebSocket(`wss://stream.binance.com:9443/ws/${wallet.currency.toLowerCase()}btc@aggTrade`);
	  wallet.websocket.homeContext = this;
	  wallet.websocket.onopen = () => console.log(`Connexion à la paire BTC/${wallet.currency} reussi`);
	  wallet.websocket.onerror = () => console.error(`Impossible de trouver la paire à la paire BTC/${wallet.currency}`);
	  wallet.websocket.onmessage = function (event) {
	    const { wallets, btcusdt } = this.homeContext.state;
	    if (btcusdt === null) return;
	    const { p: currentValue } = JSON.parse(event.data);
	    // we can use 'i' because it's declare as 'let'
	    wallets[i].currentValue = Number((Number(currentValue) * btcusdt).toFixed(2));
	    this.homeContext.setState({ wallets });
	  };
	}

	closeSocket = (wallet) => {
	  if (wallet && wallet.websocket) {
	    wallet.websocket.close();
	    console.log(`Socket closed: ${wallet.currency}`);
	  } else console.error('No socket for this currency');
	}

	/**
	* Ajoute une nouvelle crypto
	*/
	handleClickAdd = () => {
	  const { wallets } = this.state;
	  wallets.push({
	    currency     : null,
	    buyValue     : null,
	    currentValue : null,
	    quantity     : null,
	    exchange     : 'binance',
	    img          : null,
	    isEditing    : true,
	  });
	  this.setState({ wallets });
	}

	render() {
	  const { wallets, errorRequest, btcusdt } = this.state;
	  if (!wallets) return <div>Chargement des données...</div>;
	  if (errorRequest != null) return <div>Erreur lors du chargement des données...</div>;
	  return (
			<div id="Home">
				<Fab color="primary" aria-label="Add" id="bt_addProduct" fab="true" onClick={this.handleClickAdd}>
					<AddIcon />
				</Fab>
				<div className="stickyBarInfos">
					<span>BTC: ${btcusdt}</span>
					<span>Gain: ${this.getTotalGain()}</span>
					<span>Total: ${this.getTotal()}</span>
				</div>
				<div className="wallets">
					<ReactTransitionGroup id="walletsTransitionGroup" transitionName="fade" transitionEnterTimeout={600} transitionLeaveTimeout={600}>
						{
							wallets.map((wallet, index) => {
							  if (!wallet) return false;
							  return <CryptoCard key={index} btcusdt={btcusdt} save={this.save} deleteCrypto={this.deleteCrypto} changeSelectExchange={this.changeSelectExchange} wallet={wallet} index={index} />;
							})
						}
					</ReactTransitionGroup>
				</div>
			</div>
	  );
	}
}
Home.propTypes = {
	staticContext : PropTypes.string,
};
Home.defaultProps = {
	staticContext : null,
};
export default Home;
