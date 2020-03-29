import axios from 'axios';

// export const searchCoins = coins => ({ type: 'SEARCH_COINS', coins });
// export const resetSearchCoins = () => ({ type: 'RESET_SEARCH_COINS' });

export const initCoins = () => async (dispatch, getState) => {
	// Make async call to database
	try {
		const { searchReducer } = getState();
		if (searchReducer.coins.length) return;
		const result = await axios.get(`${process.env.REACT_APP_API_HOST}/api/coins`);
		dispatch({ type: 'INIT_COINS', coins: result.data });
	} catch (error) {
		dispatch({ type: 'INIT_COINS_ERROR', error });
	}
};
