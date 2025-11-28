const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

// URLS
const URL_PILOTOS = 'https://www.espn.com.br/f1/classificacao';
const URL_CONSTRUTORES = 'https://www.espn.com.br/f1/classificacao/_/grupo/constructores';

async function fetchPilotos() {
    const { data } = await axios.get(URL_PILOTOS);
    const $ = cheerio.load(data);

    const pilotos = [];

    $('table tbody tr').each((i, el) => {
        if (pilotos.length >= 20) return;

        const tds = $(el).find('td');

        const posicao = $(tds[0]).text().trim();
        let numero = "";
        let nome = "";

        const nomeFull = $(tds[1]).text().trim().split(" ");
        numero = nomeFull.shift();        // primeiro item é o número do carro
        nome = nomeFull.join(" ");        // o restante é o nome do piloto

        const equipe = $(tds[2]).text().trim();
        const pontos = $(tds[tds.length - 1]).text().trim();

        pilotos.push({
            nomeFormatado: `${posicao} ${nome} - ${pontos} pts`,
        });
    });

    return pilotos;
}

async function fetchConstrutores() {
    const { data } = await axios.get(URL_CONSTRUTORES);
    const $ = cheerio.load(data);

    const construtores = [];

    $('table tbody tr').each((i, el) => {
        if (construtores.length >= 10) return;

        const tds = $(el).find('td');
        const posicao = $(tds[0]).text().trim();
        const nome = $(tds[1]).text().trim();
        const pontos = $(tds[tds.length - 1]).text().trim();

        construtores.push({
            nomeFormatado: `${posicao}. ${nome} - ${pontos} pts`,
        });
    });

    return construtores;
}

// Rota para pilotos
router.get('/api/standings/pilotos', async (req, res) => {
    try {
        const pilotos = await fetchPilotos();
        res.json({ pilotos });
    } catch (error) {
        console.error('Erro fetch pilotos', error);
        res.status(500).json({ error: 'Erro ao obter classificação de pilotos' });
    }
});

// Rota para construtores
router.get('/api/standings/construtores', async (req, res) => {
    try {
        const construtores = await fetchConstrutores();
        res.json({ construtores });
    } catch (error) {
        console.error('Erro fetch construtores', error);
        res.status(500).json({ error: 'Erro ao obter classificação de construtores' });
    }
});

module.exports = router;
