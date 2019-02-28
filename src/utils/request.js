import fetch from 'dva/fetch';

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 * options fetch 带cookie跨域访问 {credentials: "include"}
 *
 * err : react 使用fetch跨域报No 'Access-Control-Allow-Origin'
 *      'Access-Control-Allow-Origin': '*',
 */
export default function request(url, options) {
    options = {
        ...options,
        'Access-Control-Allow-Origin': '*',
        credentials: "include"
    }
    return fetch(`http://localhost:3636/${url}`, options)
        .then(checkStatus)
        .then(parseJSON)
        .then(data => ({data}))
        .catch(err => ({err}));
}
