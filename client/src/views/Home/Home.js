import React, { Component } from 'react';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
// import { type } from 'os';
//Local
import './Home.css';
import CryptoCard from '../../components/CryptoCard/CryptoCard';


export default class Home extends Component {

    constructor() {
        super();
        this.limit = 36;
        this.state = {
            wallets: null,
            errorRequest: null,
            btcusdt: null,
            currencyExclude: ['PART']
        };
    }
    componentDidMount() {
        let ws_btcusdt = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@aggTrade');
        ws_btcusdt.onopen = () => console.log("Connexion à la paire BTC/USDT reussi");
        ws_btcusdt.onerror = (e) => {
            console.log(`Impossible de trouver la paire à la paire BTC/USDT`)
        };
        ws_btcusdt.onmessage = (event) => {
            const { p: btcusdt } = JSON.parse(event.data);
            this.setState({ btcusdt: Number(btcusdt).toFixed(0) });
        };
        const wallets = [{
            currency: 'OMG',
            buyValue: 15,
            currentValue: null,
            quantity: 40,
            exchange: "binance"
        }, {
            currency: 'NEO',
            buyValue: 70,
            currentValue: null,
            quantity: 3.65,
            exchange: "bittrex"
        }, {
            currency: 'ADA',
            buyValue: 0.4,
            currentValue: null,
            quantity: 202,
            exchange: "binance"
        }, {
            currency: 'ETC',
            buyValue: 35,
            currentValue: null,
            quantity: 11.3,
            exchange: "binance"
        }, {
            currency: 'PART',
            buyValue: 10.59,
            currentValue: 25.70,
            quantity: 9.5,
            exchange: "bittrex"
        }, {
            currency: 'XVG',
            buyValue: 0.2,
            currentValue: null,
            quantity: 130,
            exchange: "kucoin"
        }, {
            currency: 'ENG',
            buyValue: 6.85,
            currentValue: null,
            quantity: 7.82,
            exchange: "binance"
        }];
        this.setState({ wallets });
        for (let i = 0; i < wallets.length; i++) {
            if (this.state.currencyExclude.includes(wallets[i].currency)) continue;
            wallets[i].websocket = new WebSocket(`wss://stream.binance.com:9443/ws/${wallets[i].currency.toLowerCase()}btc@aggTrade`)
            wallets[i].websocket.indexWebSocket = i;
            wallets[i].websocket.homeContext = this;
            wallets[i].websocket.onopen = (e) => {
                console.log(`Connexion à la paire BTC/${wallets[i].currency} reussi`)
            };
            wallets[i].websocket.onerror = (e) => {
                console.log(`Impossible de trouver la paire à la paire BTC/${wallets[i].currency}`)
            };
            wallets[i].websocket.onmessage = function (event) {
                const { wallets, btcusdt } = this.homeContext.state;
                if (btcusdt === null) return;
                const { p: currentValue } = JSON.parse(event.data);
                wallets[this.indexWebSocket].currentValue = (Number(currentValue) * btcusdt).toFixed(2);
                this.homeContext.setState({ wallets });
            }
        }
    }
    render() {
        const { wallets, errorRequest, btcusdt } = this.state;
        if (!wallets) return <div>Chargement des données...</div>;
        if (errorRequest != null) return <div>Erreur lors du chargement des données...</div>;
        return (
            <div id="Home">
                <div className="stickyBarInfos">
                    <span>BTC: ${btcusdt}</span>
                    <span>{this.getTotalGain()}</span>
                    <span>{this.getTotal()}</span>
                </div>
                <div className="wallets">
                    {wallets.map((wallet, index) => <CryptoCard btcusdt={btcusdt} wallet={wallet} key={index} index={index} />)}
                </div>
                <Button onClick={this.addCrypto} id="bt_addProduct" fab color="primary" aria-label="add" >
                    <AddIcon />
                </Button>
            </div>
        )
    }
    getTotalGain = () => {
        const { wallets } = this.state;
        let totalGain = 0;
        for (let i = 0; i < wallets.length; i++) {
            const { currentValue, buyValue, quantity } = wallets[i];
            totalGain += (currentValue - buyValue) * quantity;
        }
        return `Gain $${totalGain.toFixed(2)}`;
    }
    getTotal = () => {
        const { wallets } = this.state;
        let total = 0;
        for (let i = 0; i < wallets.length; i++) total += wallets[i].currentValue * wallets[i].quantity;
        return `Total $${total.toFixed(2)}`;
    }
    addCrypto = (e) => {
        console.log(e.target);
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