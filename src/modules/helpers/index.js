export function extend(obj, src) {
    for (let key in src) {
        if (Object.prototype.hasOwnProperty.call(src, key)) obj[key] = src[key];
    }
    return obj;
}

export function parseJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return '';
    }
}

export function localStorageExists() {
    try {
        localStorage.setItem('instagram-grid-data-test', 1);
        localStorage.removeItem('instagram-grid-data-test');
        return true;
    } catch (e) {
        return false;
    }
}

export function extractData(document) {
    try {
        let data = null;
        for (let script of document.scripts) {
            if (script.text.indexOf('window._sharedData = ') === 0) {
                data = script.text.replace('window._sharedData = ', '');
                data = data.substring(0, data.length - 1);
            }
        }
        
        return parseJSON(data).entry_data.ProfilePage[0].graphql;
    } catch (e) {
        console.log(e.message);
        return null;  
    }
}