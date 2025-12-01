document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    const sidebar = document.querySelector(".sidebar");

    cards.forEach((card, index) => {
        card.style.opacity = 0;
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
            card.style.transition = "all 0.6s ease-out";
            card.style.opacity = 1;
            card.style.transform = "translateY(0)";
        }, index * 150);
    });

    if (sidebar) {
        sidebar.style.opacity = 0;
        sidebar.style.transform = "translateX(20px)";
        setTimeout(() => {
            sidebar.style.transition = "all 0.6s ease-out";
            sidebar.style.opacity = 1;
            sidebar.style.transform = "translateX(0)";
        }, 300);
    }
});

/* ============================================
   TEMA CLARO/ESCURO - F1 STYLE
============================================ */
const themeToggle = document.getElementById("themeToggle");

// Carregar tema salvo
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

// Atualizar estado visual do botão
updateToggleIcon(savedTheme);

// Clique para alternar temas
themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);

    updateToggleIcon(nextTheme);
});

// Atualiza animação dos ícones
function updateToggleIcon(theme) {
    if (theme === "dark") {
        themeToggle.classList.add("active");
    } else {
        themeToggle.classList.remove("active");
    }
}

