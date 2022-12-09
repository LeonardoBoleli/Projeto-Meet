const Sequelize = require('sequelize');
const db = require('./db');
const Usuario = require('./Usuario');
const Grupo = require('./Grupo')

const Mensagem = db.define('Mensagem', {
    id_mensagem: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    conteudo: {
        type: Sequelize.STRING,
        allowNull: false
    },

    fk_remetente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id_usuario'
          }
    },

    fk_grupo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Grupo,
            key: 'id_grupo'
        }
    }
},
    {
        tableName: "Mensagens"
    }
);

//Criar tabela Grupos
Mensagem.sync();  //o método sync só cria a tabela se não existir 

/Grupo.sync({alter: true});/
module.exports = Mensagem;