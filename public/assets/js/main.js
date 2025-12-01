// main.js - visual upgrades + mantém suas animações originais

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    const sidebar = document.querySelector(".sidebar");
    const telemetryItems = document.querySelectorAll(".telemetry-item");

    // Staggered card entrance (preserva a animação suave)
    cards.forEach((card, index) => {
        card.style.opacity = 0;
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
            card.style.transition = "all 0.6s cubic-bezier(.2,.9,.2,1)";
            card.style.opacity = 1;
            card.style.transform = "translateY(0)";
        }, index * 120);
    });

    // Sidebar slide
    if (sidebar) {
        sidebar.style.opacity = 0;
        sidebar.style.transform = "translateX(20px)";
        setTimeout(() => {
            sidebar.style.transition = "all 0.6s cubic-bezier(.2,.9,.2,1)";
            sidebar.style.opacity = 1;
            sidebar.style.transform = "translateX(0)";
        }, 300);
    }

    // Telemetry micro animations: subtle pulse loop
    telemetryItems.forEach((t, idx) => {
        t.style.opacity = 0;
        t.style.transform = "translateY(6px)";
        setTimeout(() => {
            t.style.transition = "all 650ms cubic-bezier(.2,.9,.2,1)";
            t.style.opacity = 1;
            t.style.transform = "translateY(0)";
        }, 200 + idx * 80);

        // gentle hover-like pulse every few seconds
        setInterval(() => {
            t.animate([
                { transform: 'translateY(0)', boxShadow: 'none' },
                { transform: 'translateY(-4px)', boxShadow: '0 10px 30px rgba(3,6,20,0.45)' },
                { transform: 'translateY(0)', boxShadow: 'none' }
            ], { duration: 2200 + idx * 200, iterations: 1, easing: 'cubic-bezier(.2,.9,.2,1)'});
        }, 6000 + (idx * 500));
    });

    // Hover interaction to create a racing glow on cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 26px 60px rgba(2,6,20,0.75)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });

    // "Start lights" blink sequence (visual only)
    const lights = document.querySelectorAll('.start-lights .light');
    if (lights.length) {
        // sequence: red red amber green
        let seq = [0,1,2,3];
        let i = 0;
        const blink = () => {
            lights.forEach((l, idx) => l.style.opacity = (idx === seq[i]) ? 1 : 0.35);
            i = (i + 1) % seq.length;
        };
        blink();
        setInterval(blink, 9000); // slow cycle for ambiance
    }
});

// ============================================
// TEMA CLARO/ESCURO - preservando sua lógica
// ============================================
const themeToggle = document.getElementById("themeToggle");

// Carregar tema salvo (padrão dark para identidade F1)
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

// Atualizar estado visual do botão
updateToggleIcon(savedTheme);

// Clique para alternar temas
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const nextTheme = currentTheme === "light" ? "dark" : "light";

        document.documentElement.setAttribute("data-theme", nextTheme);
        localStorage.setItem("theme", nextTheme);

        updateToggleIcon(nextTheme);
    });
}

function updateToggleIcon(theme) {
    if (!themeToggle) return;
    if (theme === "dark") {
        themeToggle.classList.add("active");
    } else {
        themeToggle.classList.remove("active");
    }
}

// Extra: botão de atualizar classificações na sidebar
document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('#refreshStand');
    if (!btn) return;
    btn.disabled = true;
    btn.textContent = 'Atualizando...';
    // chama a rota já existente via fetch para recarregar sidebar
    fetch('/api/standings/pilotos').then(r => r.json()).then(json => {
        // trigger sidebar.js carregar novamente (simples)
        if (window.carregarSidebar) {
            window.carregarSidebar();
        } else {
            // fallback: dispatch a custom event that sidebar.js can listen to
            document.dispatchEvent(new CustomEvent('reloadStandings', {detail: json}));
        }
    }).catch(()=> {
        console.warn('Erro ao atualizar');
    }).finally(()=> {
        setTimeout(()=> { btn.disabled = false; btn.textContent = 'Atualizar agora'; }, 900);
    });
});


// ============================
// ANIMAÇÃO DO SEMÁFORO F1
// ============================

function iniciarSemaforoF1() {
    const lights = document.querySelectorAll(".start-lights .light");
    if (!lights.length) return;

    // Reset
    lights.forEach(l => {
        l.classList.remove("on-red", "on-green");
    });

    let index = 0;

    // Acende vermelhos um por um
    const redInterval = setInterval(() => {
        if (index < 4) {
            lights[index].classList.add("on-red");
            index++;
        } else {
            clearInterval(redInterval);

            // Espera um pouco com todos vermelhos acesos
            setTimeout(() => {
                
                // Apaga todos
                lights.forEach(l => l.classList.remove("on-red"));

                // Liga verde final!
                setTimeout(() => {
                    lights[3].classList.add("on-green"); // último vira verde
                }, 300);

            }, 600);
        }
    }, 600);
}

// Executa animação ao carregar a página
window.addEventListener("load", () => {
    iniciarSemaforoF1();

    // Repetir a cada 15s (igual largada simulada)
    setInterval(iniciarSemaforoF1, 15000);
});
