const Sequelize = require('sequelize');
const db = require('./db');

const Grupo = db.define('Grupo', {
    id_grupo: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome_grupo: {
        type: Sequelize.STRING,
        allowNull: false
    }
},
    {
        tableName: "Grupos"
    }
);

//Criar tabela Grupos
Grupo.sync();  //o método sync só cria a tabela se não existir 

/*Grupo.sync({alter: true});*/
module.exports = Grupo;