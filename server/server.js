const path = require('path');
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const newsController = require('./api_controllers/news');

io.on('connect', (client) => {
  console.log('Client connected...');

  client.on('request articles', (location) => {
    newsController.handleSearch(location)
      .then(dbResponse => client.emit('new articles', dbResponse))
      .catch(e => console.log(e));
  });
});



/* api_controllers/news is the main handler for handling a query from the front
 * end. The only route on the api is /query with a query parameter, 'q'
 * the handler looks for q, sends it to the Google geocoding API to turn the
 * word into a latitude and longitude. Simultaneously, we send the word to
 * Watson to get news articles with entities that have the same name (as 'q'.)
 * Then we put the results of the watson query into the db, and return a query
 * by range from the db.
 */


// middleware is all in config/middleware
require('./config/middleware')(app, express);

app.use(express.static(path.join(__dirname, '../client')));

// routes are defined in config/routes.js
require('./config/routes')(app, express);

// looks for the PORT environment parameter to listen on
const port = process.env.PORT;
// const port = 3000;

server.listen(port, () => console.log('Listening on port', port));


module.exports = app;
