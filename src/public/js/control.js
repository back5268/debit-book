var sort = 8;
var page = Number(document.querySelector('#currentPage').value);

function showControl(data, count, page) {
    let tbody = document.querySelector('tbody');
    let perPage = Number(document.querySelector('#perPage').value);
    tbody.innerHTML = '';
    for (let [index, { account, email, createAt, lastLogin }] of data.entries()) {
        let row = tbody.insertRow();
        row.insertCell().innerHTML = index + 1 + (page - 1) * perPage;
        row.insertCell().innerHTML = account;
        row.insertCell().innerHTML = email;
        row.insertCell().innerHTML = dateTimeHelper(createAt);
        row.insertCell().innerHTML = dateTimeHelper(lastLogin);
        let actionTable =  row.insertCell(); 
        actionTable.classList.add('actionTable');
        actionTable.innerHTML = '';
    };
    formatPage(count, page);
};

function getFilterUser() {
    const account = document.querySelector('#accountFilter').value;
    const email = document.querySelector('#emailFilter').value;
    const minCreateAt = document.querySelector('#minCreateAt').value;
    const maxCreateAt = document.querySelector('#maxCreateAt').value;
    const minLastLogin = document.querySelector('#minLastLogin').value;
    const maxLastLogin = document.querySelector('#maxLastLogin').value;
    return { account, email, minCreateAt, maxCreateAt, minLastLogin, maxLastLogin };
};

function control() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/control/show`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            let page = response.page;
            showControl(data, count, page);
        };
    };
    xhr.send();
};

function filterControl(page, sort) {
    let { account, email, minCreateAt, maxCreateAt, minLastLogin, maxLastLogin } = getFilterUser();
    let perPage = Number(document.querySelector('#perPage').value);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${window.location.origin}/control/show/?account=${account}&email=${email}&minCreateAt=${minCreateAt}&maxCreateAt=${maxCreateAt}&minLastLogin=${minLastLogin}&maxLastLogin=${maxLastLogin}&page=${page}&perPage=${perPage}&sort=${sort}`);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            let data = response.data;
            let count = response.count;
            let page = response.page;
            showControl(data, count, page);
        };
    };
    xhr.send();
};

function clearFilter() {
    document.querySelector('#accountFilter').value = '';
    document.querySelector('#emailFilter').value = '';
    document.querySelector('#minCreateAt').value = '';
    document.querySelector('#maxCreateAt').value = '';
    document.querySelector('#minLastLogin').value = '';
    document.querySelector('#maxLastLogin').value = '';
    filterControl(1, sort);
};

function handlefilterControl() {
    filterControl(1, sort);
};

function prevPageControl() {
    let page = prevPage();
    filterControl(page, sort);
};

function nextPageControl() {
    let page = nextPage();
    filterControl(page, sort);
};

function choosePageControl() {
    let page = choosePage();
    filterControl(page, sort);
};

function sortByAccountAsc() {
    sort = 1;
    filterControl(page, sort);
};

function sortByAccountDesc() {
    sort = 2;
    filterControl(page, sort);
};

function sortByEmailAsc() {
    sort = 3;
    filterControl(page, sort);
};

function sortByEmailDesc() {
    sort = 4;
    filterControl(page, sort);
};

function sortByCreateAtAsc() {
    sort = 5;
    filterControl(page, sort);
};

function sortByCreateAtDesc() {
    sort = 6;
    filterControl(page, sort);
};

function sortByLastLoginAsc() {
    sort = 7;
    filterControl(page, sort);
};

function sortByLastLoginDesc() {
    sort = 8;
    filterControl(page, sort);
};