const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

  return models.Sessions.get({ hash: req.cookies.shortlyid })
    .then((sessionRow) => {
      if (sessionRow === undefined) {
        throw new Error('Invalid cookie');
      }
      req.session = sessionRow;
      next();
    })
    .catch((err) => {
      models.Sessions.create()
        .then(session => {
          return models.Sessions.get({ id: session.insertId });
        })
        .then(sessionRow => {
          req.session = { hash: sessionRow.hash };
          res.cookie('shortlyid', sessionRow.hash);
          next();
        });
    });

}
  // var flag = 'invalid';
  // if (req.cookies && (Object.keys(req.cookies).length > 0) && flag === 'invalid') {
  //   console.log('first stage', req, 'first stage');
  //   return models.Sessions.get({ hash: req.cookies.shortlyid })
  //     .then((rowSession) => {
  //       console.log(rowSession, 'rowsessh');
  //       flag = 'valid';
  //       console.log('reqthis', req);
  //       if (rowSession.hash === req.cookies.shortlyid) {
  //         req.session = { hash: rowSession.hash };
  //         res.cookies = { 'shortlyid': { value: rowSession.hash } }
  //       } else {
  //         return models.Sessions.create().then((item) => {
  //           next();
  //         });
  //       }
  //     })
  //     .then(() => {
  //       next();
  //     });
  // } else {
  //   return models.Sessions.create()
  //     .then((result) => {
  //       return models.Sessions.get({ id: result.insertId })
  //     }).then((session) => {
  //       console.log(session, 'session!!!!')
  //       req.session = { hash: session.hash };
  //       res.cookies = { 'shortlyid': { value: session.hash } };
  //       next();
  //     });
  // }
// }

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
