const newsController = require('../api_controllers/news');

const practice = { label: 'San Francisco, CA, United States',
  placeId: 'ChIJIQBpAG2ahYAR_6128GcTUEo',
  isFixture: false,
  gmaps:
   { address_components: [[Object], [Object], [Object], [Object]],
     formatted_address: 'San Francisco, CA, USA',
     geometry:
      { bounds: [Object],
        location: [Object],
        location_type: 'APPROXIMATE',
        viewport: [Object] },
     place_id: 'ChIJIQBpAG2ahYAR_6128GcTUEo',
     types: ['locality', 'political'] },
  location: { lat: 37.7749295, lng: -122.41941550000001 }
};


module.exports.connection = (socket) => {
  console.log('Client is connected...');

  socket.on('request articles', (data) => {
    // Query all with city value from data object

    newsController.handleSearch(practice);
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
