const Koa = require('koa');
const assets = require('koa-static');
const socketio = require('socket.io');
const formatMessage = require('./lib/formatMessage');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./lib/users');

// init koa
const app = new Koa();
app.use(assets('public'));

// init server
const server = app.listen(3000);

// init socket.io
const io = socketio(server);

// bot config
const botName = 'k-bot';

// connect
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    socket.emit('message', formatMessage(botName, 'ようこそ k-chatへ'));
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} さんが参加されました。`)
      );

    // 部屋とユーザー情報送信
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // メッセージ確認
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // 接続切れ処理
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username}さんが退出されました。`)
      );

      // 部屋とユーザー情報送信
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});
