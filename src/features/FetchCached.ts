import { createFetchWithAuth } from "./FetchWithAuth";

export function createFetchCached(logout: () => void) {
    const fetch = createFetchWithAuth(logout);

    return async function fetchCached(url: string, init = {}, refreshCache = true) {
        const request = new Request(url, init);
        return caches.match(request).then((response) => {
            if (response !== undefined && response.status === 200 && refreshCache) {
                return response;
            } else {
                return fetch(request)
                    .then((response) => {
                        let responseClone = response.clone();
                        caches.open("v1").then((cache) => {
                            cache.put(request, responseClone);
                        });
                        return response;
                    });
            }
        });
    }
}