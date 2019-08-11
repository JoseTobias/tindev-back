const express = require('express');

// Fazer interacao com o banco de dados
const mongoose = require('mongoose');

// Cross Origin Resource Sharing permite solicitacoes AJAX e envia resposta HTTP
const cors = require('cors');

// Arquivo de rotas para 
const routes = require('./routes');

// Servidor node
const app = express();

// Integrando o servidor http ao socket
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectUsers = {}

io.on('connection', socket => {
    // console.log('Nova conexão', socket.id);
    const { user } = socket.handshake.query;

    connectUsers[user] = socket.id;

    // socket.on('hello', message => {
    //     console.log(message);
    // });

    // setTimeout(() => {
    //     socket.emit('world', {
    //         message: 'Test socket back'
    //     });
    // }, 3000);
});

// Conectando com o banco
mongoose.connect('mongodb+srv://tobias:tobias@cluster0-1r4qu.mongodb.net/omni?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

// middleware que faz a tranferencia do connectUsers
app.use((req, res, next) => {
    req.io = io;
    req.connectUsers = connectUsers;
    return next()
});

// Dando ao servidor conhecimento dos requires
app.use(cors());
app.use(express.json());
app.use(routes);

// servidor ouvindo na porta 3030
server.listen(3030)