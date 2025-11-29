// ==============================
// app.js - Blog de F1
// ==============================

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const { sequelize, testConnection } = require('./models/db');
const Post = require('./models/post');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8081;

// ==============================
// API de classificação F1 (pilotos e construtores)
// ==============================
const f1api = require('./services/f1api');
app.use(f1api);

// ==============================
// Postagens Estáticas Fixas
// ==============================
const staticPosts = [
    {
        titulo: "Ferrari confirma atualização agressiva para 2025",
        autor: "Equipe F1 News",
        conteudo: "A Ferrari anunciou um novo conceito aerodinâmico para a temporada de 2025, com foco no desempenho em curvas de alta e melhor gestão de pneus."
    },
    {
        titulo: "Mercedes aposta em pacote revolucionário",
        autor: "Equipe F1 News",
        conteudo: "Segundo a equipe, o novo carro representa o maior avanço estrutural desde o início da era do efeito solo, mirando forte recuperação em 2025."
    },
    {
        titulo: "Lando Norris renova com a McLaren até 2029",
        autor: "Equipe F1 News",
        conteudo: "A McLaren anunciou a renovação contratual de Lando Norris, reforçando o projeto de longo prazo e encerrando rumores envolvendo outras equipes."
    },
    {
        titulo: "Calendário 2025 da F1 tem alterações importantes",
        autor: "Equipe F1 News",
        conteudo: "A FIA confirmou realocação de datas e ajustes logísticos no calendário 2025, reduzindo o desgaste operacional entre etapas distantes."
    }
];

// ==============================
// Configurações do Express
// ==============================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// ==============================
// Handlebars
// ==============================
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// ==============================
// Sincronizar banco de dados
// ==============================
sequelize.sync()
    .then(() => console.log("Banco de dados sincronizado"))
    .catch(err => console.error("Erro ao sincronizar banco:", err));

// ==============================
// Rotas
// ==============================

// Página inicial – últimas 3 postagens + fixas
app.get('/', async (req, res) => {
    try {
        const postsData = await Post.findAll({
            limit: 3,
            order: [['createdAt', 'DESC']]
        });

        const posts = postsData.map(post => post.toJSON());

        // Misturar estáticos + do banco
        const allPosts = [...staticPosts, ...posts];

        res.render('index', { posts: allPosts });
    } catch (error) {
        console.error(error);
        res.render('index', { mensagem: "Bem-vindo ao Blog de F1!" });
    }
});

// Página de listagem – todas as postagens + fixas
app.get('/postagens', async (req, res) => {
    try {
        const postsData = await Post.findAll({ order: [['createdAt', 'DESC']] });

        const posts = postsData.map(post => post.toJSON());

        // Misturar estáticos + banco
        const allPosts = [...staticPosts, ...posts];

        res.render('postagens', { posts: allPosts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao listar postagens');
    }
});

// Exibir formulário de nova postagem
app.get('/nova', (req, res) => {
    res.render('form');
});

// Receber dados do formulário e salvar (CREATE)
app.post('/add', async (req, res) => {
    const { titulo, conteudo, autor } = req.body;

    try {
        await Post.create({ titulo, conteudo, autor });
        res.redirect('/postagens');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao salvar a postagem');
    }
});

// Exibir formulário para editar postagem (UPDATE)
app.get('/editar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const postData = await Post.findByPk(id);
        if (!postData) return res.status(404).send('Postagem não encontrada');

        const post = postData.toJSON();
        res.render('form', { post }); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar postagem');
    }
});

// Receber dados atualizados do formulário (UPDATE)
app.post('/editar/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, conteudo, autor } = req.body;

    try {
        await Post.update(
            { titulo, conteudo, autor },
            { where: { id } }
        );
        res.redirect('/postagens');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar postagem');
    }
});

// Deletar postagem (DELETE)
app.get('/deletar/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Post.destroy({ where: { id } });
        res.redirect('/postagens');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao deletar postagem');
    }
});

// Testar conexão com o banco
app.get('/testdb', async (req, res) => {
    const conectado = await testConnection();
    res.send(conectado ? 'Conexão OK!' : 'Falha na conexão!');
});

// ==============================
// Iniciar servidor
// ==============================
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
