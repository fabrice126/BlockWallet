// Node_modules
import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';

class CryptoCardHeader extends React.PureComponent {
	render() {
		const {
			onSave, onEdit, onDelete, onInputChange, isEditing, exchange, currency, img,
		} = this.props;
		const exchangeHeadStyle = `CryptoCardHeader__${exchange}-head-style`;
		const exchangeGeneralStyle = `CryptoCardHeader__${exchange}-general-style`;
		return (
			<h1 className={`CryptoCardHeader ${exchangeHeadStyle}`}>
				{isEditing ? (
					<React.Fragment>
						<form className="CryptoCardHeader__form" onSubmit={onSave}>
							<IconButton type="submit" className={exchangeHeadStyle} aria-label="Save">
								<SaveIcon />
							</IconButton>

							<input
								type="text"
								defaultValue={currency}
								onChange={onInputChange}
								name="currencyInput"
								className={`${exchangeGeneralStyle} CryptoCardHeader__new-input CryptoCardHeader--to-upper-case`}
								minLength="1"
								maxLength="5"
								placeholder="ETH"
								aria-label="currencyNameLabel"
								autoComplete="off"
								required
							/>
							<IconButton onClick={onDelete} className={exchangeHeadStyle} aria-label="Delete">
								<DeleteIcon />
							</IconButton>
						</form>
					</React.Fragment>
				) : (
					<React.Fragment>
						<IconButton onClick={onEdit} className={exchangeHeadStyle} aria-label="Change">
							<EditIcon />
						</IconButton>
						{currency}
						<img className="CryptoCardHeader__logo-crypto" src={img} alt="Crypto" />
					</React.Fragment>
				)}
			</h1>
		);
	}
}
CryptoCardHeader.propTypes = {
	onSave        : PropTypes.func.isRequired,
	onEdit        : PropTypes.func.isRequired,
	onDelete      : PropTypes.func.isRequired,
	onInputChange : PropTypes.func.isRequired,
	isEditing     : PropTypes.bool.isRequired,
	exchange      : PropTypes.string.isRequired,
	currency      : PropTypes.string.isRequired,
	img           : PropTypes.string.isRequired,
};
export default CryptoCardHeader;
