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

function handleAddDebtor() {
    document.getElementById("addNewDebtor").addEventListener("click", function (event) {
        event.preventDefault();
        const fullname = document.querySelector('#fullname').value;
        const phone = document.querySelector('#phone').value;
        const address = document.querySelector('#address').value;
        const email = document.querySelector('#email').value;

        const data = { fullname, phone, address, email };
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/finance/createNewDebtor`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
                window.location.href = '/finance';
            } else {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
            }
        };

        xhr.send(JSON.stringify(data));
    })
}

function handleAddDebt() {
    document.getElementById("addNewDebt").addEventListener("click", function (event) {
        event.preventDefault();
        const debtorId = document.querySelector('#debtorId').value;
        const debtorName = document.querySelector('#debtorName').value;
        const note = document.querySelector('#note').value;
        const type = document.querySelector('input[name="type"]:checked').value;
        const monney = document.querySelector('#monney').value;
        const timeDebt = document.querySelector('#timeDebt').value;
        const slug = document.querySelector('#slug').value;

        const data = { debtorId, debtorName, note, type, monney, timeDebt };
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/finance/addNewDebt`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
                window.location.href = `/finance/detail/${slug}`;
            } else {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
            }
        };

        xhr.send(JSON.stringify(data));
    })
}

function handleSearchDebt() {
    document.getElementById("searchDebt").addEventListener("click", function (event) {
        event.preventDefault();
        const type = document.querySelector('#type').value;
        const minMonney = document.querySelector('#minMonney').value;
        const maxMonney = document.querySelector('#maxMonney').value;
        const minTimeDebt = document.querySelector('#minTimeDebt').value;
        const maxTimeDebt = document.querySelector('#maxTimeDebt').value;
        const minTimeCreate = document.querySelector('#minTimeCreate').value;
        const maxTimeCreate = document.querySelector('#maxTimeCreate').value;
        const slug = document.querySelector('#slug').value;

        const data = { type, minMonney, maxMonney, minTimeDebt, maxTimeDebt, minTimeCreate, maxTimeCreate, slug };
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/finance/searchDebt`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                console.log('response: ' + response.debt);
                let tbody = document.querySelector('tbody');
                tbody.innerHTML = '';
                for (const { _id, id, note, type, monney, timeDebt, createAt } of response.debt) {
                    let row = tbody.insertRow();
                    row.insertCell().innerHTML = id;
                    row.insertCell().innerHTML = note;
                    row.insertCell().innerHTML = type;
                    row.insertCell().innerHTML = monney;
                    row.insertCell().innerHTML = timeDebt;
                    row.insertCell().innerHTML = createAt;
                    row.insertCell().innerHTML = `<button type="button" class="btn btn-info" data-toggle="modal" data-target="#detailDebt${id}"> <i class="fa-solid fa-info"></i>Chi tiet</button>`;
                    row.insertCell().innerHTML = `<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteDebt" data-id="${_id}"> <i class="fa-sharp fa-solid fa-minus"></i> Xóa</button>`
                }
            }
        };

        xhr.send(JSON.stringify(data));
    })
}

function handleUpdateDebtor() {
    document.getElementById("updateDebtor").addEventListener("click", function (event) {
        event.preventDefault();
        const debtorId = document.querySelector('#debtorId').value;
        const phone = document.querySelector('#phone').value;
        const email = document.querySelector('#email').value;
        const address = document.querySelector('#address').value;

        const data = { debtorId, phone, email, address };
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/finance/updateDebtor`, true);
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

function handleDeleteDebt(debtId) {
    var debtId;

    $('#deleteDebt').on('show.bs.modal', event => {
        var button = $(event.relatedTarget);
        debtId = button.data('id');
    })

    document.getElementById("deleteDebtBtn").addEventListener("click", function (event) {
        const slug = document.querySelector('#slug').value;
        const data = { debtId };
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/finance/debt/delete`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                window.location.href = `/finance/detail/${slug}`;
            } else {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
            }
        };

        xhr.send(JSON.stringify(data));
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