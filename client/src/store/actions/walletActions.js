import axios from 'axios';

export const addWallet = wallet => ({ type: 'ADD_WALLET', wallet });
export const deleteWallet = index => ({ type: 'DELETE_WALLET', index });
export const editWallet = wallet => ({ type: 'EDIT_WALLET', wallet });
export const saveWallet = (wallet, index) => ({ type: 'SAVE_WALLET', payload: { wallet, index } });
export const setWalletFieldState = payload => ({ type: 'SET_WALLET_FIELD_STATE', payload });
export const createWalletWebSocket = (wallet, index) => ({ type: 'CREATE_WALLET_WEBSOCKET', payload: { wallet, index } });

export const initWallets = () => async (dispatch, getState) => {
	// Make async call to database
	try {
		const { walletReducer } = getState();
		if (walletReducer.wallets.length) return;
		const result = await axios.get(`${process.env.REACT_APP_API_HOST}/api/wallet`);
		dispatch({ type: 'INIT_WALLETS', wallets: result.data });
	} catch (error) {
		dispatch({ type: 'INIT_WALLETS_ERROR', error });
	}
};
