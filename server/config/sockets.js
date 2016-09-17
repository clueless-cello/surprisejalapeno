const newsController = require('../api_controllers/news');

module.exports.connection = (socket) => {
  console.log('Client is connected...');

  socket.on('request articles', (location) => {
    // Query all with city value from data object

    newsController.handleSearch(location);
      // Emit response with query data from the server
    // Query Watson and save the results to the DB
  });
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', (data) => {
    console.log(data);
  });
  socket.on('error', (err) => {
    console.log('This is the socket error, ', err);
  });
};
