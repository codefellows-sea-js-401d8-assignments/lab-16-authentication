'use strict';

if(!process.env.APP_SECRET) throw new Error('Please set the env APP_SECRET');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/auth_dev');
let app = require('express')();
let authRouter = require('./route/auth_router');
let drinkRouter = require('./route/fav_drink_route');
mongoose.Promise = Promise;

app.use('/api/drink', drinkRouter);
app.use('/api', authRouter);
app.use((err, req, res)=>{
  res.status(err.statusCode || 500).json(err.err.message);
});
app.listen(3000, () => console.log('Server On 3000'));
