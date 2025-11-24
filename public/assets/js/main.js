// ==============================
// Animação de cards e sidebar
// ==============================

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    const sidebar = document.querySelector(".sidebar");

    // Efeito de fade-in para cada card
    cards.forEach((card, index) => {
        card.style.opacity = 0;
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
            card.style.transition = "all 0.6s ease-out";
            card.style.opacity = 1;
            card.style.transform = "translateY(0)";
        }, index * 150); // efeito cascata
    });

    // Efeito de slide-in para sidebar
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
