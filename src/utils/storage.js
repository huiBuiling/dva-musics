
const getUrlFix = 'http://localhost:3000';
const storage = window.localStorage;

const getItem = (key) => {
    return storage.getItem(key);
}

const setItem = (key, value) => {
    return storage.setItem(key, JSON.stringify(value));
}

export {
    getUrlFix,
    getItem,
    setItem,
}