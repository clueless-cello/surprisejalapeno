// const bing = require('./bing');

const sherlock = require('../api_helpers/sherlock');

const model = require('../db/model');

const goog = require('../api_helpers/goog');

// Given a list of entities from the Watson API,
// return an obj with lat and lng params.
const getGeo = (ent) => {
  let max = 0;
  const geo = { lat: 0, lng: 0 };
  // Look at each of the entities, if it has a lat and lon check
  // if it has a higher relevance than our previous max
  // If it does update the new max params
  ent.forEach(e => {
    if (e.disambiguated.geo && e.relevance > max) {
      max = e.relevance;
      // Watson returns lat/long as a single string with a ' ' separating the
      // numbers
      const inter = e.disambiguated.geo.split(' ');
      geo.lat = parseFloat(inter[0]);
      geo.lng = parseFloat(inter[1]);
    }
  });
  return geo;
};

const roundSentiment = (num) => (Math.round(((num + 1) / 2) * 100) + 240);

// const roundSentiment = (num) => {
//   const value = Math.round((Math.abs(num * 100)));
//   if (num <= 0) {
//     return [360, value];
//   }
//   return [250, value];
// };

const resultsToDb = (results, city) => {
  // toAdd is an Array of results formatted to match the db schema
  const toAdd = results.docs.map(doc => {
    const d = doc.source;
    const geo = getGeo(d.enriched.url.entities);
    const sentAvg = roundSentiment(d.enriched.url.docSentiment.score);

    // Map watson results to DB field values
    return {
      // TODO: Make category from watson
      // TODO: Make source from watson
      // TODO: Make rating from watson
      article_id: doc.id,
      title: d.enriched.url.title,
      rating: d.enriched.url.relevance ?
        (d.enriched.url.relevance).toString() :
        'null',
      description: d.enriched.url.text,
      sentiment: sentAvg,
      url: d.enriched.url.url,
      published: d.enriched.url.publicationDate.date,
      lat: geo.lat,
      lng: geo.lng,
      queryLoc: city
    };
  });
  // pass toAdd to the db
  return model.news.add(toAdd);
};

// Google API returns array of objects
// We only want the city value so we need to loop
const findCity = (arr) => {
  let city = null;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].types.includes('locality')) {
      city = arr[i].long_name;
    }
  }
  return city;
};

const storeWatson = (city, location) => (
  // sherlock is the Watson API file
  // give it the word from the query
  // send the results to the db after some light parsing and then
  sherlock.getByPlace(city)
    .then(d => resultsToDb(d, city))
    .then(() => {
      // console.log('wait for geocoding api complete');
      // wait for the geocoding api to return (if it hasn't already)
      goog.geocode(location.label)
      .then((l) => {
        // console.log('Result of goog.geocode in news.js: ', l.json.results);
        // get the latitutde and longitude out of the center of the
        // geometry returned by the geocoding api
        const toSearch = l.json.results[0].geometry.location;
        // models searches by a radius. This is just hard coded
        // this could be used as user input later
        toSearch.rad = 25;
      });
    })
);

const handleSearch = (location) => {
  // console.log(location);
  const address = location.gmaps.address_components;
  const city = findCity(address);

  // TODO: Sockets
  // Query DB for cached article data using city param
  // Send results to user
  // Query watson for additional data using city param
  // Save watson results to DB (Only new articles will be saved)
  // bulkCreate returns saved articles.
  // Remove articles that have Instance.dataValues.isNewRecord: false
  // Send remaining articles to client

  // TURN WATSON ON AND OFF BY:
  // Swapping comments on lines 121/122 with 123

  // storeWatson(city, location)
  //  .then(model.news.getByLocation(city))

  return model.news.getByLocation(city);
};

module.exports = { handleSearch, storeWatson };
