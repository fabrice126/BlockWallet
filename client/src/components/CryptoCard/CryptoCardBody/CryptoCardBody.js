// Node_modules
import React from 'react';
import PropTypes from 'prop-types';


function CryptoCardBody(props) {
	const {
		buyValue, currentValue, quantity, exchange,
	} = props.wallet;
	const { onInputChange, onChangeSelectExchange, isEditing } = props;
	const totalBuyValue = (buyValue * quantity).toFixed(2);
	const totalCurrentValue = (currentValue * quantity).toFixed(2);
	const gain = (totalCurrentValue - totalBuyValue).toFixed(2);
	const ratio = (totalCurrentValue / totalBuyValue).toFixed(2);
	const exchangeGeneralStyle = `CryptoCardBody__${exchange}-general-style`;
	return (
		<div className="CryptoCardBody">
			{isEditing ? (
				<React.Fragment>
					<div>
						<span>Prix Achat:</span>
						<span>
							{' '}
							<input
								type="number"
								min="0"
								defaultValue={buyValue}
								name="buyValueInput"
								onChange={onInputChange}
								className={`${exchangeGeneralStyle} CryptoCardBody__new-input-number`}
								aria-label="buyValueLabel"
							/>
						</span>
					</div>
					<div>
						<span>Quantité:</span>
						<span>
							{' '}
							<input
								type="number"
								min="0"
								defaultValue={quantity}
								name="quantityInput"
								onChange={onInputChange}
								className={`${exchangeGeneralStyle} CryptoCardBody__new-input-number`}
								aria-label="quantityInputLabel"
							/>
						</span>
					</div>
					<div>
						<span>Exchange:</span>
						<select defaultValue={exchange} className={`${exchangeGeneralStyle} CryptoCardBody__new-input`} onChange={onChangeSelectExchange}>
							<option value="binance">Binance</option>
							<option value="bittrex">Bittrex</option>
							<option value="kucoin">Kucoin</option>
						</select>
					</div>
				</React.Fragment>
			) : (
				<React.Fragment>
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
				</React.Fragment>
			)}
		</div>
	);
}
CryptoCardBody.propTypes = {
	onChangeSelectExchange : PropTypes.func.isRequired,
	onInputChange          : PropTypes.func.isRequired,
	isEditing              : PropTypes.bool,
	wallet                 : PropTypes.shape({
		buyValue     : PropTypes.number,
		currentValue : PropTypes.number,
		quantity     : PropTypes.number,
		exchange     : PropTypes.string,
		currency     : PropTypes.string,
		img          : PropTypes.string,
	}),
};
CryptoCardBody.defaultProps = {
	isEditing : false,
	wallet    : {
		buyValue     : 0,
		currentValue : 0,
		quantity     : 0,
		exchange     : '',
		currency     : '',
		img          : '',
	},
};
export default CryptoCardBody;
