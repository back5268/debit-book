var sortTrash;

function showTrash(data, count) {
    document.querySelector('#totalRecord').innerHTML = count;
    let tbody = document.querySelector('tbody');

    tbody.innerHTML = '';
    if (!data.length) {
        tbody.innerHTML = '<h5>Chưa có khoản nợ nào được tạo!</h5>';
    }

    for (let { _id, note, type, monney, timeDebt, createAt, deleteAt } of data) {
        monney = formatMonney(Number(monney));
        timeDebt = dateTimeHelper(timeDebt);
        createAt = dateTimeHelper(createAt);
        deleteAt = dateTimeHelper(deleteAt);
        let row = tbody.insertRow();
        row.insertCell().innerHTML = 1;
        row.insertCell().innerHTML = note;
        row.insertCell().innerHTML = type;
        row.insertCell().innerHTML = monney;
        row.insertCell().innerHTML = timeDebt;
        row.insertCell().innerHTML = createAt;
        row.insertCell().innerHTML = deleteAt;
        row.insertCell().innerHTML = `<button type="button" class="btn btn-info" data-toggle="modal" data-target="#restoreDebt" data-id="${_id}"> Khôi phục</button>`;
    }
}

function trash(sort) {
    const slug = document.querySelector('#nameDebtor').value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/trash/${slug}/?sort=${sort}`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            showTrash(data, count);
        }
    };

    xhr.send();
}

function handleTrash() {
    trash(sortTrash);
}

function restoreDebt(sort) {
    var debtId;

    $('#restoreDebt').on('show.bs.modal', event => {
        var button = $(event.relatedTarget);
        debtId = button.data('id');
      });

    document.getElementById("restoreDebtBtn").addEventListener("click", () => {
        const data = { debtId };
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/finance/debt/restore/?sort=${sort}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                alert('Khôi phục khoản nợ thành công!');
                let data = response.data;
                let count = response.count;
                showTrash(data, count);
            }
        };

        xhr.send(JSON.stringify(data));
    })
}

function handleRestoreDebt() {
    restoreDebt(sortTrash);
}

function sortByNoteTrashAsc() {
    sortTrash = 1;
    trash(sortTrash);
}

function sortByNoteTrashDesc() {
    sortTrash = 2;
    trash(sortTrash);
}

function sortByTypeTrashAsc() {
    sortTrash = 3;
    trash(sortTrash);
}

function sortByTypeTrashDesc() {
    sortTrash = 4;
    trash(sortTrash);
}

function sortByMonneyTrashAsc() {
    sortTrash = 5;
    trash(sortTrash);
}

function sortByMonneyTrashDesc() {
    sortTrash = 6;
    trash(sortTrash);
}

function sortByTimeDebtTrashAsc() {
    sortTrash = 7;
    trash(sortTrash);
}

function sortByTimeDebtTrashDesc() {
    sortTrash = 8;
    trash(sortTrash);
}

function sortByCreateAtTrashAsc() {
    sortTrash = 9;
    trash(sortTrash);
}

function sortByCreateAtTrashDesc() {
    sortTrash = 10;
    trash(sortTrash);
}

function sortByDeleteAtTrashAsc() {
    sortTrash = 11;
    trash(sortTrash);
}

function sortByDeleteAtTrashDesc() {
    sortTrash = 12;
    trash(sortTrash);
}