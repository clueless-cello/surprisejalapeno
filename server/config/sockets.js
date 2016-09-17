module.exports.connection = (socket) => {
  console.log('Client is connected...');

  socket.on('request articles', (data) => {
  });
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', (data) => {
    console.log(data);
  });
};
