var sort = 9;
var page = Number(document.querySelector('#currentPage').value);
var perPage = Number(document.getElementById('perPage').value);

function showDebt(data, count, page) {
    let tbody = document.querySelector('tbody');
    let perPage = Number(document.querySelector('#perPage').value);
    tbody.innerHTML = '';
    document.querySelector('.center').innerHTML = '';
    if (!data.length) {
        document.querySelector('.center').style.display = 'block';
        document.querySelector('.center').innerHTML = 'Chưa có khoản nợ nào đã xóa!';
    };

    for (let [index, { _id, note, type, monney, timeDebt, createAt }] of data.entries()) {
        document.querySelector('.center').style.display = 'none';
        let row = tbody.insertRow();
        row.insertCell().innerHTML = index + 1 + (page - 1) * perPage;
        row.insertCell().innerHTML = note;
        row.insertCell().innerHTML = type;
        row.insertCell().innerHTML = formatMonney(monney);
        row.insertCell().innerHTML = dateTimeHelper(timeDebt);
        row.insertCell().innerHTML = dateTimeHelper(createAt);
        row.insertCell().innerHTML = `<button type="button" class="btn btn-info detailDebtBtn" onclick="showDetailDebt()" data-toggle="modal" data-target="#detailDebt" data-note="${note}" data-type="${type}" data-monney="${monney}" data-time="${timeDebt}"> <i class="fa-solid fa-info"></i>Chi tiet</button>`;
        row.insertCell().innerHTML = `<button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteDebt" data-id="${_id}"> <i class="fa-sharp fa-solid fa-minus"></i> Xóa</button>`;
    }
    formatPage(count, page);
};

function getFilterDebt() {
    const note = document.querySelector('#noteFilter').value;
    const type = document.querySelector('#typeFilter').value;
    const minMonney = document.querySelector('#minMonney').value;
    const maxMonney = document.querySelector('#maxMonney').value;
    const minTimeDebt = document.querySelector('#minTimeDebt').value;
    const maxTimeDebt = document.querySelector('#maxTimeDebt').value;
    const minCreateAt = document.querySelector('#minCreateAt').value;
    const maxCreateAt = document.querySelector('#maxCreateAt').value;
    return { note, type, minMonney, maxMonney, minCreateAt, maxCreateAt, minTimeDebt, maxTimeDebt };
};

function debt() {
    const slug = document.querySelector('#slug').value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/debt/show/${slug}`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            let page = response.page;
            showDebt(data, count, page);
        };
    };
    xhr.send();
};

function filterDebt(page, sort) {
    let { note, type, minMonney, maxMonney, minCreateAt, maxCreateAt, minTimeDebt, maxTimeDebt } = getFilterDebt();
    if (type === '+') type = 1;
    else if (type === '-') type = 0;
    else type = '';
    const slug = document.querySelector('#slug').value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/debt/show/${slug}/?note=${note}&type=${type}&minMonney=${minMonney}&maxMonney=${maxMonney}&minTimeDebt=${minTimeDebt}&maxTimeDebt=${maxTimeDebt}&minCreateAt=${minCreateAt}&maxCreateAt=${maxCreateAt}&perPage=${perPage}&page=${page}&sort=${sort}`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            let page = response.page;
            showDebt(data, count, page);
        };
    };
    xhr.send();
};

function handleFilterDebt() {
    filterDebt(1, sort);
};

function clearFilter() {
    document.querySelector('#noteFilter').value = '';
    document.querySelector('#typeFilter').value = 'all';
    document.querySelector('#minMonney').value = '';
    document.querySelector('#maxMonney').value = '';
    document.querySelector('#minTimeDebt').value = '';
    document.querySelector('#maxTimeDebt').value = '';
    document.querySelector('#minCreateAt').value = '';
    document.querySelector('#maxCreateAt').value = '';
    filterDebt(1, sort);
};

function prevPageDebt() {
    let page = prevPage();
    filterDebt(page, sort);
};

function nextPageDebt() {
    let page = nextPage();
    filterDebt(page, sort);
};

function choosePageDebt() {
    let page = choosePage();
    filterDebt(page, sort);
};

function sortByNoteAsc() {
    sort = 1;
    filterDebt(page, sort);
};

function sortByNoteDesc() {
    sort = 2;
    filterDebt(page, sort);
};

function sortByTypeAsc() {
    sort = 3;
    filterDebt(page, sort);
};

function sortByTypeDesc() {
    sort = 4;
    filterDebt(page, sort);
};

function sortByMonneyAsc() {
    sort = 5;
    filterDebt(page, sort);
};

function sortByMonneyDesc() {
    sort = 6;
    filterDebt(page, sort);
};

function sortByTimeDebtAsc() {
    sort = 7;
    filterDebt(page, sort);
};

function sortByTimeDebtDesc() {
    sort = 8;
    filterDebt(page, sort);
};

function sortByCreateAtAsc() {
    sort = 9;
    filterDebt(page, sort);
};

function sortByCreateAtDesc() {
    sort = 10;
    filterDebt(page, sort);
};

function addDebt() {
    const debtorId = document.querySelector('#debtorId').value;
    const note = document.querySelector('#note').value;
    const type = document.querySelector('input[name="type"]:checked').value;
    const monney = document.querySelector('#monney').value;
    const timeDebt = document.querySelector('#timeDebt').value;

    const data = { debtorId, note, type, monney, timeDebt };
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${window.location.origin}/finance/debt/add/?page=${page}&perPage=${perPage}&sort=${sort}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            alert('Thêm thông tin khoản nợ thành công!');
            let data = response.data;
            let count = response.count;
            let page = response.page;
            showDebt(data, count, page);
        };
    };
    xhr.send(JSON.stringify(data));
};

function deleteDebt() {
    var debtId;
    $('#deleteDebt').on('show.bs.modal', event => {
        var button = $(event.relatedTarget);
        debtId = button.data('id');
    });
    document.querySelector('#deleteDebtBtn').addEventListener('click', () => {
        const data = { debtId };
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/finance/debt/delete/?page=${page}&perPage=${perPage}&sort=${sort}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                alert('Xóa thông tin khoản nợ thành công!');
                let data = response.data;
                let count = response.count;
                let page = response.page;
                showDebt(data, count, page);
            }
        };
        xhr.send(JSON.stringify(data));
    });
};

function showDetailDebt() {
    $('#detailDebt').on('show.bs.modal', event => {
        var button = $(event.relatedTarget);
        let note = button.data('note');
        let type = button.data('type');
        let monney = button.data('monney');
        let time = button.data('time');

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
        };
    });
};

function formatInfo() {
    const slug = document.querySelector('#slug').value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/debtor/${slug}`);
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
            document.querySelector('#textTotalDebts').innerHTML = convertMoneyToString(Math.abs(data.totalDebts));
        };
    };
    xhr.send();
};

function updateDebtor() {
    const debtorId = document.querySelector('#debtorId').value;
    const phone = document.querySelector('#phone').value;
    const email = document.querySelector('#email').value;
    const address = document.querySelector('#address').value;

    const data = { debtorId, phone, email, address };
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${window.location.origin}/finance/debtor/update`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            alert(response.message);
        };
    };
    xhr.send(JSON.stringify(data));
};