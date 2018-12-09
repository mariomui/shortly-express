const models = require('../models');
const Promise = require('bluebird');
// const parseCookies = require('./cookieParser');

module.exports.createSession = (req, res, next) => {
  // console.log(req, 'whatthehell');
  var flag = 'invalid';
  console.log(req, 'the request obj');
  if (req.cookies && (Object.keys(req.cookies).length > 0) && flag === 'invalid') {
    console.log('first stage', req, 'first stage');
    return models.Sessions.get({ hash: req.cookies.shortlyid })
      .then((rowSession) => {
        console.log(rowSession, 'rowsessh');
        flag = 'valid';
        console.log('reqthis', req);
        if (rowSession.hash === req.cookies.shortlyid) {
          req.session = { hash: rowSession.hash };
          res.cookies = { 'shortlyid': { value: rowSession.hash } }
        } else {
          return models.Sessions.create().then((item) => {

            next();
          })
        }
      })
      .then(() => {
        next();
      });
  } else {
    return models.Sessions.create()
      .then((result) => {
        return models.Sessions.get({ id: result.insertId })
      }).then((session) => {
        console.log(session, 'session!!!!')
        req.session = { hash: session.hash };
        res.cookies = { 'shortlyid': { value: session.hash } };
        next();
        // flag = 'invalid';
      });
  }
}

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
