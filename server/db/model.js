const db = require('./config');

// Refactor to use query chainer:
// http://docs.sequelizejs.com/en/1.7.0/docs/utils/#querychainer
const tests = {
  fetchBatches(res, loc, moreToFind) {
    let offset = 0;
    const batchSize = 3;
    const keepLooking = moreToFind || true;
    if (keepLooking === false) {
      return;
    }

    db.News.findAll({
      where: {
        queryLoc: loc
      },
      offset,
      limit: batchSize
    })
    .then((data) => {
      // send data to socket
      offset += batchSize;
      console.log('Batch found 0 -', offset);
      if (data.length > 0) {
        return true;
      }
      return false;
    })
    .then((next) => {
      if (!next) {
        console.log(res);
      } else {
        this.fetchBatches(loc, true);
      }
    })
    .catch((err) => {
      console.log('Error with batch find: ', err);
    });
  }
};

module.exports = {
    // all methods return a promise
    // getters resolve with -> [{...}, {...}, ...]
  news: {
    fetchAll() {
      return db.News.findAll()
        .then((data) => data)
        .catch((err) => {
          console.log('Error fetching all data: ', err);
        });
    },

    // getByTitle(title) {
    //   return db('news').where('title', title)
    //   .catch(err => console.log(`Error getting record by title ${err}`));
    // },

    // Build test queries here:
    test(req, res, next) {
      const city = req.body.city;
      console.log('Testing batch find with city: ', city);
      tests.fetchBatches(res, city);
    },

    getByLocation(loc) {
      return db.News.findAll({
        where: {
          queryLoc: loc
        }
      })
      .catch((err) => console.log('Error fetching loc data: ', err));
    },
    add(data) {
      // expects data to be formatted as
      // {title: '', rating: num, category: '', ...etc}
      // can take an array of data objects -> [{...}, {...}, ...]
      // resolves promise with id of first inserted record -> [id]
      // return db('news').insert(data, 'id')
      // .catch(err => console.log(`Error inserting into "news" table`
      //   // `${err}`
      //   ));
      return db.News.bulkCreate(data, { ignoreDuplicates: true })
        .then((dbRes) => {
          // Only return articles that have:
          // Instance.dataValues.isNewRecord: true
          // console.log('Data returned from bulkCreate: ', dbRes);
        })
        .catch((err) => {
          console.log('Error with bulkCreate: ', err);
        });
    }
  }
};
