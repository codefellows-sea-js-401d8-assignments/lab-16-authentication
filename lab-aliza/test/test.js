'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const request = chai.request;
const expect = chai.expect;

const mongoose = require('mongoose');
const User = require('../model/usermodel');
var app = require('../server');
let server;

const TEST_DB_SERVER = 'mongodb://localhost/test_db';
process.env.DB_SERVER = TEST_DB_SERVER;

describe('Test CRUD ', () => {
  let testUser;
  before((done) => {
    server = app.listen(5000, () => {
      console.log('up on 5000');
    });
    testUser = User({username: 'aliza',
    basic: {
      email: 'aliza@aliza.com',
      password: 'aliza'
    }});
    testUser.save((err, user) => {
      testUser = user;
      done();
    });
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      server.close();
      done();
    });
  });

  it('POST 200', (done) => {
    request('localhost:5000')
      .post('/api/signup')
      .send({username: 'aliza2',
      basic: {
        email: 'aliza2@aliza.com',
        password: 'aliza2'
      }})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });

  it('GET 200', (done) => {
    request('localhost:5000')
      .get('/api/login')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.eql(200);
        done();
      });
  });
});
