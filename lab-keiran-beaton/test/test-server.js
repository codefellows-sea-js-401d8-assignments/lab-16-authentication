const mongoose = require('mongoose');
const jwt_auth = require('../lib/jwt-auth');
mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost/auth_test');
const app = require('express')();
const authRouter = require('../route/authRouter');
app.use('/api', authRouter);
app.get('/api/jwt-auth', jwt_auth, function(req, res) {
  res.json({msg: 'success!'});
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).json(err.message);
});

app.listen(5000);
