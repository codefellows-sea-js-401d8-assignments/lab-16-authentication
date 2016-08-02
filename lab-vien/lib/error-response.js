'use strict';

const AppError = require('./AppError');

module.exports = function() {
  return (req, res, next) => {
    res.sendError = (err) => {
      if (err) {
        console.error(err.message);
        if (AppError.isAppError(err))
          return res.status(err.statusCode).send(err.responseMessage);
      }
      res.status(500).send('internal server problem');
    };
    next();
  };
};
