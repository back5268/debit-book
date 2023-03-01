function dateTimeHelper(time) {
    let date = new Date(time);
    let day = date.getDate();
    day = day < 10 ? '0' + day : day;
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let year = date.getFullYear();
    let hours = date.getHours();
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
    document.getElementById('totalRecord').textContent = count;

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

function getOptionsFilter() {
    const note = document.querySelector('#noteFilter').value;
    const type = document.querySelector('#typeFilter').value;
    const minMonney = document.querySelector('#minMonney').value;
    const maxMonney = document.querySelector('#maxMonney').value;
    const minTimeDebt = document.querySelector('#minTimeDebt').value;
    const maxTimeDebt = document.querySelector('#maxTimeDebt').value;
    const minTimeCreate = document.querySelector('#minTimeCreate').value;
    const maxTimeCreate = document.querySelector('#maxTimeCreate').value;
    const perPage = document.querySelector('#perPage').value;
    return { note, type, minMonney, maxMonney, minTimeCreate, maxTimeCreate, minTimeDebt, maxTimeDebt, perPage };
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

function filterDebt(page, sort) {
    let { note, type, minMonney, maxMonney, minTimeCreate, maxTimeCreate, minTimeDebt, maxTimeDebt, perPage } = getOptionsFilter();
    if (type === '+') type = 1;
    else if (type === '-') type = 0;
    else type = '';
    const slug = document.querySelector('#slug').value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/detail/debt/${slug}/?note=${note}&type=${type}&minMonney=${minMonney}&maxMonney=${maxMonney}&minTimeDebt=${minTimeDebt}&maxTimeDebt=${maxTimeDebt}&minTimeCreate=${minTimeCreate}&maxTimeCreate=${maxTimeCreate}&perPage=${perPage}&page=${page}&sort=${sort}`);
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

function clearFilter() {
    document.querySelector('#noteFilter').value = '';
    document.querySelector('#typeFilter').value = 'all';
    document.querySelector('#minMonney').value = '';
    document.querySelector('#maxMonney').value = '';
    document.querySelector('#minTimeDebt').value = '';
    document.querySelector('#maxTimeDebt').value = '';
    document.querySelector('#minTimeCreate').value = '';
    document.querySelector('#maxTimeCreate').value = '';
    filterDebt();
}

function prePage() {
    let page = Number(document.querySelector('#currentPage').value);
    page = (page === 1) ? 1 : (page - 1);
    filterDebt(page);
}

function nextPage() {
    let page = Number(document.querySelector('#currentPage').value);
    let pages = Number(document.querySelector('#pages').innerHTML);
    page = (page === pages) ? pages : (page + 1);
    filterDebt(page);
}

function choosePage() {
    let page = Number(document.querySelector('#currentPage').value);
    let pages = Number(document.querySelector('#pages').innerHTML);
    if (page >= pages) page = pages;
    if (page <= 1) page = 1;
    filterDebt(page);
}

function sortById() {
    let page = Number(document.querySelector('#currentPage').value);
    let sort = 1;
    filterDebt(page, sort);
}

function sortByNote() {
    let page = Number(document.querySelector('#currentPage').value);
    let sort = 2;
    filterDebt(page, sort);
}

function sortByType() {
    let page = Number(document.querySelector('#currentPage').value);
    let sort = 3;
    filterDebt(page, sort);
}

function sortByMonney() {
    let page = Number(document.querySelector('#currentPage').value);
    let sort = 4;
    filterDebt(page, sort);
}

function sortByTimeDebt() {
    let page = Number(document.querySelector('#currentPage').value);
    let sort = 5;
    filterDebt(page, sort);
}

function sortByCreateAt() {
    let page = Number(document.querySelector('#currentPage').value);
    let sort = 6;
    filterDebt(page, sort);
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

function deleteDebt() {
    var debtId;

    $('#deleteDebt').on('show.bs.modal', event => {
        var button = $(event.relatedTarget);
        debtId = button.data('id');
    })

    document.getElementById("deleteDebtBtn").addEventListener("click", function (event) {
        const perPage = document.getElementById('perPage').value;
        const data = { debtId };
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/finance/debt/delete/?perPage=${perPage}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                alert('Xóa thông tin khoản nợ thành công!');
                let data = response.data;
                let count = response.count;
                let page = response.page;
                show(data, count, page);
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

function formatInfo() {
    const slug = document.querySelector('#slug').value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/${slug}`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            document.querySelector('#fullname').value = data.fullname;
            document.querySelector('#email').value = data.email;
            document.querySelector('#phone').value = data.phone;
            document.querySelector('#address').value = data.address;
            document.querySelector('#createAt').value = dateTimeHelper(data.createAt);
            document.querySelector('#updateAt').value = dateTimeHelper(data.updateAt);
            document.querySelector('#totalDebts').value = formatMonney(data.totalDebts);
            document.querySelector('#text').innerHTML = convertMoneyToString(Math.abs(data.totalDebts));
        }
    };

    xhr.send();
}