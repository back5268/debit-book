function handleNotification(message) {
    document.querySelector('#notification .modal-body').innerHTML = message;
    let noti = document.querySelector('#showNoti');
    noti.click();
};

function handleLogin() {
    const account = document.querySelector('#account').value;
    const password = document.querySelector('#password').value;
    const captcha = document.querySelector('#captcha').value;
    const data = { account, password, captcha };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${window.location.origin}/login`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            window.location.href = '/';
        } else {
            changeCaptcha();
            handleNotification(response.message);
            const captcha = document.querySelector('#captcha');
            captcha.value = '';
        };
    };
    xhr.send(JSON.stringify(data));
};

function handleSignup() {
    const email = document.querySelector('#email').value;
    const account = document.querySelector('#account').value;
    const password = document.querySelector('#password').value;
    const captcha = document.querySelector('#captcha').value;
    const data = { email, account, password, captcha };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${window.location.origin}/signup`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            handleNotification(response.message);
            document.querySelector('form').reset();
        } else {
            changeCaptcha();
            handleNotification(response.message);
            const captcha = document.querySelector('#captcha');
            captcha.value = '';
        };
    };
    xhr.send(JSON.stringify(data));
};

function handleRequestResetPassword() {
    const account = document.querySelector('#account').value;
    const email = document.querySelector('#email').value;
    const captcha = document.querySelector('#captcha').value;
    const data = { account, email, captcha };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${window.location.origin}/passwordrr`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            handleNotification(response.message);
            document.querySelector('form').reset();
        } else {
            changeCaptcha();
            handleNotification(response.message);
            const captcha = document.querySelector('#captcha');
            captcha.value = '';
        };
    };
    xhr.send(JSON.stringify(data));
};

function handleResetPassword() {
    const userId = document.querySelector('#userId').value;
    const password = document.querySelector('#password').value;
    const resetString = document.querySelector('#resetString').value;
    const captcha = document.querySelector('#captcha').value;
    const data = { userId, password, resetString, captcha };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${window.location.origin}/resetPassword`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            handleNotification(response.message);
            document.querySelector('form').reset();
        } else {
            changeCaptcha();
            handleNotification(response.message);
            const captcha = document.querySelector('#captcha');
            captcha.value = '';
        };
    };
    xhr.send(JSON.stringify(data));
};

function handleUpdateProfile() {
    document.getElementById("update-info").addEventListener("click", function (event) {
        event.preventDefault();
        const fullname = document.querySelector('#fullname').value;
        const phone = document.querySelector('#phone').value;
        const email = document.querySelector('#email').value;
        const address = document.querySelector('#address').value;
        const description = document.querySelector('#description').value;
        const userId = document.querySelector('#userId').value;

        const data = { fullname, phone, email, address, description, userId };
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/updateUserInfo`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            var response = JSON.parse(xhr.responseText);
            handleNotification(response.message);
        };
        xhr.send(JSON.stringify(data));
    });
};

function handleUpdateAccount() {
    document.getElementById("update-account").addEventListener("click", function (event) {
        event.preventDefault();
        const account = document.querySelector('#account').value;
        const oldPassword = document.querySelector('#oldPassword').value;
        const newPassword = document.querySelector('#newPassword').value;
        const reTypePassword = document.querySelector('#reTypePassword').value;
        const captcha = document.querySelector('#captcha').value;

        const data = { account, oldPassword, newPassword, captcha };
        if (reTypePassword != newPassword) {
            handleNotification('Re-entered password does not match!');
            window.location.href = '/profile';
        } else {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${window.location.origin}/updateUserAccount`, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                var response = JSON.parse(xhr.responseText);
                if (xhr.status === 200) {
                    handleNotification(response.message);
                } else {
                    changeCaptcha();
                    handleNotification(response.message);
                    const captcha = document.querySelector('#captcha');
                    captcha.value = '';
                };
            };
            xhr.send(JSON.stringify(data));
        };
    })
};

function changeCaptcha() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/newCaptcha", true);
    xhr.onload = function () {
        const response = JSON.parse(xhr.responseText);
        document.getElementById("captcha-img").src = `/captcha?text=${response.captcha}`;
    };
    xhr.send();
};

function formatPage(count, page) {
    let perPage = Number(document.querySelector('#perPage').value);
    let pages = Math.ceil(count / perPage);
    pages = (pages === 0) ? 1 : pages;

    document.getElementById('currentPage').value = page;
    document.getElementById('pages').textContent = pages;
    document.getElementById('totalRecord').textContent = count;

    if (page >= pages) {
        document.getElementById('nextPage').disabled = true;
    };
    if (page === 1) {
        document.getElementById('prevPage').disabled = true;
    };
    if (page < pages) {
        document.getElementById('nextPage').disabled = false;
    };
    if (page > 1) {
        document.getElementById('prevPage').disabled = false;
    };
};

function prevPage() {
    let page = Number(document.querySelector('#currentPage').value);
    page = (page === 1) ? 1 : (page - 1);
    return page;
};

function nextPage() {
    let page = Number(document.querySelector('#currentPage').value);
    let pages = Number(document.querySelector('#pages').innerHTML);
    page = (page === pages) ? pages : (page + 1);
    return page;
};

function choosePage() {
    let page = Number(document.querySelector('#currentPage').value);
    let pages = Number(document.querySelector('#pages').innerHTML);
    if (page >= pages) page = pages;
    if (page <= 1) page = 1;
    return page;
};