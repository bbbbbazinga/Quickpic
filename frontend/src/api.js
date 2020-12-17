/**
 * Make a request to `path` with `options` and parse the response as JSON.
 * @param {*} path The url to make the reques to.
 * @param {*} options Additiona options to pass to fetch.
 */

// 2.1.3 Error popup
function handleResponseError(res) {
    return res.json()
        .then(json => {
            if (res.ok) {
                return json
            } else {
                let error = Object.assign({}, json, {
                    status: res.status,
                    statusText: res.statusText
                });
                return Promise.reject(error)
            }
        })
};

const getJSON = (path, options) =>
    fetch(path, options)
        .then(res => handleResponseError(res))
        .catch(err => {
            alert(JSON.stringify(err['message']));
            console.log(err);
        });

/**
 * This is a sample class API which you may base your code on.
 * You may use this as a launch pad but do not have to.
 */
export default class API {
    /** @param {String} url */
    constructor(url) {
        this.url = url;
    }

    // /** @param {String} path */
    // makeAPIRequest(path) {
    //     return getJSON(`${this.url}/${path}`);
    // }

    post(path, options) {
        return getJSON(`${this.url}/${path}`, {
            ...options,
            method: "POST",
        })
    }

    put(path, options) {
        return getJSON(`${this.url}/${path}`, {
            ...options,
            method: "PUT",
        })
    }

    delete(path, options) {
        return getJSON(`${this.url}/${path}`, {
            ...options,
            method: "DELETE",
        })
    }

    get(path, options) {
        return getJSON(`${this.url}/${path}`, {
            ...options,
            method: "GET",
        })
    }
};


