const sw = 'bf-tracker-1.0.0'
const assets = [
	'/index.html',
	'https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.2/vue.js',
	'/app.js',
	'/app.css',
	'/assets/baby.svg',
	'/assets/cross.svg',
	'/assets/hamburger-menu.svg'
];

self.addEventListener('install', installEvent => {
	self.skipWaiting();
	installEvent.waitUntil(
		caches.open(sw).then(cache => {
			cache.addAll(assets);
		})
	);
});

self.addEventListener("fetch", fetchEvent => {
	fetchEvent.respondWith(
		caches.match(fetchEvent.request).then(res => {
			return res || fetch(fetchEvent.request);
		})
	);
});