const express = require('express');
const path = require('path');
const ejs = require('ejs');

const app = express();
const server = require('http').Server(app);
const socketServer = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use("/", (req, res) => {
  res.render("index.html");
});

// app.get('/', (req, res) => {
//   console.log(`[GET]: /`)
//   res.sendFile(__dirname + '/public/index.html');
// });

var chatUsers = {}

socketServer.on('connect', (socket) => {
  const socketId = socket.id
  
  socket.on('login', usern => {
    chatUsers[socketId] = usern
    console.log(`[CONNECTION]: O usuário ${chatUsers[socketId]} se conectou: ${socketId}`)
    socketServer.emit('chat message', `${chatUsers[socketId]} entrou na sala...`)
  })
  
  socket.on('disconnect', () => {
    console.log(`[DISCONNECT]: O usuário ${chatUsers[socketId]} se desconectou: ${socketId}`);
    socketServer.emit('chat message', `${chatUsers[socketId]} saiu da sala...`)
    delete chatUsers[socketId]
  });

  socket.on('chat message', msg => {
    console.log(`[MESSAGE]: ${chatUsers[socketId]}: ${msg}`);
    socketServer.emit('chat message', `${chatUsers[socketId]}: ${msg}`);
  });
});

server.listen(3000, () => {
  console.log(`Socket.IO server running at http://localhost:3000/`);
});
