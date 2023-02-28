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

function handleShowDebt() {
    const slug = document.querySelector('#slug').value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/detail/debt/${slug}`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let tbody = document.querySelector('tbody');
            tbody.innerHTML = '';
            for (let { _id, id, note, type, monney, timeDebt, createAt } of response.debts) {
                let row = tbody.insertRow();
                row.classList.add('perDebt');
                timeDebt = String(timeDebt);
                row.insertCell().innerHTML = id;
                row.insertCell().innerHTML = note;
                row.insertCell().innerHTML = type;
                row.insertCell().innerHTML = monney;
                row.insertCell().innerHTML = timeDebt;
                row.insertCell().innerHTML = createAt;
                row.insertCell().innerHTML = `<button type="button" class="btn btn-info detailDebtBtn" onclick="showDetailDebt()" id="detailDebtBtn${id}" data-toggle="modal" data-target="#detailDebt" data-id="${id}" data-note="${note}" data-type="${type}" data-monney="${monney}" data-time="${timeDebt}"> <i class="fa-solid fa-info"></i>Chi tiet</button>`;
                row.insertCell().innerHTML = `<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteDebt" data-id="${_id}"> <i class="fa-sharp fa-solid fa-minus"></i> Xóa</button>`;
            }

            document.getElementById('currentPage').value = response.currentPage;
            document.getElementById('pages').textContent = response.pages;
            if (response.currentPage >= response.pages) {
                document.getElementById('nextPage').disabled = true;
            } else {
                document.getElementById('nextPage').disabled = false;
            }
        }
    };

    xhr.send();
}

function nextPageDebt() {
    document.getElementById('nextPage').addEventListener('click', () => {
        const slug = document.querySelector('#slug').value;
        let perPage = Number(document.getElementById('perPage').value);
        let currentPage = Number(document.getElementById('currentPage').value);
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${window.location.origin}/finance/detail/debt/${slug}/?perPage=${perPage}&page=${currentPage + 1}`);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                let tbody = document.querySelector('tbody');
                tbody.innerHTML = '';
                for (let { _id, id, note, type, monney, timeDebt, createAt } of response.debts) {
                    let row = tbody.insertRow();
                    timeDebt = String(timeDebt);
                    row.insertCell().innerHTML = id;
                    row.insertCell().innerHTML = note;
                    row.insertCell().innerHTML = type;
                    row.insertCell().innerHTML = monney;
                    row.insertCell().innerHTML = timeDebt;
                    row.insertCell().innerHTML = createAt;
                    row.insertCell().innerHTML = `<button type="button" class="btn btn-info detailDebtBtn" onclick="showDetailDebt()" id="detailDebtBtn${id}" data-toggle="modal" data-target="#detailDebt" data-id="${id}" data-note="${note}" data-type="${type}" data-monney="${monney}" data-time="${timeDebt}"> <i class="fa-solid fa-info"></i>Chi tiet</button>`;
                    row.insertCell().innerHTML = `<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteDebt" data-id="${_id}"> <i class="fa-sharp fa-solid fa-minus"></i> Xóa</button>`;
                }

                document.getElementById('currentPage').value = response.currentPage;
                document.getElementById('pages').textContent = response.pages;
                document.getElementById('prePage').disabled = false;
                if (response.currentPage >= response.pages) {
                    document.getElementById('nextPage').disabled = true;
                }
            }
        };

        xhr.send();
    })
}

function prePageDebt() {
    document.getElementById('prePage').addEventListener('click', () => {
        const slug = document.querySelector('#slug').value;
        let perPage = Number(document.getElementById('perPage').value);
        let currentPage = Number(document.getElementById('currentPage').value);
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${window.location.origin}/finance/detail/debt/${slug}/?perPage=${perPage}&page=${currentPage - 1}`);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                let tbody = document.querySelector('tbody');
                tbody.innerHTML = '';
                for (let { _id, id, note, type, monney, timeDebt, createAt } of response.debts) {
                    let row = tbody.insertRow();
                    timeDebt = String(timeDebt);
                    row.insertCell().innerHTML = id;
                    row.insertCell().innerHTML = note;
                    row.insertCell().innerHTML = type;
                    row.insertCell().innerHTML = monney;
                    row.insertCell().innerHTML = timeDebt;
                    row.insertCell().innerHTML = createAt;
                    row.insertCell().innerHTML = `<button type="button" class="btn btn-info detailDebtBtn" onclick="showDetailDebt()" id="detailDebtBtn${id}" data-toggle="modal" data-target="#detailDebt" data-id="${id}" data-note="${note}" data-type="${type}" data-monney="${monney}" data-time="${timeDebt}"> <i class="fa-solid fa-info"></i>Chi tiet</button>`;
                    row.insertCell().innerHTML = `<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteDebt" data-id="${_id}"> <i class="fa-sharp fa-solid fa-minus"></i> Xóa</button>`;
                }

                document.getElementById('currentPage').value = response.currentPage;
                document.getElementById('pages').textContent = response.pages;
                document.getElementById('nextPage').disabled = false;
                if (response.currentPage == 1) {
                    document.getElementById('prePage').disabled = true;
                }
            }
        };

        xhr.send();
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
        const perPage = document.getElementById('perPage').value;

        const data = { debtorId, debtorName, note, type, monney, timeDebt, perPage };
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/finance/addNewDebt`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                alert('Thêm thông tin khoản nợ thành công!');
                let tbody = document.querySelector('tbody');
                tbody.innerHTML = '';
                for (let { _id, id, note, type, monney, timeDebt, createAt } of response.debts) {
                    let row = tbody.insertRow();
                    timeDebt = String(timeDebt);
                    row.insertCell().innerHTML = id;
                    row.insertCell().innerHTML = note;
                    row.insertCell().innerHTML = type;
                    row.insertCell().innerHTML = monney;
                    row.insertCell().innerHTML = timeDebt;
                    row.insertCell().innerHTML = createAt;
                    row.insertCell().innerHTML = `<button type="button" class="btn btn-info detailDebtBtn" onclick="showDetailDebt()" id="detailDebtBtn${id}" data-toggle="modal" data-target="#detailDebt" data-id="${id}" data-note="${note}" data-type="${type}" data-monney="${monney}" data-time="${timeDebt}"> <i class="fa-solid fa-info"></i>Chi tiet</button>`;
                    row.insertCell().innerHTML = `<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteDebt" data-id="${_id}"> <i class="fa-sharp fa-solid fa-minus"></i> Xóa</button>`;
                }

                document.getElementById('currentPage').value = response.currentPage;
                document.getElementById('pages').textContent = response.pages;
                document.getElementById('nextPage').disabled = false;
                if (response.currentPage == 1) {
                    document.getElementById('prePage').disabled = true;
                }
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
                    row.insertCell().innerHTML = `<button type="button" class="btn btn-info detailDebtBtn" onclick="showDetailDebt()" id="detailDebtBtn${id}" data-toggle="modal" data-target="#detailDebt" data-id="${id}" data-note="${note}" data-type="${type}" data-monney="${monney}" data-time="${timeDebt}"> <i class="fa-solid fa-info"></i>Chi tiet</button>`;
                    row.insertCell().innerHTML = `<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteDebt" data-id="${_id}"> <i class="fa-sharp fa-solid fa-minus"></i> Xóa</button>`;
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

function handleDeleteDebt() {
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

function showDetailDebt() {
    let monney, note, type, timeDebt;
    $('#detailDebt').on('show.bs.modal', event => {
        var button = $(event.relatedTarget);
        note = button.data('note');
        type = button.data('type');
        monney = button.data('monney');
        time = button.data('time');

        document.getElementById('noteDetail').value = note;
        document.getElementById('monneyDetail').value = monney;
        document.getElementById('timeDebtDetail').value = time;
        document.getElementById('textMonneyDetail').textContent = convertMoneyToString(Number(monney));

        let positive = document.getElementById('+DebtDetail');
        let negative = document.getElementById('-DebtDetail');

        if (type === '+') {
            negative.classList.remove('choose');
            positive.classList.add('choose');
        } else {
            positive.classList.remove('choose');
            negative.classList.add('choose');
        }
    })
}

function choosePerPage() {
    let perPage = document.getElementById('perPage').value;
    const slug = document.querySelector('#slug').value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/detail/debt/${slug}?perPage=${perPage}&page=1`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let tbody = document.querySelector('tbody');
            tbody.innerHTML = '';
            for (let { _id, id, note, type, monney, timeDebt, createAt } of response.debts) {
                let row = tbody.insertRow();
                timeDebt = String(timeDebt);
                row.insertCell().innerHTML = id;
                row.insertCell().innerHTML = note;
                row.insertCell().innerHTML = type;
                row.insertCell().innerHTML = monney;
                row.insertCell().innerHTML = timeDebt;
                row.insertCell().innerHTML = createAt;
                row.insertCell().innerHTML = `<button type="button" class="btn btn-info detailDebtBtn" onclick="showDetailDebt()" id="detailDebtBtn${id}" data-toggle="modal" data-target="#detailDebt" data-id="${id}" data-note="${note}" data-type="${type}" data-monney="${monney}" data-time="${timeDebt}"> <i class="fa-solid fa-info"></i>Chi tiet</button>`;
                row.insertCell().innerHTML = `<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteDebt" data-id="${_id}"> <i class="fa-sharp fa-solid fa-minus"></i> Xóa</button>`;
            }

            document.getElementById('currentPage').value = response.currentPage;
            document.getElementById('pages').textContent = response.pages;
            if (response.currentPage >= response.pages) {
                document.getElementById('nextPage').disabled = true;
            } else {
                document.getElementById('nextPage').disabled = false;
            }
        }
    };

    xhr.send();
}

function textErr() {
    let perDebt = document.querySelectorAll('.perDebt');
        perDebt.forEach(d => {
            if (d.querySelectorAll('td')[2].innerHTML === '-') {
                d.classList.add('text-danger');
            }
        })
}