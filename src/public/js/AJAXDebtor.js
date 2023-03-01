function show(data, count, page) {
    let perPage = Number(document.querySelector('#perPage').value);
    let pages = Math.ceil(count / perPage);
    pages = (pages === 0) ? 1 : pages;
    for (let { stt, fullname, createAt, updateAt, email, phone, address, totalDebts } of data) {
        document.querySelector('#email').innerHTML = `${stt}. ${fullname}`;
        document.querySelector('#email').innerHTML = email;
        document.querySelector('#phone').innerHTML = phone;
        document.querySelector('#address').innerHTML = address;
        document.querySelector('#createAt').innerHTML = createAt;
        document.querySelector('#updateAt').innerHTML = updateAt;
        document.querySelector('#totalDebts').innerHTML = totalDebts;
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

function showDebt() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/finance/debtors`);
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

function addDebtor() {
    document.getElementById("addNewDebtor").addEventListener("click", function (event) {
        event.preventDefault();
        const fullname = document.querySelector('#fullnameAdd').value;
        const phone = document.querySelector('#phoneAdd').value;
        const address = document.querySelector('#addressAdd').value;
        const email = document.querySelector('#emailAdd').value;

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