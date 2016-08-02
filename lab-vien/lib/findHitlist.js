'use strict';

const AppError = require('./AppError');
const Hitlist = require('../model/Hitlist');

module.exports = function() {
  return (req, res, next) => {
    Hitlist.findById(req.params.hitlistId)
    .then((hitlist) => {
      if (!hitlist)
        return res.sendError(AppError.error404('hitlist not found'));
      req.hitlist = hitlist;
      next();
    })
    .catch((err) => {
      res.sendError(err);
    });
  };
};
