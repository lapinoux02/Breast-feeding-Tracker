const sw = 'bf-tracker-1.0.0'
const assets = [
	'/index.html',
	'https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.2/vue.js',
	'/app.js',
	'/app.css',
	'/assets/baby.svg',
	'/assets/cross.svg',
	'/assets/hamburger-menu.svg',
	'/assets/biberon.svg',
	'/assets/breastfeedingLeft.png',
	'/assets/breastfeedingRight.png',
	'/assets/breastRight.png',
	'/assets/breastLeft.png',
	'/assets/babyBottle.png',
	'/assets/empty.png',
	'/icofont/fonts/icofont.eot',
	'/icofont/fonts/icofont.svg',
	'/icofont/fonts/icofont.ttf',
	'/icofont/fonts/icofont.woff',
	'/icofont/fonts/icofont.woff2',
	'/icofont/icofont.css',
	'/icofont/icofont.min.css',
	'/components/datetimePicker/datetimePicker.css',
	'/components/datetimePicker/datetimePicker.js',
	'/components/entryEditorModal/entryEditorModal.css',
	'/components/entryEditorModal/entryEditorModal.js'
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