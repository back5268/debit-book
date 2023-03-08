var sort = 9;
var page = Number(document.querySelector('#currentPage').value);

function showTrash(data, count, page) {
    let tbody = document.querySelector('tbody');
    let perPage = Number(document.querySelector('#perPage').value);
    tbody.innerHTML = '';
    document.querySelector('.center').innerHTML = '';
    if (!data.length) {
        document.querySelector('.center').style.display = 'block';
        document.querySelector('.center').innerHTML = 'Chưa có khoản nợ nào đã xóa!';
    };

    for (let [index, { _id, note, type, monney, timeDebt, createAt, deleteAt }] of data.entries()) {
        document.querySelector('.center').style.display = 'none';
        let row = tbody.insertRow();
        row.insertCell().innerHTML = index + 1 + (page - 1) * perPage;
        row.insertCell().innerHTML = note;
        row.insertCell().innerHTML = type;
        row.insertCell().innerHTML = formatMonney(Number(monney));
        row.insertCell().innerHTML = dateTimeHelper(timeDebt);
        row.insertCell().innerHTML = dateTimeHelper(createAt);
        row.insertCell().innerHTML = dateTimeHelper(deleteAt);
        let actionTable =  row.insertCell(); 
        actionTable.classList.add('actionTable');
        actionTable.innerHTML = `<button type="button" class="btn btn-info" data-toggle="modal" data-target="#restoreDebt" data-id="${_id}"> Khôi phục</button>`;
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
    const minDeleteAt = document.querySelector('#minDeleteAt').value;
    const maxDeleteAt = document.querySelector('#maxDeleteAt').value;
    return { note, type, minMonney, maxMonney, minCreateAt, maxCreateAt, minTimeDebt, maxTimeDebt, minDeleteAt, maxDeleteAt };
};

function trash() {
    const slug = document.querySelector('#nameDebtor').value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/trash/${slug}`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            let page = response.page;
            showTrash(data, count, page);
        };
    };
    xhr.send();
};

function filterTrash(page, sort) {
    let { note, type, minMonney, maxMonney, minCreateAt, maxCreateAt, minTimeDebt, maxTimeDebt, minDeleteAt, maxDeleteAt } = getFilterDebt();
    if (type === '+') type = 1;
    else if (type === '-') type = 0;
    else type = '';
    const slug = document.querySelector('#nameDebtor').value;
    let perPage = Number(document.getElementById('perPage').value);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/trash/${slug}/?note=${note}&type=${type}&minMonney=${minMonney}&maxMonney=${maxMonney}&minTimeDebt=${minTimeDebt}&maxTimeDebt=${maxTimeDebt}&minCreateAt=${minCreateAt}&maxCreateAt=${maxCreateAt}&minDeleteAt=${minDeleteAt}&maxDeleteAt=${maxDeleteAt}&page=${page}&perPage=${perPage}&sort=${sort}`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            let page = response.page;
            showTrash(data, count, page);
        };
    };
    xhr.send();
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
    document.querySelector('#minDeleteAt').value = '';
    document.querySelector('#maxDeleteAt').value = '';
    filterDebt(1, sort);
};

function handlefilterTrash() {
    filterTrash(1, sort);
};

function prevPageTrash() {
    let page = prevPage();
    filterTrash(page, sort);
};

function nextPageTrash() {
    let page = nextPage();
    filterTrash(page, sort);
};

function choosePageTrash() {
    let page = choosePage();
    filterTrash(page, sort);
};

function restoreDebt() {
    var debtId;

    $('#restoreDebt').on('show.bs.modal', event => {
        var button = $(event.relatedTarget);
        debtId = button.data('id');
    });

    document.querySelector('#restoreDebtBtn').addEventListener('click', () => {
        const data = { debtId };
        const perPage = Number(document.querySelector('#perPage').value);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/finance/trash/restore/?page=${page}&perPage=${perPage}&sort=${sort}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                alert('Khôi phục khoản nợ thành công!');
                let data = response.data;
                let count = response.count;
                let page = response.page;
                showTrash(data, count, page);
            };
        };
        xhr.send(JSON.stringify(data));
    });
};

function sortByNoteAsc() {
    sort = 1;
    filterTrash(page, sort);
};

function sortByNoteDesc() {
    sort = 2;
    filterTrash(page, sort);
};

function sortByTypeAsc() {
    sort = 3;
    filterTrash(page, sort);
};

function sortByTypeDesc() {
    sort = 4;
    filterTrash(page, sort);
};

function sortByMonneyAsc() {
    sort = 5;
    filterTrash(page, sort);
};

function sortByMonneyDesc() {
    sort = 6;
    filterTrash(page, sort);
};

function sortByTimeDebtAsc() {
    sort = 7;
    filterTrash(page, sort);
};

function sortByTimeDebtDesc() {
    sort = 8;
    filterTrash(page, sort);
};

function sortByCreateAtAsc() {
    sort = 9;
    filterTrash(page, sort);
};

function sortByCreateAtDesc() {
    sort = 10;
    filterTrash(page, sort);
};

function sortByDeleteAtAsc() {
    sort = 11;
    filterTrash(page, sort);
};

function sortByDeleteAtDesc() {
    sort = 12;
    filterTrash(page, sort);
};