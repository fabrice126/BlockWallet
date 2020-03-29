
const initState = {
	coins : [],
};

const searchReducer = (state = initState, action) => {
	switch (action.type) {
	case 'INIT_COINS': {
		return { ...state, coins: action.coins };
	}
	case 'INIT_COINS_ERROR': {
		console.error(action.error);
		return state;
	}
	// case 'SEARCH_COINS': {
	// 	return { ...state, searchCoins: action.coins };
	// }
	// case 'RESET_SEARCH_COINS': {
	// 	return { ...state, searchCoins: [] };
	// }
	default: return state;
	}
};

export default searchReducer;
