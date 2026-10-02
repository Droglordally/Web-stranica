const button = document.getElementById("colorBtn");
const message = document.getElementById("message");

button.addEventListener("click", function () {
  document.body.style.background = "#ffe8cc";
  message.textContent = "You clicked the button!";
});