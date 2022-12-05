//Carregando módulos
const bodyParser = require("body-parser");
const express = require("express");
const server = express();
const db = require('./models/db'); //importando o arquivo db.js
const Usuario = require('./models/Usuario');  //Importando o arquivo Ususario.js
const Grupo = require('./models/Grupo');
const { json } = require("body-parser");
const path = require('path');
const session = require('express-session');



//Configurações
    // Body Parser
server.use(bodyParser.urlencoded({extended:false}));
server.use(bodyParser.json());

    //Express
server.use(express.static("./www"));

    //EJS
server.set('view engine', 'ejs'); /*template ejs */
server.set('views', './views');

    //Session
server.use(session({
    secret: '123',
    secure: false,
    resave: false,
    saveUninitialized: false
}));




//Rotas
    //Cadastro
server.post('/cadastrar', async (req, res) => {
    const usuario = await Usuario.create({
        nome_completo: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        senha: req.body.password
    });
    if(usuario){
        req.session.usuario = usuario;
        res.redirect('main');
    }else{
        prompt('Erro ao cadastrar!');
        res.redirect('cadastrar.html');
    }    
})


    //Login na plataforma
server.post('/logar',  async (req, res) => {  /* redireciona para a pagina main */
    const usuario = await Usuario.findOne({where: {username: req.body.username, senha: req.body.password}});
    if (usuario === null){
        console.log('Usuário não encontrado!');
        res.redirect('cadastrar.html');
    }else {
        req.session.usuario = usuario;
        res.redirect('main');
    }
})    

server.get('/main', async (req, res) => {
    if (req.session.usuario === null) {
        res.redirect('index.html');
    } else {
        const [tamanho, nome] = await buscaGrupos();
        res.render('main', {total: tamanho, nome: nome});
        console.log(req.session.usuario);
    }
});


    //Criação de grupos
server.post("/criar", (req, res) => {     //cria um novo grupo
    Grupo.create({
        nome_grupo: req.body.nomeGrupo
        })
        .then(() => {
            console.log("Grupo criado!");
            res.redirect('main');
        }).catch(() =>{
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Não foi possível criar grupo..."
            })
        })
    
})


server.get('/group/:id-group', (req, res) => {
    
})

    //Pagina profile
server.get("/profile", async (req, res) => {
    if (req.session.usuario){
        console.log('entrou');
        res.render('profile', {name: req.session.usuario.nome_completo, email: req.session.usuario.email, username: req.session.usuario.username});
    }else{
        res.redirect('index.html');
    }
})


    //Destroy session
server.get('/destroy', (req, res) => {
    req.session.destroy(function(){
        res.render('destroy');
    });
});

server.get('/retornar', (req, res) => {
    res.redirect('index.html');
})


server.listen(3000, ()=>{
    console.log('SERVIDOR RODANDO...\n');
})



//Funções 
async function buscaGrupos(){
    const grupos = await Grupo.findAll();
    strGrupos = JSON.stringify(grupos);
    let jsonGrupos = JSON.parse(strGrupos);
    let nomes = [];

    for (let i = 0; i < jsonGrupos.length; i++){
        nomes.push(jsonGrupos[i].nome_grupo);
    }

    return [jsonGrupos.length, nomes];
}