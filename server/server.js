const path = require('path');
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const newsController = require('./api_controllers/news');


io.on('connect', client => {
  console.log('Client connected...');
  const requests = {};

  client.on('request articles', location => {
    requests[location.label] = requests[location.label]
      ? requests[location.label] + 1
      : 1;
    let articleQueue = [];
    let articleLoc = 0;
    newsController.handleSearch(location)
      .then(dbArticles => {
        articleQueue = articleQueue.concat(dbArticles);
        setInterval(() => {
          if (articleLoc < articleQueue.length && articleLoc < 10) {
            client.emit('new articles', [
              articleQueue[articleLoc++],
              articleQueue[articleLoc++],
              articleQueue[articleLoc++]
            ]);
          }
        }, 500);
      })
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
