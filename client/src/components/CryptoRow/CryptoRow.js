import React, { Component } from 'react';
//Local
import './CryptoRow.css'
//Components


export default class CryptoRow extends Component {
    render() {
        // console.log(this.props);
        const { currency, buyValue, currentValue, quantity } = this.props.wallet;
        let totalBuyValue = (buyValue * quantity).toFixed(2);
        let totalCurrentValue = (currentValue * quantity).toFixed(2);
        let gain = (totalCurrentValue - totalBuyValue).toFixed(2);
        let ratio = (totalCurrentValue / totalBuyValue).toFixed(2);
        return (
            <tbody className="CryptoRow">
                <tr>
                    <td rowSpan="3">{currency}</td>
                    <td>{buyValue} $</td>
                    <td>{currentValue} $</td>
                    <td rowSpan="3">{quantity}</td>
                    <td rowSpan="3">{gain} $</td>
                </tr>
                <tr>
                    <td>{totalBuyValue} $</td>
                    <td>{totalCurrentValue} $</td>
                </tr>
                <tr>
                    <td colSpan="2">{ratio}</td>
                </tr>
            </tbody>
        )
    }
}