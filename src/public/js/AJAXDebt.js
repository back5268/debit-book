function dateTimeHelper(time) {
    let date = new Date(time);
    let day = date.getDate();
    day = day < 10 ? '0' + day : day;
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let year = date.getFullYear();
    let hours = date.getHours() + 7;
    hours = hours < 10 ? '0' + hours : hours;
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let seconds = date.getSeconds();
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function formatMonney(num) {
    let numStr = String(Math.abs(num));
    let words = '';
    let x = Math.ceil(numStr.length / 3);

    if (x > 1) {
        let i = 0;
        while (i < x) {
            if (words === '') {
                words = numStr.slice(-3);
            } else {
                words = numStr.slice(-3) + ',' + words;
            }
            numStr = numStr.slice(0, -3);
            i += 1;
        }
    } else {
        words = numStr;
    }

    words = words.trim();
    if (num < 0) {
        return '-' + words;
    } else {
        return words;
    }
}

function show(data, count, page) {
    let tbody = document.querySelector('tbody');
    let perPage = Number(document.querySelector('#perPage').value);
    let pages = Math.ceil(count / perPage);
    pages = (pages === 0) ? 1 : pages;
    tbody.innerHTML = '';
    for (let { _id, stt, note, type, monney, timeDebt, createAt } of data) {
        let row = tbody.insertRow();
        row.classList.add('perDebt');
        timeDebt = String(timeDebt);
        row.insertCell().innerHTML = stt;
        row.insertCell().innerHTML = note;
        row.insertCell().innerHTML = type;
        row.insertCell().innerHTML = formatMonney(monney);
        row.insertCell().innerHTML = dateTimeHelper(timeDebt);
        row.insertCell().innerHTML = dateTimeHelper(createAt);
        row.insertCell().innerHTML = `<button type="button" class="btn btn-info detailDebtBtn" onclick="showDetailDebt()" data-toggle="modal" data-target="#detailDebt" data-note="${note}" data-type="${type}" data-monney="${monney}" data-time="${timeDebt}"> <i class="fa-solid fa-info"></i>Chi tiet</button>`;
        row.insertCell().innerHTML = `<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteDebt" data-id="${_id}"> <i class="fa-sharp fa-solid fa-minus"></i> Xóa</button>`;
    }

    document.getElementById('currentPage').value = page;
    document.getElementById('pages').textContent = pages;
    document.getElementById('totalRecord').textContent = `Total: ${count} record(s)`;

    if (page >= pages) {
        document.getElementById('nextPage').disabled = true;
    };
    if (page === 1) {
        document.getElementById('prePage').disabled = true;
    };
    if (page < pages) {
        document.getElementById('nextPage').disabled = false;
    }
    if (page > 1) {
        document.getElementById('prePage').disabled = false;
    };

}

function getOptions() {
    const type = document.querySelector('#type').value;
    const minMonney = document.querySelector('#minMonney').value;
    const maxMonney = document.querySelector('#maxMonney').value;
    const minTimeDebt = document.querySelector('#minTimeDebt').value;
    const maxTimeDebt = document.querySelector('#maxTimeDebt').value;
    const minTimeCreate = document.querySelector('#minTimeCreate').value;
    const maxTimeCreate = document.querySelector('#maxTimeCreate').value;
    const options = { type, minMonney, maxMonney, minTimeCreate, maxTimeCreate, minTimeDebt, maxTimeDebt }
    return options;
}

function showDebt() {
    const slug = document.querySelector('#slug').value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/detail/debt/${slug}`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            let page = response.page;
            show(data, count, page);
        }
    };

    xhr.send();
}

function nextPageDebt() {
    document.getElementById('nextPage').addEventListener('click', () => {
        const slug = document.querySelector('#slug').value;
        let options = getOptions();
        if (options.type === '+') options.type = 1;
        else if (options.type === '-') options.type = 0;
        else options.type = '';

        let perPage = Number(document.getElementById('perPage').value);
        let currentPage = Number(document.getElementById('currentPage').value);
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${window.location.origin}/finance/detail/debt/${slug}/?perPage=${perPage}&page=${currentPage + 1}&minMonney=${options.minMonney}&maxMonney=${options.maxMonney}&type=${options.type}`);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                let data = response.data;
                let count = response.count;
                let page = response.page;
                show(data, count, page);
            }
        };

        xhr.send();
    })
}

function prePageDebt() {
    document.getElementById('prePage').addEventListener('click', () => {
        const slug = document.querySelector('#slug').value;
        let options = getOptions();
        if (options.type === '+') options.type = 1;
        else if (options.type === '-') options.type = 0;
        else options.type = '';

        let perPage = Number(document.getElementById('perPage').value);
        let currentPage = Number(document.getElementById('currentPage').value);
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${window.location.origin}/finance/detail/debt/${slug}/?perPage=${perPage}&page=${currentPage - 1}&minMonney=${options.minMonney}&maxMonney=${options.maxMonney}&type=${options.type}`);
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                let data = response.data;
                let count = response.count;
                let page = response.page;
                show(data, count, page);
            }
        };

        xhr.send();
    })
}

function addDebt() {
    document.getElementById("addNewDebt").addEventListener("click", function (event) {
        event.preventDefault();
        const debtorId = document.querySelector('#debtorId').value;
        const debtorName = document.querySelector('#debtorName').value;
        const note = document.querySelector('#note').value;
        const type = document.querySelector('input[name="type"]:checked').value;
        const monney = document.querySelector('#monney').value;
        const timeDebt = document.querySelector('#timeDebt').value;
        const perPage = document.getElementById('perPage').value;

        const data = { debtorId, debtorName, note, type, monney, timeDebt, perPage };
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/finance/addNewDebt`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                alert('Thêm thông tin khoản nợ thành công!');
                let data = response.data;
                let count = response.count;
                let page = response.page;
                show(data, count, page);
            }
        };

        xhr.send(JSON.stringify(data));
    })
}

function searchDebt() {
    document.getElementById("searchDebt").addEventListener("click", function (event) {
        event.preventDefault();

        const slug = document.querySelector('#slug').value;
        const options = getOptions();
        let data = { options, slug };
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/finance/searchDebt`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                let data = response.data;
                let count = response.count;
                let page = response.page;
                show(data, count, page);
            }
        };

        xhr.send(JSON.stringify(data));
    })
}

function deleteDebt() {
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

function showDetailDebt() {
    let monney, note, type, time;
    $('#detailDebt').on('show.bs.modal', event => {
        var button = $(event.relatedTarget);
        note = button.data('note');
        type = button.data('type');
        monney = button.data('monney');
        time = button.data('time');

        document.getElementById('noteDetail').value = note;
        document.getElementById('monneyDetail').value = formatMonney(Number(monney));
        document.getElementById('timeDebtDetail').value = dateTimeHelper(time);
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
            let data = response.data;
            let count = response.count;
            let page = response.page;
            show(data, count, page);
        }
    };

    xhr.send();
}

function formatInfo() {
    let createAt = document.querySelector('#createAt').value;
    let totalDebts = document.querySelector('#totalDebts').value;
    let totalDebt = Number(totalDebts);
    let textMonney = convertMoneyToString(Math.abs(totalDebt));

    createAt = dateTimeHelper(createAt);
    totalDebts = formatMonney(totalDebt);

    document.querySelector('#createAt').value = createAt;
    document.querySelector('#totalDebts').value = totalDebts;
    document.querySelector('#text').textContent = textMonney
}

function chooseType() {
    let type = document.querySelector('#type').value;
    if (type === '+') type = 1;
    else if (type === '-') type = 0;
    else type = '';
    const slug = document.querySelector('#slug').value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/detail/debt/${slug}?type=${type}`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            let page = response.page;
            show(data, count, page);
        }
    };

    xhr.send();
}

function chooseMonney() {
    let minMonney = document.querySelector('#minMonney').value;
    let maxMonney = document.querySelector('#maxMonney').value;

    const slug = document.querySelector('#slug').value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/detail/debt/${slug}?minMonney=${minMonney}&maxMonney=${maxMonney}`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            let page = response.page;
            show(data, count, page);
        }
    };

    xhr.send();
}