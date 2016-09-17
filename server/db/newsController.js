const db = require('./config');
const Sequelize = require('sequelize');

let offset = 0;
const batchSize = 1;
// const fetchBatches = (res, loc, moreToFind) => {
//   const keepLooking = moreToFind || true;
//   if (keepLooking === false) {
//     return false;
//   }
//   db.News.findAll({
//     where: {
//       queryLoc: loc
//     },
//     offset,
//     limit: batchSize
//   });
// };

// const queryEmit = new Sequelize.Utils.CustomEventEmitter((emitter) => {
//   db.News
//     .findAll({
//       where: {
//         queryLoc: 'San Francisco'
//       },
//       offset,
//       limit: batchSize
//     })
//     .proxy(emitter, { events: ['error'] })
//     .success((result) => {
//       emitter.emit('success', result);
//     });
// })
// .error((err) => {
//   console.log('Error with queryEmit: ', err);
// })
// .success((queryResult) => {
//   console.log('Success with queryEmit: ', queryResult);
// })
// .run();

// module.exports = { queryEmit };
