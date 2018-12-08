const models = require('../models');
const Promise = require('bluebird');
const parseCookies = require('./cookieParser');

module.exports.createSession = (req, res, next) => {
  if (!req.get('Cookie')) {
    return models.Sessions.create()
      .then((result) => {
        return models.Sessions.get({ id: result.insertId })
      }).then((session) => {
        req.session = { hash: session.hash };
        res.cookies = { 'shortlyid': { value: session.hash } };
        next();
      });
  }
}

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/
