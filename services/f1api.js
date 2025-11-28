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
        if (i >= 20) return; // 🔥 LIMITE DE 20 PILOTOS

        const tds = $(el).find('td');
        const posicao = $(tds[0]).text().trim();
        const nomeFull = $(tds[1]).text().trim();
        const nome = nomeFull;
        const equipe = $(tds[2]).text().trim();
        const pontos = $(tds[tds.length - 1]).text().trim();

        pilotos.push({
            posicao: parseInt(posicao),
            nome,
            equipe,
            pontos: parseInt(pontos)
        });
    });

    return pilotos;
}

async function fetchConstrutores() {
    const { data } = await axios.get(URL_CONSTRUTORES);
    const $ = cheerio.load(data);

    const construtores = [];

    $('table tbody tr').each((i, el) => {
        if (i >= 10) return; // 🔥 LIMITE DE 10 EQUIPES

        const tds = $(el).find('td');
        const posicao = $(tds[0]).text().trim();
        const nome = $(tds[1]).text().trim();
        const pontos = $(tds[tds.length - 1]).text().trim();

        construtores.push({
            posicao: parseInt(posicao),
            nome,
            pontos: parseInt(pontos)
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
