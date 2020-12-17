export function putInfo(api, putURL, token) {
    console.log(putURL);
    api.put(putURL, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        }
    }).then(
        res => console.log(res)
    ).catch(err => console.warn(`API_ERROR: ${err.message}`));
};

export function followUser(api, follow, uname, token) {
    const followPath = 'user/' + follow + '?username=' + uname;
    putInfo(api, followPath, token);
};
