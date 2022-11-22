const bodyParser = require("body-parser");
const express = require("express");
const server = express();
const db = require('./models/db'); //importando o arquivo db.js
const Usuario = require('./models/Usuario');  //Importando o arquivo Ususario.js
const Grupo = require('./models/Grupo');
const { json } = require("body-parser");
const path = require('path');

server.use(bodyParser.urlencoded({extended:false}));
server.use(bodyParser.json());
//server.use(express.static("www"));
//server.use(express.static("imagens"));
server.use(express.static(path.join(__dirname)));
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
        res.render('main');
    }).catch(() =>{
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário não cadastrado com sucesso..."
        })
    })
})


async function buscaGrupos(){
    const grupos = await Grupo.findAll();
    strGrupos = JSON.stringify(grupos);
    console.log("strGrupos: " + typeof strGrupos);
    var jsonGrupos = JSON.parse(strGrupos);
    console.log("jsonGrupos: " + jsonGrupos[1]);
    var nomes = [];

    for (let i = 0; i < jsonGrupos.length; i++){
        nomes.push(jsonGrupos[i].nome_grupo);
    }

    console.log("NOMES: " + nomes);

    return [jsonGrupos.length, nomes];
}

server.post('/main',  async (req, res) => {  /* redireciona para a pagina main */
   const [tamanho, nome] = await buscaGrupos();
   console.log("Nome: " + nome);
   res.render('main', {total: tamanho, nome: nome});
})

server.post("/criar", async(req, res) => {
    const grupo = await Grupo.create({
        nome_grupo: req.body.nomeGrupo
        })
        .then(() => {
            console.log("Grupo criado!")
        }).catch(() =>{
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Não foi possível criar grupo..."
            })
        })
})

server.listen(80, ()=>{
    console.log('SERVIDOR RODANDO...\n');
})
