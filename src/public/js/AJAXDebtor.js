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

function showDebtor(data, count, page) {
    let perPage = Number(document.querySelector('#perPage').value);
    let pages = Math.ceil(count / perPage);
    pages = (pages === 0) ? 1 : pages;
    document.querySelector('#cards').innerHTML = '';
    for (let { stt, fullname, createAt, updateAt, email, phone, address, totalDebts, slug } of data) {
        createAt = dateTimeHelper(createAt);
        updateAt = dateTimeHelper(updateAt);
        totalDebts = formatMonney(totalDebts);
        let card = `<div class="col-sm-6 col-lg-4">
                    <div class="card card-link">
                    <a href="finance/detail/${slug}">
                        <div class="card-body">
                        <h5 class="card-title">${stt}. ${fullname}</h5>
                        <div class="row">
                            <div class="col-sm-4 card-text">Ngày tạo:</div>
                            <div class="col-sm-8 card-text">${createAt}</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-4 card-text">Cập nhật:</div>
                            <div class="col-sm-8 card-text">${updateAt}</div>
                        </div>
                        </div>
                        <div class="card-body card-body-hover">
                        <h5 class="card-title">${stt}. ${fullname}</h5>
                        <div class="row">
                            <div class="col-sm-3 card-text">SĐT:</div>
                            <div class="col-sm-9 card-text">${phone}</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-3 card-text">Email:</div>
                            <div class="col-sm-9 card-text">${email}</div>
                        </div>
                        <div class="row">
                            <div class="col-sm-3 card-text">Địa chỉ:</div>
                            <div class="col-sm-9 card-text">${address}</div>
                        </div>
                        </div>
                        <div class="card-footer">
                        <h5>Tổng nợ:</h5>
                        <h5>${totalDebts}</h5>
                        </div>
                    </a>
                    </div>
                </div>`
        document.querySelector('#cards').innerHTML = document.querySelector('#cards').innerHTML + card;
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

function getOptionsDebtor() {
    const name = document.querySelector('#nameFilter').value;
    const address = document.querySelector('#addressFilter').value;
    const phone = document.querySelector('#phoneFilter').value;
    const email = document.querySelector('#emailFilter').value;
    const minMonney = document.querySelector('#minMonney').value;
    const maxMonney = document.querySelector('#maxMonney').value;
    const minUpdateAt = document.querySelector('#minUpdateAt').value;
    const maxUpdateAt = document.querySelector('#maxUpdateAt').value;
    const minCreateAt = document.querySelector('#minCreateAt').value;
    const maxCreateAt = document.querySelector('#maxCreateAt').value;
    const perPage = document.querySelector('#perPage').value;
    return { name, address, phone, email, minMonney, maxMonney, minCreateAt, maxCreateAt, minUpdateAt, maxUpdateAt, perPage };
}

function debtor() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/debtors`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            let page = response.page;
            showDebtor(data, count, page);
        }
    };

    xhr.send();
}

function filterDebtor(page) {
    let { name, address, phone, email, minMonney, maxMonney, minCreateAt, maxCreateAt, minUpdateAt, maxUpdateAt, perPage } = getOptionsDebtor();
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/debtors/?name=${name}&address=${address}&phone=${phone}&email=${email}&minMonney=${minMonney}&maxMonney=${maxMonney}&minCreateAt=${minCreateAt}&maxCreateAt=${maxCreateAt}&minUpdateAt=${minUpdateAt}&maxUpdateAt=${maxUpdateAt}&perPage=${perPage}&page=${page}`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            let page = response.page;
            showDebtor(data, count, page);
        }
    };

    xhr.send();
}

function clearFilterDebtor() {
    document.querySelector('#nameFilter').value = '';
    document.querySelector('#addressFilter').value = '';
    document.querySelector('#phoneFilter').value = '';
    document.querySelector('#emailFilter').value = '';
    document.querySelector('#minMonney').value = '';
    document.querySelector('#maxMonney').value = '';
    document.querySelector('#minUpdateAt').value = '';
    document.querySelector('#maxUpdateAt').value = '';
    document.querySelector('#minCreateAt').value = '';
    document.querySelector('#maxCreateAt').value = '';
    filterDebtor();
}

function prePageDebtor() {
    let page = Number(document.querySelector('#currentPage').value);
    page = (page === 1) ? 1 : (page - 1);
    filterDebtor(page);
}

function nextPageDebtor() {
    let page = Number(document.querySelector('#currentPage').value);
    let pages = Number(document.querySelector('#pages').innerHTML);
    page = (page === pages) ? pages : (page + 1);
    filterDebtor(page);
}

function choosePageDebtor() {
    let page = Number(document.querySelector('#currentPage').value);
    let pages = Number(document.querySelector('#pages').innerHTML);
    if (page >= pages) page = pages;
    if (page <= 1) page = 1;
    filterDebtor(page);
}

function addDebtor() {
    const fullname = document.querySelector('#fullname').value;
    const phone = document.querySelector('#phone').value;
    const address = document.querySelector('#address').value;
    const email = document.querySelector('#email').value;
    const page = document.querySelector('#currentPage').value;
    const perPage = document.querySelector('#perPage').innerHTML;

    const data = { fullname, phone, address, email, page, perPage };
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${window.location.origin}/finance/createNewDebtor`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            alert('Thêm thông tin người nợ thành công!');
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            let page = response.page;
            showDebtor(data, count, page);
        }
    };

    xhr.send(JSON.stringify(data));

}

function updateDebtor() {
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
                alert(response.message);
            }
        };

        xhr.send(JSON.stringify(data));
    })
}