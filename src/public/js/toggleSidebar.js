const sidebar = document.querySelector(".sidebar");
const header = document.querySelector(".header");
const toggle = document.querySelector(".toggle");

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    header.classList.toggle("active");
  })