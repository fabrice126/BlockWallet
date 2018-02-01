import React, { Component } from 'react';
//Local
import './Home.css';
import CryptoCard from '../../components/CryptoCard/CryptoCard';
// import Modal from '../../components/Modal/Modal';
import MyCoinsWallet from './MyCoins.wallet.json';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';

export default class Home extends Component {

    constructor() {
        super();
        this.ws_btcusdt = null
        //Lorsque nous ajoutons une crypto alors nous devons scroller vers cette nouvelle case (componentDidUpdate)
        this.deleted = false;
        this.mod_btcusdt = null;
        this.state = {
            wallets: null,
            errorRequest: null,
            btcusdt: null,
            currencyExclude: ['PART', 'DENT', 'XRB', 'TEL']
        };
    }
    componentWillUnmount = () => {
        this.ws_btcusdt.close()
        this.state.wallets.forEach(wallet => {
            if (!wallet.websocket) console.error(`Impossible to close ${wallet.currency}`);
            else wallet.websocket.close();
        });
        console.log("Sockets closed");
    }
    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.wallets && prevState.wallets.length !== this.state.wallets.length && !this.deleted)
            window.scrollTo(0, document.documentElement.scrollHeight);
        this.deleted = false;
    }
    componentDidMount() {
        this.ws_btcusdt = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@aggTrade');
        this.ws_btcusdt.onopen = () => console.log("Connexion à la paire BTC/USDT reussi");
        this.ws_btcusdt.onerror = (e) => console.error(`Impossible de trouver la paire à la paire BTC/USDT`);
        this.ws_btcusdt.onmessage = (event) => {
            let { p: btcusdt } = JSON.parse(event.data);
            if (!(this.mod_btcusdt % 20) || this.mod_btcusdt === null) {
                this.mod_btcusdt = 0;
                this.setState({ btcusdt: Number(Number(btcusdt).toFixed(0)) });
            }
            this.mod_btcusdt++;
        };
        //Ajax request to load currentPrice of currencies in wallets
        const wallets = MyCoinsWallet;
        this.setState({ wallets }, () => {
            for (let i = 0; i < wallets.length; i++) {
                if (this.state.currencyExclude.includes(wallets[i].currency)) continue;
                this.createNewSocket(wallets[i], i);
            }
        });
    }
    render() {
        const { wallets, errorRequest, btcusdt } = this.state;
        if (!wallets) return <div>Chargement des données...</div>;
        if (errorRequest != null) return <div>Erreur lors du chargement des données...</div>;
        return (
            <div id="Home" >
                <Button onClick={this.handleClickAdd} id="bt_addProduct" fab color="primary" aria-label="add" >
                    <AddIcon />
                </Button>
                <div className="stickyBarInfos">
                    <span>BTC: ${btcusdt}</span>
                    <span>Gain: ${this.getTotalGain()}</span>
                    <span>Total: ${this.getTotal()}</span>
                </div>
                <div className="wallets">
                    {
                        wallets.map((wallet, index) => {
                            if (!wallet) return false;
                            return <CryptoCard btcusdt={btcusdt} save={this.save} deleteCrypto={this.deleteCrypto} changeSelectExchange={this.changeSelectExchange} wallet={wallet} key={index} index={index} />
                        })
                    }
                </div>
            </div>
        )
    }
    getTotalGain = () => {
        const { wallets } = this.state;
        let totalGain = 0;
        for (let i = 0; i < wallets.length; i++) {
            if (!wallets[i]) continue;
            const { currentValue, buyValue, quantity } = wallets[i];
            if (currentValue && quantity) totalGain += (currentValue - buyValue) * quantity;
        }
        return totalGain.toFixed(2);
    }
    getTotal = () => {
        const { wallets } = this.state;
        let total = 0;
        for (let i = 0; i < wallets.length; i++) {
            if (!wallets[i]) continue;
            const { currentValue, quantity } = wallets[i];
            if (currentValue && quantity) total += wallets[i].currentValue * wallets[i].quantity;
        }
        return total.toFixed(2);
    }

    handleClickAdd = () => {
        const wallets = [...this.state.wallets];
        wallets.push({
            "currency": null,
            "buyValue": null,
            "currentValue": null,
            "quantity": null,
            "exchange": "binance",
            "img": null,
            "isEditing": true
        })
        this.setState({ wallets });
    }

    changeSelectExchange = (e, i) => {
        if (i < 0) return false;
        const wallets = [...this.state.wallets];
        wallets[i].exchange = e.target.value;
        this.setState({ wallets });
    }
    deleteCrypto = (i) => {
        if (i < 0) return false;
        this.deleted = true;
        const wallets = [...this.state.wallets];
        this.closeSocket(wallets[i]);
        wallets[i] = null;
        this.setState({ wallets });
    }
    save = (i, wallet) => {
        const wallets = [...this.state.wallets];
        //On a modifier la monnaie on doit fermer le socket et en recréer un nouveau
        if (wallets[i].currency !== wallet.currency) {
            this.closeSocket(wallets[i]);
            this.createNewSocket(wallet, i);
        }
        wallets[i] = wallet;
        this.setState({ wallets });
    }

    createNewSocket = (wallet, i) => {
        setTimeout(() => {
            wallet.websocket = new WebSocket(`wss://stream.binance.com:9443/ws/${wallet.currency.toLowerCase()}btc@aggTrade`)
            wallet.websocket.homeContext = this;
            wallet.websocket.onopen = (e) => console.log(`Connexion à la paire BTC/${wallet.currency} reussi`);
            wallet.websocket.onerror = (e) => console.error(`Impossible de trouver la paire à la paire BTC/${wallet.currency}`);
            wallet.websocket.onmessage = function (event) {
                const { wallets, btcusdt } = this.homeContext.state;
                if (btcusdt === null) return;
                const { p: currentValue } = JSON.parse(event.data);
                //copy object
                const walletsCopy = [...wallets];
                //we can use 'i' because it's declare as 'let'
                walletsCopy[i].currentValue = Number((Number(currentValue) * btcusdt).toFixed(2));
                this.homeContext.setState({ wallets: walletsCopy });
            }
        }, 2000)
    }
    closeSocket = (wallet) => {
        if (wallet.websocket) {
            wallet.websocket.close();
            console.log(`Socket closed: ${wallet.currency}`);
        }
        else if (wallet.websocket) console.error(`Impossible to close ${wallet.currency}`);
        else console.error(`No socket for this currency`);
    }
}





        // fetch(`${process.env.REACT_APP_API_HOST}/api/binance/btc`).then((response) => {
        //     return response.json();
        // }).then((data) => {
        // if (!data) throw new Error("Error");
        // let currencies = [];
        // // let btcusdt;
        // for (let i = 0; i < data.length; i++) {
        //     // if (data[i].symbol === "BTCUSDT") btcusdt = data[i].close
        //     currencies.push(data[i].baseAsset)
        // }
        // for (let i = 0; i < wallets.length; i++) {
        //     if (currencyExclude.includes(wallets[i].currency)) continue;
        //     const idx = currencies.indexOf(wallets[i].currency);
        //     wallets[i].currentValue = data[idx].close
        // }
        // this.setState({ wallets })
        // }).catch((err) => {
        //     this.setState({ errorRequest: err });
        //     console.log(`err fetch home page => ${err}`)
        // });