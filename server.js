const bodyParser = require("body-parser");
const express = require("express");
const server = express();
const db = require('./models/db'); //importando o arquivo db.js
const Usuario = require('./models/Usuario');  //Importando o arquivo Ususario.js
const Grupo = require('./models/Grupo');

server.use(bodyParser.urlencoded({extended:false}));
server.use(bodyParser.json());
server.use(express.static('D:/Léo/PUC/Projeto_Integrador'));

server.set('view engine', 'ejs'); /*template ejs */
server.set('views', './views');

let usuarios = [];

server.post('/cadastrar', async (req, res) => {
    const usuario = await Usuario.create({
        nome_completo: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        senha: req.body.password
    })
    .then(() => {
        res.redirect('principal.html');
    }).catch(() =>{
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário não cadastrado com sucesso..."
        })
    })
})
 

server.post('/main', function(req, res){   /* redireciona para a pagina main */
    console.log(req.body.usuario);
    console.log(req.body.senha);
    res.render('main', {total:2, grupos:[{nome: 'grupo1'}, {nome: 'grupo2'}]});
})

server.listen(3000, ()=>{
    console.log('SERVIDOR RODANDO...\n');
})
