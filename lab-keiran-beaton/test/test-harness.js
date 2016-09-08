process.env.APP_SECRET = 'test';
require('./test-server');
require('./authentication-test');

const mongoose = require('mongoose');
process.on('exit', () => {
  mongoose.connection.db.dropDatabase(() => console.log('db dropped'));
});
