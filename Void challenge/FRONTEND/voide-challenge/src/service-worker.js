/* eslint-disable no-restricted-globals */

self.addEventListener('fetch', event => {
    if (event.request.method === 'POST') {
        if (navigator.onLine) {
            // If online, send the request normally
            event.respondWith(fetch(event.request));
        } else {
            // If offline, handle the request here
            console.log('POST request intercepted while offline:', event.request);
            // You can customize this logic to store requests locally and synchronize them with the server later
        }
    }
});
