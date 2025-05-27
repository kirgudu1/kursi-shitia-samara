  document.addEventListener("DOMContentLoaded", function () {
    const today = new Date();
    const options = { day: 'numeric', month: 'long' };
    const formatted = today.toLocaleDateString('ru-RU', options);
    document.getElementById("today-date").textContent = formatted;
  });