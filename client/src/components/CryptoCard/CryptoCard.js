import React, { Component } from 'react';
//Local
import './CryptoCard.css'
//Components


export default class CryptoCard extends Component {
    render() {
        const { currency, buyValue, currentValue, quantity, exchange } = this.props.wallet;
        let totalBuyValue = (buyValue * quantity).toFixed(2);
        let totalCurrentValue = (currentValue * quantity).toFixed(2);
        let gain = (totalCurrentValue - totalBuyValue).toFixed(2);
        let ratio = (totalCurrentValue / totalBuyValue).toFixed(2);
        const exchangeHeadStyle = exchange + "HeadStyle";
        const exchangeGeneralStyle = exchange + "GeneralStyle";
        return (
            <div className={`CryptoCard ${exchangeGeneralStyle}`}>
                <h1 className={exchangeHeadStyle}>{currency}</h1>
                <div>
                    <span>Prix Achat:</span>
                    <span> ${buyValue}</span>
                </div>
                <div>
                    <span>Prix Courant:</span>
                    <span>${currentValue}</span>
                </div>
                <div>
                    <span>Total Achat:</span>
                    <span>${totalBuyValue}</span>
                </div>
                <div>
                    <span>Total Courant:</span>
                    <span>${totalCurrentValue}</span>
                </div>
                <div>
                    <span>Quantité:</span>
                    <span>{quantity}</span>
                </div>
                <div>
                    <span>Ratio:</span>
                    <span>{ratio}</span>
                </div>
                <div>
                    <span>Gain:</span>
                    <span>${gain}</span>
                </div>
            </div>
        )
    }
}