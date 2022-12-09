//Carregando módulos
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const db = require('./models/db'); //importando o arquivo db.js
const Usuario = require('./models/Usuario');  //Importando o arquivo Ususario.js
const Grupo = require('./models/Grupo');
const Mensagem = require('./models/Mensagem')
const { json } = require("body-parser");
const path = require('path');
const session = require('express-session');
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
let idgp = 0, nomegp = '';

//Configurações
// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Express
app.use(express.static("./www"));
//app.use(express.static(path.join(__dirname)));

//EJS
app.set('view engine', 'ejs'); /*template ejs */
app.set('views', './views');

//Session
app.use(session({
    secret: '123',
    secure: false,
    resave: false,
    saveUninitialized: false
}));


//Rotas
//Cadastro
app.post('/cadastrar', async (req, res) => {
    const userBanco = await Usuario.findOne({ where: { username: req.body.username } });
    const emailBanco = await Usuario.findOne({ where: { email: req.body.email } });
    if ((!userBanco) && (!emailBanco)) {
        const usuario = await Usuario.create({
            nome_completo: req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            senha: req.body.password
        });

        req.session.usuario = usuario;
        res.redirect('main');
    } else {
        console.log("usuario ja cadastrado");
        res.redirect('cadastrar.html');
        res.send("teste");
    }
})


//Login na plataforma
app.post('/logar', async (req, res) => {  /* redireciona para a pagina main */
    const usuario = await Usuario.findOne({ where: { username: req.body.username, senha: req.body.password } });
    if (usuario === null) {
        console.log('Usuário não encontrado!');
        res.redirect('cadastrar.html');
    } else {
        req.session.usuario = usuario;
        //console.log(req.session.usuario);
        res.redirect('main');
    }
});


//Web Socket
/*io.on('connection', (socket) => {
    console.log('connected');
    socket.on('chat_msg', async (msg, req, res) => {
        io.emit('chat_msg', msg);
        //let user = buscaUsuario(req, res);
        //console.log('user: ', user);
        usuario = req.session.usuario;
        const mensagem = await Mensagem.create({
            conteudo: msg,
            fk_remente: usuario.id_usuario,
            fk_grupo: 1
        });
    });


});*/

app.get('/main', async (req, res) => {
    if (req.session.usuario === null) {
        res.redirect('index.html');
    } else {
        const [tamanho, nome, id] = await buscaGrupos();
        res.render('main', { total: tamanho, nome: nome, id: id });
        //console.log(req.session.usuario);
    }
});

/*
app.post("/grupo", async (req, res) => {
    console.log("req: ", req.body.idgp);
    const grupo = await Grupo.findOne({ where: { id_grupo: req.body.idgp } });
    idgp = req.body.idgp;
    nomegp = grupo.nome_grupo;
    console.log("id:", idgp);
    console.log("nomegp:", nomegp);
    console.log("grupo:", grupo);

}) */

app.get("/chat", (req, res) => {

    //console.log("query: ", req.query.grupo);
    //console.log("id_grupo: ", req.query.id_grupo);
    let id_grupo = req.query.id_grupo;
    res.render('chat', { nomegp: req.query.grupo });
    
    io.on('connection', (socket) => {
        console.log('connected');
        
        let lista_msg = busca_msg().then((resultado) => {
            io.emit('mensagem_previa', resultado);
        });
        
        
        socket.on('chat_msg', async (msg) => {
            //io.emit('chat_msg', msg);
            io.emit("chat_msg", msg);
            let user = req.session.usuario;
            let id_user = user.id_usuario;
            //console.log('user: ', typeof user.id_usuario);
            
            const mensagem = await Mensagem.create({
                conteudo: msg,
                fk_remetente: id_user,
                fk_grupo: id_grupo
            });
        });
    });
});

//app.get("/chat/find", (req, res) => {
    //res.send();
//})

//Criação de grupos
app.post("/criar", (req, res) => {     //cria um novo grupo
    Grupo.create({
        nome_grupo: req.body.nomeGrupo
    })
        .then(async() => {
            console.log("Grupo criado!");
            const [tamanho, nome, id] = await buscaGrupos();
            res.redirect('main');
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Não foi possível criar grupo..."
            })
        })

})

//Pagina profile
app.get("/profile", async (req, res) => {
    if (req.session.usuario) {
        res.render('profile', { name: req.session.usuario.nome_completo, email: req.session.usuario.email, username: req.session.usuario.username });
    } else {
        res.redirect('index.html');
    }
})



//Destroy session
app.get('/destroy', (req, res) => {
    req.session.destroy(function () {
        res.render('destroy');
    });
});

    //Return Login
app.get('/retornar', (req, res) => {
    res.redirect('index.html');
})


server.listen(3000, () => {
    console.log('SERVIDOR RODANDO...\n');
})



//Funções 
async function buscaGrupos() {
    const grupos = await Grupo.findAll();
    let strGrupos = JSON.stringify(grupos);
    let jsonGrupos = JSON.parse(strGrupos);
    let nomes = [];
    let ids = [];

    for (let i = 0; i < jsonGrupos.length; i++) {
        nomes.push(jsonGrupos[i].nome_grupo);
        ids.push(jsonGrupos[i].id_grupo);
    }

    return [jsonGrupos.length, nomes, ids];
}

async function busca_msg() {
    const msgs = await Mensagem.findAll();
    let str_msg = JSON.stringify(msgs);
    let json_msg = JSON.parse(str_msg);
    let msg_content = [];

    for(let i = 0; i < json_msg.length; i++ ){
        msg_content.push(json_msg[i].conteudo);
    }

    return  msg_content
}

async function buscaUsuario(req, res){
    const user = req.session.usuario

    return user;
}