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

// Página inicial - últimas 3 postagens
app.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({ 
            limit: 3, 
            order: [['createdAt', 'DESC']] 
        });
        res.render('index', { posts });
    } catch (error) {
        console.error(error);
        res.render('index', { mensagem: "Bem-vindo ao Blog de F1!" });
    }
});

// Listar todas postagens
app.get('/postagens', async (req, res) => {
    try {
        const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });
        res.render('postagens', { posts });
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

// Teste de conexão com o banco
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
