function getSortTrash() {
    let sort = 1;
    let sortBy = Number(document.querySelector('#sortBy').value);
    let sortType = Number(document.querySelector('#sortType').value);
    if (sortBy === 1) {
        if (sortType === 1) sort = 1;
        else sort = 2;
    } else {
        if (sortType === 1) sort = 3;
        else sort = 4;
    }
    return sort;
}

function showTrash(data, count) {
    document.querySelector('#accordion').innerHTML = '';
    document.querySelector('#totalRecord').innerHTML = count;

    if (!data.length) {
        document.querySelector('#accordion').innerHTML = '<h1>Chưa có khoản nợ nào bị xóa!</h1>';
    }

    for (let { _id, note, type, monney, timeDebt, deleteAt } of data) {
        let card = '';
        monney = formatMonney(Number(monney));
        timeDebt = dateTimeHelper(timeDebt);
        deleteAt = dateTimeHelper(deleteAt);
        card = `<div class="card">
                    <div class="card-header" id="heading${_id}">
                    <h5>
                        <button class="btn btn-shows" data-toggle="collapse" data-target="#collapse${_id}">
                        Mã số phiếu nợ: ${_id}
                        </button>
                        <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#restoreDebt"
                        data-id="${_id}">
                        Khôi phục
                        </button>
                    </h5>
                    </div>
                    <div id="collapse${_id}" class="collapse">
                    <div class="container">
                        <div class="card-body">
                        <table class="table table-bordered">
                            <thead>
                            <tr>
                                <th scope="col">Số tiền</th>
                                <th scope="col">Ghi chú</th>
                                <th scope="col">Ngày lập phiếu</th>
                                <th scope="col">Ngày xóa phiếu</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>${type} ${monney}</td>
                                <td>${note}</td>
                                <td>${timeDebt}</td>
                                <td>${deleteAt}</td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>
                    </div>`
        document.querySelector('#accordion').innerHTML = document.querySelector('#accordion').innerHTML + card;
    }
}

function trash() {
    let sort = getSortTrash();
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

function restoreDebt() {
    var debtId;

    $('#restoreDebt').on('show.bs.modal', event => {
        var button = $(event.relatedTarget);
        debtId = button.data('id');
      });

    document.getElementById("restoreDebtBtn").addEventListener("click", () => {
        const data = { debtId };
        let sort = getSortTrash();
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