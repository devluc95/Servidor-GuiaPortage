// bd.js
const { Sequelize, DataTypes } = require('sequelize');

// Configura a conexão com o banco de dados PostgreSQL
const sequelize = new Sequelize('bd_guiaportage', 'postgres', '12345', {
  host: 'localhost',
  dialect: 'postgres',
});

// Modelo para a tabela de usuários
const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    senha: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    data_criacao: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
}, {
    tableName: 'usuarios',
    timestamps: false,
});

// Modelo para a tabela de alunos
const Aluno = sequelize.define('Aluno', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    data_nascimento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    sexo: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        validate: {
            isIn: [['M', 'F']],
        },
    },
    data_criacao: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
}, {
    tableName: 'alunos',
    timestamps: false,
});

// Modelo para a tabela de áreas de conhecimento
const AreaConhecimento = sequelize.define('AreaConhecimento', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'areas_conhecimento',
    timestamps: false,
});

// Modelo para a tabela de perguntas
const Pergunta = sequelize.define('Pergunta', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_area: {
        type: DataTypes.INTEGER,
        references: {
            model: AreaConhecimento,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'perguntas',
    timestamps: false,
});

// Modelo para a tabela de opções de resposta
const OpcaoResposta = sequelize.define('OpcaoResposta', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    opcao: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
            isIn: [['sim', 'não', 'talvez']],
        },
    },
}, {
    tableName: 'opcoes_resposta',
    timestamps: false,
});

// Modelo para a tabela de respostas
const Resposta = sequelize.define('Resposta', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_aluno: {
        type: DataTypes.INTEGER,
        references: {
            model: Aluno,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    id_pergunta: {
        type: DataTypes.INTEGER,
        references: {
            model: Pergunta,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    id_opcao: {
        type: DataTypes.INTEGER,
        references: {
            model: OpcaoResposta,
            key: 'id',
        },
    },
    data_resposta: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
}, {
    tableName: 'respostas',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['id_aluno', 'id_pergunta'], // Impede respostas duplicadas para o mesmo aluno e pergunta
        },
    ],
});

// Sincroniza o modelo com o banco de dados
sequelize.sync()
  .then(() => {
    console.log('Tabelas sincronizadas com o banco de dados.');
  })
  .catch(error => {
    console.error('Erro ao sincronizar as tabelas:', error);
  });

module.exports = { Usuario, Aluno, AreaConhecimento, Pergunta, OpcaoResposta, Resposta, sequelize };
