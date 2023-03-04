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

function showTrash(data, count) {
    document.querySelector('#accordion').innerHTML = '';
    document.querySelector('#totalRecord').innerHTML = count;
    for (let { _id, note, type, monney, timeDebt, deleteAt } of data) {
        monney = formatMonney(Number(monney));
        timeDebt = dateTimeHelper(timeDebt);
        deleteAt = dateTimeHelper(deleteAt);
        let card = `<div class="card">
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
                                <td>${ note }</td>
                                <td>${ timeDebt }</td>
                                <td>${ deleteAt }</td>
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
    const slug = document.querySelector('#nameDebtor').value;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/trash/${slug}`);
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