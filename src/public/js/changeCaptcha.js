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