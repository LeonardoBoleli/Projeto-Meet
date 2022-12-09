const Sequelize = require('sequelize');

const sequelize = new Sequelize("meet", "root", "123456", {
    host: 'localhost',
    dialect: 'mysql'
    //storage: './session.mysql'
});

sequelize.authenticate()  //se a funçao retornar True é pq conseguiu realizar a conexao
.then(function(){
    console.log("\nConexão realizada com sucesso!\n");
}).catch(function(){
    console.log("\nERRO: Conexão com DB não foi realizada com sucesso!\n");
});

module.exports = sequelize;