import { createEachFeed } from './eachFeed.js';

export function onceFeed(api, p, n, token, myInfo, postsList) {
    api.get("user/feed" + "?p=" + p + "&n=" + n, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
        }
    }).then(
        res => {
            if (res['posts']) {
                for (let item in res['posts']) {
                    createEachFeed(api, postsList, res['posts'][item], token, myInfo, false);
                };
            };
        }
    ).catch(err => console.warn(`API_ERROR: ${err.message}`));

};

// 2.2.1 Basic feed
export function basicFeed(api, token, myInfo, n, p) {
    // console.log(token);
    if (token) {
        // document.getElementById('notImplement').style.display = "none";
        document.getElementById('UserpageTitle').style.display = "none";
        document.getElementById('topSearch').style.display = "block";
        document.getElementById('selfInfo').style.display = "none";
        document.getElementById('newPost').style.display = "block";
        const postsList = document.getElementById('postsList');
        postsList.innerHTML = "";
        onceFeed(api, p, n, token, myInfo, postsList);
    };
};
