import React from 'react';
import PropTypes from 'prop-types';
// Local
import './CryptoCard.css';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';

// import { CSSTransition, TransitionGroup } from 'react-transition-group'
// Components


class CryptoCard extends React.Component {
	constructor(props) {
		super(props);
		this.oldExchange = null;
		this.oldCurrencyValue = null;
		this.oldQuantity = null;
		this.oldCurrency = null;
		this.state = {
			isEditing : this.props.wallet.isEditing || false,
		};
	}

    shouldComponentUpdate = (nextProps, nextState) => {
    	const {
    		currentValue, quantity, currency, exchange,
    	} = nextProps.wallet;
    	const { isEditing } = this.state;
    	if (this.oldCurrencyValue === currentValue
            && this.oldQuantity === quantity
            && this.oldCurrency === currency
            && this.oldExchange === exchange
            && isEditing === nextState.isEditing) return false;

    	this.oldExchange = exchange;
    	this.oldCurrencyValue = currentValue;
    	this.oldQuantity = quantity;
    	this.oldCurrency = currency;
    	return true;
    }

    saveCrypto = () => {
    	const { save, index } = this.props;
    	const wallet = { ...this.props.wallet };
    	let { isEditing } = this.state;
    	isEditing = false;
    	wallet.currency = this.currencyInput.value;
    	wallet.buyValue = Number(this.buyValueInput.value);
    	wallet.quantity = Number(this.quantityInput.value);
    	this.setState({ isEditing }, () => save(index, wallet));
    }

    modifCrypto = () => {
    	let { isEditing } = this.state;
    	isEditing = true;
    	this.setState({ isEditing });
    }

    render() {
    	const {
    		currency, buyValue, currentValue, quantity, exchange, img,
    	} = this.props.wallet;
    	const { changeSelectExchange, deleteCrypto, index } = this.props;
    	if (index > 9) {
    		console.log('index:', index, currency, buyValue, currentValue, quantity, exchange, img);
    	}
    	const { isEditing } = this.state;
    	const totalBuyValue = (buyValue * quantity).toFixed(2);
    	const totalCurrentValue = (currentValue * quantity).toFixed(2);
    	const gain = (totalCurrentValue - totalBuyValue).toFixed(2);
    	const ratio = (totalCurrentValue / totalBuyValue).toFixed(2);
    	const exchangeHeadStyle = `${exchange}HeadStyle`;
    	const exchangeGeneralStyle = `${exchange}GeneralStyle`;
    	return (

    		<div className={`CryptoCard ${exchangeGeneralStyle}`}>
    			{
    				isEditing
    					? (
    						<h1 className={exchangeHeadStyle}>
    							<IconButton onClick={this.saveCrypto} className={exchangeHeadStyle} aria-label="Save">
    								<SaveIcon />
    							</IconButton>
    							<input
    								type="text"
    								defaultValue={currency}
    								ref={(currencyInput) => { this.currencyInput = currencyInput; }}
    								className={`${exchangeGeneralStyle} newInput toUpperCase`}
    								maxLength="5"
    							/>
    							<IconButton onClick={deleteCrypto.bind(null, index)} className={exchangeHeadStyle} aria-label="Delete">
    								<DeleteIcon />
    							</IconButton>
    						</h1>
    					)
    					: (
    						<h1 className={exchangeHeadStyle}>
    							<IconButton onClick={this.modifCrypto} className={exchangeHeadStyle} aria-label="Change">
    								<EditIcon />
    							</IconButton>
    							{currency}
    							<img src={img} alt="Crypto" />
    						</h1>
    					)
    			}
    			{
    				isEditing
    					? (
    						<span>
    							<div>
    								<span>Prix Achat:</span>
    								<span> <input type="number" min="0" defaultValue={buyValue} ref={(buyValueInput) => { this.buyValueInput = buyValueInput; }} className={`${exchangeGeneralStyle} newInput`} /></span>
    							</div>
    							<div>
    								<span>Quantité:</span>
    								<span> <input type="number" min="0" defaultValue={quantity} ref={(quantityInput) => { this.quantityInput = quantityInput; }} className={`${exchangeGeneralStyle} newInput`} /></span>
    							</div>
    							<div>
    								<span>Exchange:</span>
    								<select defaultValue={exchange} className={`${exchangeGeneralStyle} newInput`} onChange={e => changeSelectExchange(e, index)}>
    									<option value="binance">Binance</option>
    									<option value="bittrex">Bittrex</option>
    									<option value="kucoin">Kucoin</option>
    								</select>
    							</div>
    						</span>
    					)
    					: (
    						<span>
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
    								<span>${currentValue ? gain : 0}</span>
    							</div>
    							<div>
    								<span>Exchange:</span>
    								<span> {exchange}</span>
    							</div>
    						</span>
    					)
    			}
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
	save                 : PropTypes.func.isRequired,
	changeSelectExchange : PropTypes.func.isRequired,
	deleteCrypto         : PropTypes.func.isRequired,
	index                : PropTypes.number.isRequired,

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
};
export default CryptoCard;
