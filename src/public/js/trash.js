var sortTrash;

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
        row.insertCell().innerHTML = `<button type="button" class="btn btn-info" data-toggle="modal" data-target="#restoreDebt" data-id="${_id}"> Khôi phục</button>`;
    }
    formatPage(count, page);
};

function trash(page, sort) {
    const slug = document.querySelector('#nameDebtor').value;
    const perPage = Number(document.querySelector('#perPage').value);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/trash/${slug}/?page=${page}&perPage=${perPage}&sort=${sort}`);
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

function handleTrash() {
    trash(1, sortTrash);
}

function prevPageTrash() {
    let page = Number(document.querySelector('#currentPage').value);
    page = (page === 1) ? 1 : (page - 1);
    trash(page, sortTrash);
}

function nextPageTrash() {
    let page = Number(document.querySelector('#currentPage').value);
    let pages = Number(document.querySelector('#pages').innerHTML);
    page = (page === pages) ? pages : (page + 1);
    trash(page, sortTrash);
}

function choosePageTrash() {
    let page = Number(document.querySelector('#currentPage').value);
    let pages = Number(document.querySelector('#pages').innerHTML);
    if (page >= pages) page = pages;
    if (page <= 1) page = 1;
    trash(page, sortTrash);
}

function restoreDebt(page, sort) {
    var debtId;

    $('#restoreDebt').on('show.bs.modal', event => {
        var button = $(event.relatedTarget);
        debtId = button.data('id');
    });

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
};

function handleRestoreDebt() {
    let page = Number(document.querySelector('#currentPage').value);
    restoreDebt(page, sortTrash);
};

function sortByNoteTrashAsc() {
    let page = Number(document.querySelector('#currentPage').value);
    sortTrash = 1;
    trash(page, sortTrash);
}

function sortByNoteTrashDesc() {
    let page = Number(document.querySelector('#currentPage').value);
    sortTrash = 2;
    trash(page, sortTrash);
}

function sortByTypeTrashAsc() {
    let page = Number(document.querySelector('#currentPage').value);
    sortTrash = 3;
    trash(page, sortTrash);
}

function sortByTypeTrashDesc() {
    let page = Number(document.querySelector('#currentPage').value);
    sortTrash = 4;
    trash(page, sortTrash);
}

function sortByMonneyTrashAsc() {
    let page = Number(document.querySelector('#currentPage').value);
    sortTrash = 5;
    trash(page, sortTrash);
}

function sortByMonneyTrashDesc() {
    let page = Number(document.querySelector('#currentPage').value);
    sortTrash = 6;
    trash(page, sortTrash);
}

function sortByTimeDebtTrashAsc() {
    let page = Number(document.querySelector('#currentPage').value);
    sortTrash = 7;
    trash(page, sortTrash);
}

function sortByTimeDebtTrashDesc() {
    let page = Number(document.querySelector('#currentPage').value);
    sortTrash = 8;
    trash(page, sortTrash);
}

function sortByCreateAtTrashAsc() {
    let page = Number(document.querySelector('#currentPage').value);
    sortTrash = 9;
    trash(page, sortTrash);
}

function sortByCreateAtTrashDesc() {
    let page = Number(document.querySelector('#currentPage').value);
    sortTrash = 10;
    trash(page, sortTrash);
}

function sortByDeleteAtTrashAsc() {
    let page = Number(document.querySelector('#currentPage').value);
    sortTrash = 11;
    trash(page, sortTrash);
}

function sortByDeleteAtTrashDesc() {
    let page = Number(document.querySelector('#currentPage').value);
    sortTrash = 12;
    trash(page, sortTrash);
}