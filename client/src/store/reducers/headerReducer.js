
const initState = {
	menuVisible : false,
};
export default (state = initState, action) => {
	switch (action.type) {
	case 'HEADER_CLOSE_MENU': {
		return { ...state, menuVisible: false };
	}
	case 'HEADER_TOGGLE_MENU': {
		const { menuVisible } = state;
		return { ...state, menuVisible: !menuVisible };
	}
	default:
		return state;
	}
};
