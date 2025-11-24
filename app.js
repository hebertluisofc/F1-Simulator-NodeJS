const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const { testConnection } = require('./models/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8081;

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static
app.use(express.static('public'));

// Handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Rotas básicas
app.get('/', (req, res) => {
    res.render('index', { mensagem: "Bem-vindo ao Blog de F1!" });
});

app.get('/postagens', (req, res) => {
    res.send('Lista de postagens (em breve com dados do banco)');
});

app.get('/nova', (req, res) => {
    res.render('form');
});

app.post('/add', (req, res) => {
    res.send('Recebendo dados do formulário (CRUD ainda não implementado)');
});

app.get('/testdb', async (req, res) => {
    const conectado = await testConnection();
    res.send(conectado ? 'Conexão OK!' : 'Falha na conexão!');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
