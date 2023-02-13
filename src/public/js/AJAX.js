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