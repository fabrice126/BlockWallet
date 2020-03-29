/**
 * Allow user to search coins
 * @param {String} search
 * @param {Array} coins
 * @returns {Array} of sorted coins matching with 'search' param
 */
export function searchCoinsService(search = '', coins = []) {
	if (!search) return [];
	const newSearch = search.toLowerCase();
	const foundCoins = coins.filter((coin) => {
		const { symbol, name } = coin;
		if (!name || !name) return false;
		return symbol.toLowerCase().startsWith(newSearch) || name.toLowerCase().startsWith(newSearch);
	});
	let sortedFoundCoin = foundCoins.sort((coinA, coinB) => coinA.rank - coinB.rank);
	sortedFoundCoin = sortedFoundCoin.slice(0, 6);
	return sortedFoundCoin;
}
