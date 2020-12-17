import { getPersonalPage } from './profileView.js';
import { putInfo } from './follow.js';

function formTime(time) {
    const fromDate = new Date(1970);
    fromDate.setSeconds(time);
    return fromDate.toString().substring(0, 25);
};

// 2.6.1. Live Update ----Start
function reGetPost(api, id, token, liker, likesNum) {
    const getURL = "post?id=" + id;
    console.log(getURL);
    api.get(getURL, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        }
    }).then(
        res => {
            console.log(res);
            const likes = res['meta']['likes'];
            console.log(likes);
            liker.innerHTML = "";
            for (let likeID in likes) {
                const b = document.createElement('b');
                const getURL = 'user' + "?id=" + likes[likeID];
                api.get(getURL, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    }
                }).then(
                    res => {
                        b.innerHTML = res['username'];
                    }
                ).catch(err => console.warn(`API_ERROR: ${err.message}`));
                liker.appendChild(b);
            }
            likesNum.innerHTML = likes.length + " Likes";
        }).catch(err => console.warn(`API_ERROR: ${err.message}`));
};

function newComment(api, id, token, commentator, commentsNum) {
    const getURL = "post?id=" + id;
    api.get(getURL, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        }
    }).then(
        res => {
            console.log(res);
            const comments = res['comments'];
            console.log(comments);
            commentator.innerHTML = "";
            for (let c in comments) {
                const li = document.createElement('li');
                const commentTop = document.createElement('div');
                commentTop.setAttribute('class', 'commentTop');
                const authorSpan = document.createElement('b');
                const dateSpan = document.createElement('i');
                authorSpan.innerHTML = comments[c]['author'];

                dateSpan.innerHTML = formTime(comments[c]['published']);
                commentTop.appendChild(authorSpan);
                commentTop.appendChild(dateSpan);
                li.appendChild(commentTop);
                const commentText = document.createElement('div');
                commentText.setAttribute('class', 'commentText');
                commentText.innerHTML = comments[c]['comment'];
                li.appendChild(commentText);
                commentator.appendChild(li);
            };
            commentsNum.innerHTML = comments.length + " Comments";
        }).catch(err => console.warn(`API_ERROR: ${err.message}`));

};
// 2.6.1. Live Update ----End

export function createEachFeed(api, content, postsItem, token, myInfo, flag) {
    const postID = postsItem['id'];
    console.log(postID);
    const author = postsItem['meta'].author;
    const time = postsItem['meta'].published;
    const datePost = formTime(time);
    const description_text = postsItem['meta'].description_text;
    const likes = postsItem['meta'].likes;

    const comments = postsItem['comments'];
    const src = `data:imaga/png;base64, ${postsItem['thumbnail']}`;

    let flagLike = false;
    let flagComment = false;

    const eachFeed = document.createElement('div');
    eachFeed.setAttribute('class', 'eachFeed');
    const top = document.createElement('div');
    top.setAttribute('class', 'topFeed');
    const authorName = document.createElement('span');
    authorName.setAttribute('class', 'NameBTN');
    authorName.innerHTML = author;
    top.appendChild(authorName);
    const postDate = document.createElement('span');
    postDate.setAttribute('class', 'postDate');
    postDate.innerHTML = datePost;
    top.appendChild(postDate);
    eachFeed.appendChild(top);

    const pic = document.createElement('div');
    const img = document.createElement('img');
    img.setAttribute('src', src);
    pic.setAttribute('class', 'pictures');
    pic.appendChild(img);
    eachFeed.appendChild(pic);

    const description = document.createElement('div');
    description.setAttribute('class', 'description');
    const descP = document.createElement('p');
    descP.innerHTML = description_text;
    const editBTN = document.createElement('button');
    editBTN.setAttribute('class', 'editBTN BTN');
    editBTN.innerText = "Edit";

    const deleteBTN = document.createElement('button');
    deleteBTN.setAttribute('class', 'deleteBTN BTN');
    deleteBTN.innerText = "Delete";

    const editPost = document.createElement('div');
    editPost.setAttribute('class', 'editPost');
    editPost.style.display = 'none';
    const editInput = document.createElement('input');
    const UpdateBTN = document.createElement('button');
    UpdateBTN.setAttribute('class', 'UpdateBTN BTN');
    UpdateBTN.innerHTML = 'Update';
    editInput.setAttribute('type', 'text');
    editInput.setAttribute('placeholder', 'Update your post here');

    description.appendChild(descP);
    description.appendChild(editBTN);
    description.appendChild(deleteBTN);
    eachFeed.appendChild(description);

    editPost.appendChild(editInput);
    editPost.appendChild(UpdateBTN);
    eachFeed.appendChild(editPost);


    if (flag) {
        editBTN.style.display = 'block';
        deleteBTN.style.display = 'block';
    } else {
        editBTN.style.display = 'none';
        deleteBTN.style.display = 'none';
    };

    const summary = document.createElement('div');
    const likesNum = document.createElement('span');
    likesNum.setAttribute('class', 'likesNum');
    likesNum.innerHTML = likes.length + " Likes";
    summary.appendChild(likesNum);
    const commentsNum = document.createElement('span');
    commentsNum.innerHTML = comments.length + " Comments";
    summary.appendChild(commentsNum);
    commentsNum.setAttribute('class', 'commentsNum');
    // 2.3.1. Show Likes
    const liker = document.createElement('ul');
    let flagLikeID = false;
    for (let likeID in likes) {
        if (likes[likeID] === myInfo['id']) {
            flagLikeID = true;
        };
        const b = document.createElement('b');

        const getURL = 'user' + "?id=" + likes[likeID];
        api.get(getURL, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            }
        }).then(
            res => {
                b.innerHTML = res['username'];
            }
        ).catch(err => console.warn(`API_ERROR: ${err.message}`));
        liker.appendChild(b);
    };
    liker.style.display = "none";
    summary.appendChild(liker);

    // 2.3.2. Show Comments
    const commentator = document.createElement('ul');
    for (let c in comments) {
        const li = document.createElement('li');
        const commentTop = document.createElement('div');
        commentTop.setAttribute('class', 'commentTop');
        const authorSpan = document.createElement('b');
        const dateSpan = document.createElement('i');
        authorSpan.innerHTML = comments[c]['author'];

        dateSpan.innerHTML = formTime(comments[c]['published']);
        commentTop.appendChild(authorSpan);
        commentTop.appendChild(dateSpan);
        li.appendChild(commentTop);
        const commentText = document.createElement('div');
        commentText.innerHTML = comments[c]['comment'];
        commentText.setAttribute('class', 'commentText');
        li.appendChild(commentText);
        commentator.appendChild(li);
    };
    commentator.style.display = "none";
    summary.appendChild(commentator);

    eachFeed.appendChild(summary);

    likesNum.addEventListener('click', function () {
        if (!flagLike) {
            liker.style.display = "block";
            flagLike = true;
        } else {
            liker.style.display = "none";
            flagLike = false;
        };
    });

    commentsNum.addEventListener('click', function () {
        if (!flagComment) {
            commentator.style.display = "block";
            flagComment = true;
        } else {
            commentator.style.display = "none";
            flagComment = false;
        };
    });
    const feedBottom = document.createElement('div');
    feedBottom.setAttribute('class', 'feedBottom');
    const btnLike = document.createElement('button');
    btnLike.setAttribute('class', 'btnLike BTN');
    if (flagLikeID) {
        btnLike.innerHTML = "Unlike";
    } else {
        btnLike.innerHTML = "Like";
    };
    const btnComment = document.createElement('button');
    btnComment.setAttribute('class', 'btnComment BTN');
    btnComment.innerHTML = "Comment";
    const CommentInput = document.createElement('input');
    const CommentBTN = document.createElement('button');
    CommentBTN.innerHTML = 'Submit';
    CommentBTN.setAttribute('class', 'CommentBTN BTN');
    CommentInput.setAttribute('type', 'text');
    CommentInput.setAttribute('placeholder', 'Write your comment here');
    CommentInput.style.display = 'none';
    CommentBTN.style.display = 'none';

    feedBottom.appendChild(btnLike);
    feedBottom.appendChild(btnComment);
    feedBottom.appendChild(CommentInput);
    feedBottom.appendChild(CommentBTN);
    eachFeed.appendChild(feedBottom);
    content.appendChild(eachFeed);

    // 2.3.3. Ability to like content
    btnLike.addEventListener('click', function () {
        if (btnLike.innerHTML === "Like") {
            const putURL = "post/like?id=" + postID;
            putInfo(api, putURL, token);
            reGetPost(api, postID, token, liker, likesNum);
            btnLike.innerHTML = "Unlike";
            flagLikeID = true;
        } else if (btnLike.innerHTML === "Unlike") {
            const unlikeputURL = "post/unlike?id=" + postID;
            putInfo(api, unlikeputURL, token);
            reGetPost(api, postID, token, liker, likesNum);
            btnLike.innerHTML = "Like";
            flagLikeID = false;
        }
    });
    // 2.5.3. Leaving comments
    btnComment.addEventListener('click', function () {
        if (CommentInput.style.display === 'none') {
            CommentInput.style.display = 'block';
            CommentBTN.style.display = 'block';
        } else {
            CommentInput.style.display = 'none';
            CommentBTN.style.display = 'none';
        }
    });

    CommentBTN.addEventListener('click', function () {
        if (CommentInput.value) {
            api.put('post/comment?id=' + postID, {
                body: JSON.stringify({
                    "comment": CommentInput.value
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                }
            }).then(
                res => {
                    console.log(res);
                    CommentInput.value = "";
                    newComment(api, postID, token, commentator, commentsNum);
                }
            ).catch(err => console.warn(`API_ERROR: ${err.message}`));
        };

    });

    authorName.addEventListener('click', function () {
        getPersonalPage(api, authorName.innerHTML, token, myInfo);
    });

    // 2.5.2. Updating & deleting  a post ----Start
    deleteBTN.addEventListener('click', function () {
        api.delete('post?id=' + postID, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            }
        }).then(
            res => {
                console.log(res);
                alert('Delete success! Please reload your homepage.');
                eachFeed.style.display = 'none';
            }
        ).catch(err => console.warn(`API_ERROR: ${err.message}`));
    });

    editBTN.addEventListener('click', function () {
        if (editPost.style.display === 'block') {
            editPost.style.display = 'none';
            editBTN.innerHTML = "Edit";
        } else {
            editPost.style.display = 'block';
            editBTN.innerHTML = "Cancel";
        }
    });

    UpdateBTN.addEventListener('click', function () {
        if (editInput.value) {
            api.put('post?id=' + postID, {
                body: JSON.stringify({
                    "description_text": editInput.value,
                    "src": postsItem['src'],
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                }
            }).then(
                res => {
                    console.log(res);
                }
            ).catch(err => console.warn(`API_ERROR: ${err.message}`));

        };
        descP.innerHTML = editInput.value;
        editInput.value = "";
    });
    // 2.5.2. Updating & deleting  a post ----End
};