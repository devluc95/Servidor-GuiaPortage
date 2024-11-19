// db.js
const { Sequelize, DataTypes } = require('sequelize');

// Configura a conexão com o banco de dados PostgreSQL
const sequelize = new Sequelize('bd_guiaportage', 'postgres', '12345', {
  host: 'localhost',
  dialect: 'postgres',
});

const Usuario = sequelize.define('Usuarios', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    senha: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

}, {
    tableName: 'tb_usuario', // Nome da tabela no banco de dados
    timestamps: false, // Desabilita timestamps automáticos (createdAt, updatedAt)
});


const Aluno = sequelize.define('Alunos', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    sexo: {
        type: DataTypes.CHAR(2),
        allowNull: false,
    },
    data_nasc: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    data_avali: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

}, {
    tableName: 'tb_aluno', // Nome da tabela no banco de dados
    timestamps: false, // Desabilita timestamps automáticos (createdAt, updatedAt)
});


// Sincroniza o modelo com o banco de dados
sequelize.sync()
  .then(() => {
    console.log('Tabela sincronizada com o banco de dados.');
  })
  .catch(error => {
    console.error('Erro ao sincronizar a tabela:', error);
  });

module.exports = { Usuario, Aluno, sequelize };
