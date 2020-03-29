export const walletMiddleware = store => next => (action) => {
	// console.log(store, next, action);
	// console.log('walletMiddleWare triggered:', action);
	next(action);
};
