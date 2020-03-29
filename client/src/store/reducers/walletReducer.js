
const initState = {
	wallets         : [],
	errorRequest    : null,
	btcusdt         : null,
	currencyExclude : ['PART', 'DENT', 'XRB', 'TEL'],
};

const walletReducer = (state = initState, action) => {
	switch (action.type) {
	case 'ADD_WALLET': {
		const { wallets } = state;
		return { ...state, wallets: [...wallets, action.wallet] };
	}
	case 'ADD_WALLET_ERROR': {
		console.error('ADD_WALLET_ERROR', action.error);
		return state;
	}
	case 'SAVE_WALLET': {
		const { index, wallet } = action.payload;
		const { wallets } = state;
		wallets[index] = { ...wallet };
		return { ...state, wallets: [...wallets] };
	}
	case 'DELETE_WALLET': {
		const { index } = action;
		const { wallets } = state;
		wallets[index] = null;
		return { ...state, wallets: [...wallets] };
	}
	case 'CREATE_WALLET_WEBSOCKET': {
		return { ...state };
	}
	case 'INIT_WALLETS': {
		return { ...state, wallets: action.wallets };
	}
	case 'INIT_WALLETS_ERROR': {
		console.error('INIT_WALLETS_ERROR', action.error);
		return state;
	}
	case 'SET_WALLET_FIELD_STATE': {
		return { ...state, ...action.payload };
	}
	default: return state;
	}
};

export default walletReducer;
