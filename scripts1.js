document.addEventListener("DOMContentLoaded", function () {
    console.log("JS загружен!"); // Проверка загрузки

    // ======== Очищаем меню перед добавлением новых пунктов ========
    let menu = document.getElementById("top-list"); // Боковое меню
    if (menu) {
        menu.innerHTML = ""; // Удаляем все пункты перед рендерингом
    }

    // ======== Ограничиваем поиск ТОПов только текущей страницей ========
    let sushiBlocks = document.querySelectorAll(".sushi-ranking");

    sushiBlocks.forEach((block, index) => {
        let rank = index + 1; // Генерируем ТОП-номер
        block.setAttribute("data-rank", rank); // Проставляем атрибут data-rank="X"
        
        let label = block.querySelector(".rank-label"); 
        if (label) {
            label.textContent = `Топ ${rank}`; // Проставляем текст в метку
        }

        // ======== Добавляем пункт меню ТОЛЬКО из текущего файла ========
        if (menu) {
            let blockId = `top-${rank}`;
            block.setAttribute("id", blockId); // Добавляем ID к каждому ТОП-у

            let menuItem = document.createElement("li");
            let menuLink = document.createElement("a");
            menuLink.href = `#${blockId}`; // Привязываем к ID
            menuLink.textContent = `Топ ${rank} - ${block.querySelector("h2").textContent}`;

            // Обработчик клика с плавной прокруткой и отступом
            menuLink.addEventListener("click", function (e) {
                e.preventDefault(); // Отменяем стандартное поведение

                let headerHeight = document.querySelector(".top-nav").offsetHeight || 60; // Высота верхнего меню
                let offset = headerHeight + 20; // Отступ сверху

                window.scrollTo({
                    top: document.getElementById(blockId).getBoundingClientRect().top + window.scrollY - offset,
                    behavior: "smooth"
                });
            });

            menuItem.appendChild(menuLink);
            menu.appendChild(menuItem);
        }
    });

    // ======== Логика бургер-меню и закрытия сайдбара ========
    let sidebar = document.querySelector(".sidebar");
    let burgerMenu = document.querySelector(".burger-menu");
    let closeBtn = document.querySelector(".close-btn");

    if (burgerMenu && sidebar) {
        // Открытие меню при клике на бургер
        burgerMenu.addEventListener("click", function (event) {
            event.stopPropagation();
            sidebar.classList.add("active");
        });

        // Закрытие меню при клике вне его или на крестик
        document.addEventListener("click", function (event) {
            if (!sidebar.contains(event.target) && !burgerMenu.contains(event.target)) {
                sidebar.classList.remove("active");
            }
        });

        // Закрытие меню при клике на крестик
        if (closeBtn) {
            closeBtn.addEventListener("click", function () {
                sidebar.classList.remove("active");
            });
        }
    }

    // ======== Аккордеон FAQ (исправленный вариант) ========
    let faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        let question = item.querySelector(".faq-question");

        question.addEventListener("click", function () {
            item.classList.toggle("active"); // Переключаем класс active
        });
    });

});

// === COOKIE-УВЕДОМЛЕНИЕ ===
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("cookieAccepted")) return;

  const notice = document.createElement("div");
  notice.className = "cookie-notice";
  notice.innerHTML = `
    <p>
      Сайт использует файлы cookie, что позволяет получать информацию о вас. Это нужно, чтобы улучшать сайт. Продолжая пользоваться сайтом, вы соглашаетесь с использованием cookie и передачей данных сторонним партнёрам.
      <a href="/privacy.html" target="_blank">Подробнее о политике конфиденциальности</a>.
    </p>
    <button id="cookieAccept">ОК</button>
  `;
  document.body.appendChild(notice);

  const acceptBtn = document.getElementById("cookieAccept");
  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookieAccepted", "true");
    notice.remove();
  });
});

