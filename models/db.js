const Sequelize = require('sequelize');

const sequelize = new Sequelize("meet", "meetAdmin", "ABcdef@122133", {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()  //se a funçao retornar True é pq conseguiu realizar a conexao
.then(function(){
    console.log("\nConexão realizada com sucesso!\n");
}).catch(function(){
    console.log("\nERRO: Conexão com DB não foi realizada com sucesso!\n");
});

module.exports = sequelize;