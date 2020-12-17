import { createEachFeed } from './eachFeed.js';
import { followUser } from './follow.js';

// check if already followed the user
function checkFollow(UserID, followersID) {
    let checkFollowFlag = false;
    for (let index in followersID) {
        if (UserID === followersID[index]) {
            checkFollowFlag = true;
            return checkFollowFlag;
        };
    };
    return checkFollowFlag;
};

function createLiByID(api, li, IDList, token) {
    for (let id in IDList) {
        const div = document.createElement('div');
        div.setAttribute("class", "FocusUser");
        const getURL = 'user' + "?id=" + IDList[id];
        api.get(getURL, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            }
        }).then(
            res => {
                div.innerHTML = res['username'];
            }
        ).catch(err => console.warn(`API_ERROR: ${err.message}`));
        li.appendChild(div);
    };
};

// 2.4.1 Profile View / Profile View
export function getPersonalPage(api, username, token, myInfo) {
    const getURL = 'user' + "?username=" + username;
    api.get(getURL, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        }
    }).then(
        res => {
            if (res) {
                const UserInfo = {};
                const followBtn = document.createElement('button');
                const UserpageTitle = document.getElementById('UserpageTitle');
                const main = document.getElementById('main');
                main.insertBefore(UserpageTitle, main.firstChild);
                const postsList = document.getElementById('postsList');
                const selfInfo = document.getElementById('selfInfo');
                selfInfo.style.display = "block";
                document.getElementById('topSearch').style.display = "none";
                UserpageTitle.style.display = "block";
                UserpageTitle.innerHTML = "";

                UserpageTitle.innerHTML = username + "'s Homepage";
                UserpageTitle.appendChild(followBtn);
                console.log(username);
                postsList.innerHTML = "";

                let clickID = "";
                let selfPageFlag = false;
                const newPost = document.getElementById('newPost');
                newPost.style.display = 'none';
                // check the name is other user or myself
                if (username === myInfo['username']) {
                    selfPageFlag = true;
                    newPost.style.display = 'block';
                    UserpageTitle.style.display = 'none';
                };
                for (let key in res) {
                    UserInfo[key] = res[key];
                };
                const userPost = res['posts'];
                clickID = res['id'];
                document.getElementById('selfInfo_uname').innerHTML = res['username'];
                document.getElementById('selfInfo_email').innerHTML = res['email'];
                document.getElementById('selfInfo_name').innerHTML = res['name'];
                document.getElementById('selfInfo_posts').innerHTML = userPost.length;
                document.getElementById('selfInfo_following').innerHTML = res['following'].length;
                document.getElementById('selfInfo_followed').innerHTML = res['followed_num'];

                const Focus = document.getElementById('Focus');
                Focus.innerHTML = "";
                createLiByID(api, Focus, res['following'], token);

                const profileForm = document.createElement('form');
                profileForm.setAttribute('class', 'profileForm');
                const emailInput = document.createElement('input');
                emailInput.setAttribute('type', 'text');
                emailInput.setAttribute('placeholder', 'update email');
                profileForm.appendChild(emailInput);

                const passwordInput = document.createElement('input');
                passwordInput.setAttribute('type', 'text');
                passwordInput.setAttribute('placeholder', 'update password');
                profileForm.appendChild(passwordInput);

                const confirmPasswordInput = document.createElement('input');
                confirmPasswordInput.setAttribute('type', 'text');
                confirmPasswordInput.setAttribute('placeholder', 'confirm new password');
                profileForm.appendChild(confirmPasswordInput);

                const passwordErrorCheck = document.createElement('div');
                passwordErrorCheck.style.display = 'none';
                profileForm.appendChild(passwordErrorCheck);

                const nameInput = document.createElement('input');
                nameInput.setAttribute('type', 'text');
                nameInput.setAttribute('placeholder', 'update your name');
                profileForm.appendChild(nameInput);
                profileForm.appendChild(document.createElement('br'));

                const sumbitModifiedInfo = document.createElement('button');
                sumbitModifiedInfo.setAttribute('class', 'BTN');
                sumbitModifiedInfo.innerHTML = 'Submit Update';
                profileForm.appendChild(sumbitModifiedInfo);
                selfInfo.appendChild(profileForm);
                profileForm.style.display = 'none';

                // 2.5.4 Updating the profile ------Start
                const UpdateProfile = document.getElementById('UpdateProfile');
                if (selfPageFlag) {
                    UpdateProfile.style.display = 'block';
                } else {
                    UpdateProfile.style.display = 'none';
                };

                UpdateProfile.addEventListener('click', function () {
                    if (UpdateProfile.innerHTML === "Edit Profile") {
                        UpdateProfile.innerHTML = "Cancel";
                        profileForm.style.display = 'block';
                    } else {
                        UpdateProfile.innerHTML = "Edit Profile";
                        profileForm.style.display = 'none';
                    };
                });

                passwordInput.addEventListener('blur', function () {
                    if (passwordInput.value.length < 1) {
                        passwordErrorCheck.style.display = 'block';
                        passwordErrorCheck.innerHTML = "New Password should be more than 1 character";
                    } else {
                        passwordErrorCheck.style.display = 'none';
                    }
                });

                confirmPasswordInput.addEventListener('blur', function () {
                    if (confirmPasswordInput.value !== passwordInput.value) {
                        passwordErrorCheck.style.display = 'block';
                        passwordErrorCheck.innerHTML = "Password do not match";
                    } else {
                        passwordErrorCheck.style.display = 'none';
                    }
                });

                sumbitModifiedInfo.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (emailInput.value || passwordErrorCheck.style.display === 'none' || nameInput.value) {
                        let bodyObj = {};
                        if (emailInput.value) {
                            bodyObj["email"] = emailInput.value
                        };
                        if (nameInput.value) {
                            bodyObj["name"] = nameInput.value
                        };
                        if (passwordErrorCheck.style.display === 'none' && passwordInput.value) {
                            bodyObj["password"] = passwordInput.value
                        };
                        api.put('user', {
                            body: JSON.stringify(bodyObj),
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Token ${token}`,
                            }
                        }).then(
                            res => {
                                console.log(res);
                                profileForm.reset();
                            }
                        ).catch(err => console.warn(`API_ERROR: ${err.message}`));

                    }
                });
                // 2.5.4 Updating the profile ------End
                if (checkFollow(clickID, myInfo['following'])) {
                    followBtn.innerHTML = "Followed";
                } else {
                    followBtn.innerHTML = "+ Follow";
                };
                for (let i = userPost.length - 1; i >= 0; i--) {
                    const getURL = "post?id=" + userPost[i];
                    api.get(getURL, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Token ${token}`,
                        }
                    }).then(
                        res => {
                            createEachFeed(api, postsList, res, token, myInfo, selfPageFlag);
                        }
                    ).catch(err => console.warn(`API_ERROR: ${err.message}`));
                };
                //  2.4.2 Follow
                followBtn.addEventListener('click', function () {

                    if (followBtn.innerHTML === "+ Follow") {
                        followBtn.innerHTML = "Followed";
                        followUser(api, "follow", username, token);
                    } else {
                        followBtn.innerHTML = "+ Follow";
                        followUser(api, "unfollow", username, token);
                    };
                    api.get('user?username=' + myInfo['username'], {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Token ${token}`,
                        }
                    }).then(
                        res => {
                            myInfo['following'] = res['following'];
                        }
                    ).catch(err => console.warn(`API_ERROR: ${err.message}`));
                });
            }
        }
    ).catch(err => console.warn(`API_ERROR: ${err.message}`));
};

