process.env.APP_SECRET = 'test';

require('./testServer');
require('./authAuthTesting');

const mongoose = require('mongoose');

process.on('exit', (code) => {
  mongoose.connection.db.dropDatabase(() => console.log('Database dropped!!'));
});
