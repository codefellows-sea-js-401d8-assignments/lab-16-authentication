const AppError = require('./app_error.js');

module.exports = exports = function(req, res, next) {
  res.sendError = function(error) {
    console.log(error.message);
    if(AppError.instAppError(error)){
      return res.status(error.statusCode).send(error.responseMessage);
    }
    res.status(500).send('Internal Server Error');
  };
  next();
};
