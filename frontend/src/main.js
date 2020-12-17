import API from './api.js';
import { onceFeed, basicFeed } from './feed.js';
import { getPersonalPage } from './profileView.js';
import { createNewPost } from './newPost.js';
import { fileToDataUrl } from './helpers.js';
const api = new API('http://localhost:5000');

const WebName = document.getElementById("WebName");
const UserpageTitle = document.getElementById('UserpageTitle');
const transform = document.getElementById("transform");
const transformToLogin = document.getElementById("transformToLogin");
const newContentPost = document.getElementById('newContentPost');
const postBTN = document.getElementById('subNewPost');
const uploadFile = document.getElementById('file');
const showFollowing = document.getElementById('selfInfoBTN');
const Focus = document.getElementById('Focus');
const topSearch = document.getElementById('topSearch');

let token = "";
let myInfo = {};
let p = 0;
let n = 5;
let src = '';
let newPostID = '';

// 2.1.1 Login part---Start
const login = document.forms.login;
const usernameLogin = login.usernameLogin;
const passwordLogin = login.passwordLogin;
const loginbtn = login.loginbtn;
const checkNotNull = document.getElementById("checkNotNull");
// const notImplement = document.getElementById("notImplement");
const searchUserbtn = document.getElementById('searchUserbtn');
const searchUsers = document.getElementById('searchUsers');

// check if input is empty
function check(input, warning, button) {
    if (!input.value) {
        // alert("error");
        warning.style.display = "block";
        warning.innerHTML = "Cannot be null for all.";
        button.disabled = true;

    } else {
        warning.style.display = "none";
        button.disabled = false;
    }
};

// onblur function for inputs
function blurInput(inputItem, checkNull, btn) {
    inputItem.addEventListener('blur', function () {
        check(inputItem, checkNull, btn);
    });
};

blurInput(usernameLogin, checkNotNull, loginbtn);
blurInput(passwordLogin, checkNotNull, loginbtn);

loginbtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (usernameLogin.value && passwordLogin.value) {
        checkNotNull.style.display = "none";
        api.post('auth/login', {
            body: JSON.stringify({
                "username": usernameLogin.value,
                "password": passwordLogin.value,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(
            res => {
                if (res) {
                    // console.log(res);
                    token = res['token'];
                    document.getElementsByClassName("nav-item")[0].innerHTML = "Welcome, " + usernameLogin.value + "!";
                    api.get('user?username=' + usernameLogin.value, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Token ${token}`,
                        }
                    }).then(
                        res => {
                            for (let key in res) {
                                myInfo[key] = res[key];
                            };
                            login.style.display = "none";
                            transform.style.display = "none";
                            // notImplement.style.display = "block";
                            n = 5;
                            basicFeed(api, token, myInfo, n, p);
                        }
                    ).catch(err => console.warn(`API_ERROR: ${err.message}`));
                }
            }).catch(err => console.warn(`API_ERROR: ${err.message}`));
    } else {
        checkNotNull.style.display = "block";
        checkNotNull.innerHTML = "Cannot be null for all.";
    }
});

// click Quickpic return to feed page
WebName.addEventListener('click', function () {
    searchUsers.value = "";
    p = 0;
    basicFeed(api, token, myInfo, n, p);
});

// search someone then turn to his homepage
searchUserbtn.addEventListener('click', function () {
    if (searchUsers.value) {
        getPersonalPage(api, searchUsers.value, token, myInfo);
    }
});

// upload image
uploadFile.addEventListener('change', function (e) {
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.addEventListener('load', function () {
        src = this.result.replace(/^data:image\/\w+;base64,/, "");;
    });
});

// 2.5.1. Adding a post
postBTN.addEventListener('click', function () {
    if (newContentPost.value && src) {
        newPostID = createNewPost(api, token, newContentPost.value, src);
        newContentPost.value = '';
        uploadFile.value = '';
    }
});

// show the list of following users
showFollowing.addEventListener('click', function () {
    if (Focus.style.display === 'block') {
        Focus.style.display = 'none';
    } else {
        Focus.style.display = 'block';
    }
});

// click top right my name to my homepage
function clickMyself() {
    getPersonalPage(api, myInfo['username'], token, myInfo);
    UserpageTitle.style.display = "none";
};

document.getElementsByClassName("nav-item")[0].addEventListener('click', function () {
    clickMyself();
});

// 2.1.2 registration part
const registration = document.forms.registration;
const turnToRegister = document.getElementById("turnToRegister");
const usernameRegister = registration.usernameRegister;
const passwordRegister = registration.passwordRegister;
const confirmP = registration.confirmP;
const checkConfirmPwd = document.getElementById("checkConfirmPwd");
const email = registration.email;
const name = registration.name;
const registerbtn = registration.registerbtn;
const checkNotNullReg = document.getElementById("checkNotNullReg");
const turnToLogin = document.getElementById('turnToLogin');

turnToRegister.addEventListener('click', function () {
    login.style.display = "none";
    transform.style.display = "none";
    registration.style.display = "block";
    transformToLogin.style.display = "block";
});

turnToLogin.addEventListener('click', function () {
    login.style.display = "block";
    transform.style.display = "block";
    registration.style.display = "none";
    transformToLogin.style.display = "none";
});

blurInput(usernameRegister, checkNotNullReg, registerbtn);
blurInput(passwordRegister, checkNotNullReg, registerbtn);

confirmP.addEventListener('blur', function () {
    if (confirmP.value !== passwordRegister.value) {
        checkConfirmPwd.style.display = "block";
        checkConfirmPwd.innerHTML = "Password do not match";
        registerbtn.disabled = true;
    } else {
        checkConfirmPwd.style.display = "none";
        registerbtn.disabled = false;
    }
});

registerbtn.addEventListener('click', function (e) {
    e.preventDefault();
    console.log(name.value);
    if (usernameRegister.value && passwordRegister.value && email.value && name.value) {
        checkNotNullReg.style.display = "none";
        api.post('auth/signup', {
            body: JSON.stringify({
                "username": usernameRegister.value,
                "password": passwordRegister.value,
                "email": email.value,
                "name": name.value
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(
            res => {
                if (res) {
                    token = res['token'];
                    alert("Success! Please do login");
                    login.style.display = "block";
                    registration.style.display = "none";
                    transform.style.display = "block";
                    transformToLogin.style.display = "none";
                    // notImplement.style.display = "block";
                }
            }
        ).catch(err => console.warn(`API_ERROR: ${err.message}`));
    } else {
        checkNotNullReg.style.display = "block";
        checkNotNullReg.innerHTML = "Cannot be null for all.";
    }
});

// 2.6.1 infinite scroll
window.addEventListener('scroll', function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (clientHeight + scrollTop >= scrollHeight - 2) {
        console.log("bottom");
        if (topSearch.style.display !== 'none') {
            p += n;
            const originalPostList = document.getElementById('postsList');
            onceFeed(api, p, n, token, myInfo, originalPostList);
        }
    };
});

// 2.7.3 Fragment based URL routing
window.addEventListener('hashchange', function () {
    if (token) {
        const hash = location.hash;
        console.log(hash);
        if (hash === '#feed') {
            login.style.display = "none";
            transform.style.display = "none";
            // notImplement.style.display = "block";
            n = 5;
            basicFeed(api, token, myInfo, n, p);
        } else {
            const name = hash.replace("#profile=", "");
            console.log(name);
            if (name === myInfo['username'] || name === 'me') {
                clickMyself();
                console.log("aaa");
            } else {
                getPersonalPage(api, name, token, myInfo);
            }
        };
    } else {
        alert('Please login first!');
    }
});
