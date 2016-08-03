'use strict';

if(!process.env.APP_SECRET) throw new Error('Please set the env APP_SECRET');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/auth_dev');
let app = require('express')();
let authRouter = require('./routes/auth_router');
let serverError = require('debug')('assign:error');

app.use('/api', authRouter);
app.listen(3000, () => console.log('Server On 3000'));
