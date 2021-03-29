const app = require('express')();
const server = require('http').Server(app);
const socketServer = require('socket.io')(server);

app.get('/', (req, res) => {
  console.log(`[GET]: /`)
  res.sendFile(__dirname + '/public/index.html');
});

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
