function handleLogin() {
    document.getElementById("form-submit").addEventListener("click", function (event) {
        event.preventDefault();
        const account = document.querySelector('#account').value;
        const password = document.querySelector('#password').value;
        const captcha = document.querySelector('#captcha').value;
        const data = { account, password, captcha };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/login`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                window.location.href = '/';
            } else {
                changeCaptcha();
                const captcha = document.querySelector('#captcha');
                captcha.value = '';
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
            }
        };

        xhr.send(JSON.stringify(data));
    })
}

function handleSignup() {
    document.getElementById("form-submit").addEventListener("click", function (event) {
        event.preventDefault();
        const fullname = document.querySelector('#fullname').value;
        const email = document.querySelector('#email').value;
        const account = document.querySelector('#account').value;
        const password = document.querySelector('#password').value;
        const captcha = document.querySelector('#captcha').value;
        const data = { fullname, email, account, password, captcha };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/signup`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
            } else {
                changeCaptcha();
                const captcha = document.querySelector('#captcha');
                captcha.value = '';
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
            }
        };

        xhr.send(JSON.stringify(data));
    })
}

function handleRequestResetPassword() {
    document.getElementById("form-submit").addEventListener("click", function (event) {
        event.preventDefault();
        const account = document.querySelector('#account').value;
        const email = document.querySelector('#email').value;
        const captcha = document.querySelector('#captcha').value;
        const data = { account, email, captcha };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/passwordrr`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
            } else {
                changeCaptcha();
                const captcha = document.querySelector('#captcha');
                captcha.value = '';
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
            }
        };

        xhr.send(JSON.stringify(data));
    })
}

function handleResetPassword() {
    document.getElementById("form-submit").addEventListener("click", function (event) {
        event.preventDefault();
        const userId = document.querySelector('#userId').value;
        const password = document.querySelector('#password').value;
        const resetString = document.querySelector('#resetString').value;
        const captcha = document.querySelector('#captcha').value;
        const data = { userId, password, resetString, captcha };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/resetPassword`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
                window.location.href = '/';
            } else {
                changeCaptcha();
                const captcha = document.querySelector('#captcha');
                captcha.value = '';
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
            }
        };

        xhr.send(JSON.stringify(data));
    })
}

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
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
            } else {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
            }
        };

        xhr.send(JSON.stringify(data));
    })
}

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
            alert('Re-entered password does not match');
            window.location.href = '/profile';
        } else {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${window.location.origin}/updateUserAccount`, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    alert(response.message);
                } else {
                    changeCaptcha();
                    const captcha = document.querySelector('#captcha');
                    captcha.value = '';
                    var response = JSON.parse(xhr.responseText);
                    alert(response.message);
                }
            };

            xhr.send(JSON.stringify(data));
        }
    })
}

function changeCaptcha() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/newCaptcha", true);
    xhr.onload = function () {
        const response = JSON.parse(xhr.responseText);
        document.getElementById("captcha-img").src =
            `/captcha?text=${response.captcha}`;

    };
    xhr.send();
}

function handleChangCaptcha() {
    document.getElementById("change-captcha").addEventListener("click", function () {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/newCaptcha", true);
        xhr.onload = function () {
            const response = JSON.parse(xhr.responseText);
            document.getElementById("captcha-img").src =
                `/captcha?text=${response.captcha}`;
        };
        xhr.send();
    });
}