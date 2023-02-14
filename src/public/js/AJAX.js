function handleLoginBtn() {
    document.getElementById("form-submit").addEventListener("click", function(event) {
        event.preventDefault();
        const account = document.querySelector('#account').value;
        const password = document.querySelector('#password').value;
        const captcha = document.querySelector('#captcha').value;
        const data = { account, password, captcha };

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
    })
}

function handleUpdateProfile() {
    document.getElementById("update-info").addEventListener("click", function(event) {
        event.preventDefault();
        const fullname = document.querySelector('#fullname').value;
        const phone = document.querySelector('#phone').value;
        const email = document.querySelector('#email').value;
        const address = document.querySelector('#address').value;
        const description = document.querySelector('#description').value;
        const userId = document.querySelector('#userId').value;

        const data = { fullname, phone, email, address, description, userId };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${window.location.origin}/updateUserInfo`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                alert(response.error);
                window.location.href = '/profile';
            } else {
                var response = JSON.parse(xhr.responseText);
                alert(response.error);
                window.location.href = '/profile';
            }
        };
        
        xhr.send(JSON.stringify(data));
    })
}

function changeCaptcha() {
    document.getElementById("change-captcha").addEventListener("click", function () {
        const xhr = new XMLHttpRequest(); 
        xhr.open("GET", "/newCaptcha", true);
        xhr.onload = function () {
            const response = JSON.parse(xhr.responseText);
            document.getElementById("captcha-img").src =
                `/captcha?text=${response.captcha}`;
            
        }; 
        xhr.send();
    });
}