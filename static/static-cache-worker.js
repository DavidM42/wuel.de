'use strict';

// pulled from https://github.com/tretapey/svelte-pwa

// only used by subjects pages not by main courses list index.html
// still in this static folder to only be copied once

// Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-files-cache-v1';


// Add list of files to cache here.
const FILES_TO_CACHE = [
    `/icons/favicon.ico`,
    `/main.css`,
    `/icons/favicon-96x96.png`,
    `/icons/favicon-16x16.png`,
    `/external/bootstrap.min.css`,
    `/external/bootstrap-native.min.js`
];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');

    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    // Remove previous cached data from disk.
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );

    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);
    // Add fetch event handler here.
    if (evt.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
    }
    evt.respondWith(
        fetch(evt.request)
            .catch(() => {
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                        return cache.match('index.html');
                    });
            })
    );
});