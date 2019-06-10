// const staticCacheName = 'site-static-3';
const dynamicCache = 'site-dynamic-v2';

// Install service worker
self.addEventListener('install', (e) => {
	// console.log('service worker has been install', e);
	// e.waitUntil(
	// 	caches.open(staticCacheName).then((cache) => {
	// 		console.log('Caching assets');
	// 		cache.addAll(assets);
	// 	}),
	// );
});
// Activate service worker
self.addEventListener('activate', (e) => {
	//   console.log("service worker has been activate", e);
	// e.waitUntil(
	// 	caches.keys().then((keys) => {
	// 		const tDeleteKeys = [];
	// 		keys.forEach((key) => {
	// 			if (key !== staticCacheName && key !== dynamicCache) tDeleteKeys.push(caches.delete(key));
	// 		});
	// 		return Promise.all(tDeleteKeys);
	// 	}),
	// );
});

// Fetch service worker -> listen for all fetch request from html(css/js/img etc). and from JS (XHR)
self.addEventListener('fetch', (e) => {
	//   console.log("service worker fetch request =>", e.request.url);
	e.respondWith(
		(async () => {
			// Si le cache de cette requete existe, on retourne le cache
			// console.log('FRTCH => ', e.request);
			const cacheRes = await caches.match(e.request);
			if (cacheRes) return cacheRes;
			// Sinon on envoie la requete
			try {
				const fetchRes = await fetch(e.request);
				const cache = await caches.open(dynamicCache);
				// Si la requete est faite par des extensions chrome ou autre
				if (!(e.request.url.indexOf('http') === 0)) return fetchRes;
				// On Ajoute la réponse au cache
				cache.put(e.request.url, fetchRes.clone());
				// limitCacheSize(dynamicCache, 50);
				return fetchRes;
			} catch (error) {
				console.error('fetch error = ', error);
				return caches.match('/pages/fallback.html');
			}
		})(),
	);
});
