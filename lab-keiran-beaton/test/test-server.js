const mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost/auth_test');
const app = require('express')();
const authRouter = require('../route/authRouter');
app.use('/api', authRouter);
app.use((err, req, res, next) => {
  res.status(err.statusCode).json(err.message);
});

app.listen(5000);
