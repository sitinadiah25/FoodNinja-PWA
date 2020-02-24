//service worker : can add things to cache so it works offline 

//update version every time changes are made in static files
const staticCacheName = 'site-static-v2';
const assets = [
    '/',
    'index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css', 
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v50/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
];

//install service worker (only runs if service worker file is changed)
self.addEventListener('install', evt => {
    // console.log('service worker has been installed');
    // wait until makes sure install is still running while caches are being loaded
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    )
});

//activate event
self.addEventListener('activate', evt => {
    // console.log('service worker has been activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            // console.log(keys);
            //if all promises (keys) is resolved, then promise.all will resolve too
            //keys is an array of promises
            return Promise.all(keys
                .filter(key => key !== staticCacheName) // caches want to be deleted stays in array 
                .map(key => caches.delete(key)) // delete all the filtered caches
            )
        })
    );
});

//fetch event 
self.addEventListener('fetch', evt => {
    // console.log('fetch event', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        })
    );
});