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

var socketId

socketServer.on('connect', (socket) => {
  socketId = socket.id
  console.log(`[CONNECTION]: O usuário ${socketId} se conectou`)

  socket.on('disconnect', () => {
    console.log(`[DISCONNECT]: O usuário ${socketId} se desconectou`);
  });

  socket.on('chat message', msg => {
    console.log(`[MESSAGE]: ${msg}`);
    socketServer.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log(`Socket.IO server running at http://localhost:3000/`);
});
