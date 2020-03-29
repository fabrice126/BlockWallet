export const searchMiddleWare = store => next => (action) => {
	// console.log(store, next, action);
	// console.log('searchMiddleWare triggered:', action);
	next(action);
};
