
const initState = {
	message : '',
};
export default (state = initState, action) => {
	switch (action.type) {
	case 'SIGN_UP': {
		return { message: 'SIGN_UP' };
	}
	case 'SIGN_IN': {
		return { message: 'SIGN_IN' };
	}
	case 'SIGN_OUT': {
		return { message: 'SIGN_OUT' };
	}
	default:
		return state;
	}
};
