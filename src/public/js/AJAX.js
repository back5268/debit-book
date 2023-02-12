document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const captcha = document.querySelector('#captcha').value;
    const data = { email, password, captcha };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${window.location.origin}/login`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            window.location.href = '/';
        } else {
            var response = JSON.parse(xhr.responseText);
            alert(response.error);
            window.location.href = '/';
        }
    };
    xhr.send(JSON.stringify(data));
});