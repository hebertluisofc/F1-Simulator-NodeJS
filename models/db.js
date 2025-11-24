const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados MySQL realizada com sucesso!');
        return true;
    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
        return false;
    }
}

module.exports = { sequelize, testConnection };
