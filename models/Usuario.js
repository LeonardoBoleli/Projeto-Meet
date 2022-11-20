const Sequelize = require('sequelize');
const db = require('./db');

const Usuario = db.define('Usuario', {
    id_usuario: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome_completo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    foto_perfil: {
        type: Sequelize.BLOB
    }
},
    {
        tableName: "Usuarios"
    }
);


//Criar tabela Usuarios
Usuario.sync();  //o método sync só cria a tabela se não existir 

module.exports = Usuario;