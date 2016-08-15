const mongoose = require('mongoose');
const jwtAuth = require('../lib/jwtAuth');


mongoose.connect('localhost/auth_test');


const app = require('express')();
const authorizationRouter = require('../route/authorizationRouter');
const authenticationRouter = require('../route/authenticationRouter');

app.use('/api/authorization', authorizationRouter);
app.use('/api/authenticate', authenticationRouter);
app.get('/api/jwtAuth', jwtAuth, function(req, res){
  res.json({msg: 'success!'});
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).json(err.message);
});
app.listen(5000);
