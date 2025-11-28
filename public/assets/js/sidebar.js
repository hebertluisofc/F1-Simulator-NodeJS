async function carregarSidebar() {
    try {
        // Fetch pilotos
        const resPilotos = await fetch('/api/standings/pilotos');
        const dataPilotos = await resPilotos.json();

        const listaPilotos = document.getElementById('listaPilotos');
        listaPilotos.innerHTML = "";

        dataPilotos.pilotos.forEach(p => {
            const li = document.createElement('li');
            li.textContent = p.nomeFormatado;
            listaPilotos.appendChild(li);
        });

        // Fetch construtores
        const resConstr = await fetch('/api/standings/construtores');
        const dataConstr = await resConstr.json();

        const listaEquipes = document.getElementById('listaEquipes');
        listaEquipes.innerHTML = "";

        dataConstr.construtores.forEach(c => {
            const li = document.createElement('li');
            li.textContent = c.nomeFormatado;
            listaEquipes.appendChild(li);
        });

    } catch (err) {
        console.error("Erro ao carregar sidebar", err);
    }
}

carregarSidebar();
