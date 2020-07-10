import { extend, parseJSON, localStorageExists } from '../helpers';

export default (uri, options) => {
    let supportsLocalStorage = localStorageExists();

    // default options that can be extended.
    let store = extend(
        {
            uri: uri,
            expiry: 60 * 60, // 1 hour
            request: {},
        },
        options || {},
    );

    let id = store.uri.split('/').pop();

    // non extendable properties and methods
    store = extend(store, {
        data: null,
        loading: false,
        fetch: fetch,
        cacheDataKey: 'instagrid:' + id,
        cacheTimeKey: 'instagrid:' + id + ':ts',
    });

    function fetch() {
        var cache;

        startRequest();

        cache = getCache();

        return cache === null
            ? m
                .request(extend({
                    url: store.uri,
                    method: 'GET',
                }, store.request))
                .then(setCache)
                .then(storeResult)
            : Promise.resolve(cache);
    }

    function startRequest() {
        store.loading = true;
        m.redraw();
    }

    function getCache() {
        if (!supportsLocalStorage) return null;

        var cacheResponse = null,
            cacheAge = 0,
            cacheData = localStorage.getItem(store.cacheDataKey),
            cacheTime = localStorage.getItem(store.cacheTimeKey);

        if (cacheData !== null && cacheTime !== null) {
            // Data is in sessionStorage
            cacheResponse = parseJSON(cacheData);
            cacheAge = (Date.now() - cacheTime) / 1000;
            if (cacheAge < store.expiry && cacheResponse !== '') {
                // cache hit, return data as a promise
                storeResult(cacheResponse);
                return cacheResponse;
            } else {
                // clean up the old key's they are expired.
                localStorage.removeItem(store.cacheDataKey);
                localStorage.removeItem(store.cacheTimeKey);
            }
        }

        return null;
    }

    function setCache(data) {
        if (!supportsLocalStorage) return data;
        localStorage.setItem(store.cacheDataKey, JSON.stringify(data));
        localStorage.setItem(store.cacheTimeKey, Date.now());
        return data;
    }

    function storeResult(data) {
        store.data = data;
        store.loading = false;
        return store.data;
    }

    return store;
};
