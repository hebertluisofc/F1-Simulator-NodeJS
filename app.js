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
        titulo: "Norris é o primeiro britânico campeão da McLaren desde Hamilton, em 2008",
        autor: "Equipe F1 News",
        conteudo: "Equipe inglesa não tinha um piloto conquistando o Mundial há 17 anos, quando Lewis superou Felipe Massa. Com o triunfo de domingo, Lando se torna terceiro nome do país a ganhar pela escuderia."
    },
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
    },
    {
        titulo: "Red Bull testa novo conceito de sidepods em Abu Dhabi",
        autor: "Equipe F1 News",
        conteudo: "A equipe austríaca avaliou uma versão refinada dos sidepods para 2025, buscando otimizar o fluxo de ar para o assoalho."
    },
    {
        titulo: "Hamilton elogia progresso da Mercedes: 'Estamos no caminho certo'",
        autor: "Equipe F1 News",
        conteudo: "Lewis Hamilton afirmou que o simulador já mostra ganhos consistentes com o carro de 2025 e se diz animado com o novo pacote."
    },
    {
        titulo: "McLaren estuda redução de peso para superar rivais",
        autor: "Equipe F1 News",
        conteudo: "O time laranja busca atingir o limite mínimo de peso com uso de novos materiais e simplificação de componentes internos."
    },
    {
        titulo: "Aston Martin foca em estabilidade traseira no AMR25",
        autor: "Equipe F1 News",
        conteudo: "Engenheiros revelam que a prioridade é corrigir o comportamento imprevisível em curvas de média velocidade."
    },
    {
        titulo: "Alpine muda direção técnica após temporada difícil",
        autor: "Equipe F1 News",
        conteudo: "A equipe francesa anunciou reestruturação profunda para 2025, incluindo novo chefe de aerodinâmica."
    },
    {
        titulo: "Williams investe pesado em túnel de vento",
        autor: "Equipe F1 News",
        conteudo: "O novo complexo tecnológico deve aumentar a capacidade de desenvolvimento aerodinâmico pela primeira vez em uma década."
    },
    {
        titulo: "Pirelli testa compostos experimentais para 2026",
        autor: "Equipe F1 News",
        conteudo: "Os novos pneus visam suportar o aumento de torque previsto com os motores híbridos da próxima era."
    },
    {
        titulo: "Audi avança no projeto do carro para estreia em 2026",
        autor: "Equipe F1 News",
        conteudo: "A equipe alemã confirmou que o chassi inicial já está em fase de validação estrutural."
    },
    {
        titulo: "FIA analisa ajustes no DRS para aumentar disputas",
        autor: "Equipe F1 News",
        conteudo: "Propostas incluem zonas mais longas e ativação mais flexível em determinadas curvas."
    },
    {
        titulo: "Haas aposta em abordagem conservadora para se recuperar",
        autor: "Equipe F1 News",
        conteudo: "O time americano decidiu concentrar recursos em confiabilidade e consistência de ritmo."
    },
    {
        titulo: "Ricciardo diz estar em sua melhor forma física",
        autor: "Equipe F1 News",
        conteudo: "O piloto afirma que a preparação para 2025 foi a mais intensa da carreira."
    },
    {
        titulo: "Tsotunoda impressiona AlphaTauri nos testes",
        autor: "Equipe F1 News",
        conteudo: "O japonês se destacou com telemetria consistente e excelentes tempos de simulação de corrida."
    },
    {
        titulo: "F1 anuncia melhorias no controle de limites de pista",
        autor: "Equipe F1 News",
        conteudo: "Novos sensores e sistemas de IA devem reduzir infrações e decisões controversas."
    },
    {
        titulo: "Novas regras de parc fermé entram em vigor",
        autor: "Equipe F1 News",
        conteudo: "Mudanças permitem pequenos ajustes após a classificação, aumentando a flexibilidade estratégica."
    },
    {
        titulo: "Brasil negocia segunda corrida de F1 no futuro",
        autor: "Equipe F1 News",
        conteudo: "Conversas incluem proposta para uma etapa no nordeste a partir de 2027."
    },
    {
        titulo: "F1 testa gráficos de realidade aumentada nas transmissões",
        autor: "Equipe F1 News",
        conteudo: "A novidade deve trazer indicadores de telemetria mais detalhados em tempo real."
    },
    {
        titulo: "Segurança dos cockpits receberá reforços em 2025",
        autor: "Equipe F1 News",
        conteudo: "Novos materiais absorventes de impacto devem ser obrigatórios a partir da próxima temporada."
    },
    {
        titulo: "Mercedes confirma evolução no sistema de resfriamento",
        autor: "Equipe F1 News",
        conteudo: "A solução permitirá trabalhar com janelas térmicas mais eficientes durante corridas quentes."
    },
    {
        titulo: "Red Bull: simulação indica ganho de 0.3s com novo assoalho",
        autor: "Equipe F1 News",
        conteudo: "Embora ainda não confirmado, o projeto promete aumento significativo de downforce."
    },
    {
        titulo: "AlphaTauri avalia mudança de identidade visual",
        autor: "Equipe F1 News",
        conteudo: "Rumores sugerem um visual mais próximo da Red Bull principal em 2025."
    },
    {
        titulo: "FIA intensifica testes contra porpoising para 2025",
        autor: "Equipe F1 News",
        conteudo: "Novas medições de oscilação vertical devem evitar problemas crônicos vistos em 2022."
    },
    {
        titulo: "McLaren considera mudança no design do volante",
        autor: "Equipe F1 News",
        conteudo: "O objetivo é melhorar ergonomia e reduzir fadiga em corridas longas."
    },
    {
        titulo: "Ferrari mira recorde de pit stops em 2025",
        autor: "Equipe F1 News",
        conteudo: "A equipe italiana estabeleceu meta agressiva de reduzir novamente seus tempos de parada."
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
        const allPosts = [...posts, ...staticPosts];

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
        const allPosts = [...posts, ...staticPosts];


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
