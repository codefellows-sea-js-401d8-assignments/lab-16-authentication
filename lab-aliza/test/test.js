'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const request = chai.request;
const expect = chai.expect;

const mongoose = require('mongoose');
var app = require('../server');
let server;

const TEST_DB_SERVER = 'mongodb://localhost/test_db';
process.env.DB_SERVER = TEST_DB_SERVER;

describe('Test CRUD ', () => {
  let testUser;
  before((done) => {
    app.listen(5000, () => {
      console.log('up on 5000');
    });
    testUser = {
      email: 'aliza@aliza.com',
      password: 'abcd12345'
    };
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
      .send({
        email: 'aliza@aliza.net',
        password: 'qwerty98765'
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });

  it('POST 400', (done) => {
    request('localhost:5000')
      .post('/api/signup')
      .send({huzzah: 'huzzah'})
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('GET 200', (done) => {
    request('localhost:5000')
      .get('/api/signin' + testUser)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.age).to.eql(27);
        done();
      });
  });

  it('GET 404', (done) => {
    request('localhost:5000')
      .get('/api/signin')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
