'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const User = require('../model/User');

const mongoose = require('mongoose');

//connect to mongod
const TEST_DB_SERVER = 'mongodb://localhost/test_db';
process.env.DB_SERVER = TEST_DB_SERVER;

const testServer = require('../server');

const baseUrl = 'localhost:3000/api';

describe('testing auth router', function() {
  before(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      testServer.close(function() {
        mongoose.connection.close(function() {
          done();
        });
      });
    });
  });

  describe('testing POST /api/signup', function() {
    after(function(done) {
      User.remove({})
        .then(() =>{
          done();
        });
    });

    it('POST /api/signup should return error status 400 with bad body', function(done) {
      request(`${baseUrl}`)
        .post('/signup')
        .send({
          username: 'vienly'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('POST /api/signup should return status 200 and token for valid registration', function(done) {
      request(`${baseUrl}`)
        .post('/signup')
        .send({
          username: 'vienly',
          password: 'password',
          email: 'hello@kitty.com'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });

  describe('testing GET /api/signin', function() {
    before(function(done) {
      request(`${baseUrl}`)
        .post('/signup')
        .send({
          username: 'james',
          password: 'moon',
          email: 'james@moon.com'
        })
        .end(function() {
          done();
        });
    });

    after(function(done) {
      User.remove({})
        .then(() =>{
          done();
        });
    });

    it('GET /api/signin should return error status 401 with unauthenticated credentials', function(done) {
      request(`${baseUrl}`)
        .get('/signin')
        .auth('fakeuser', 'fakepass')
        .end(function(err, res) {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('GET /api/signin should return status 200 and token with authenticated credentials', function(done) {
      request(`${baseUrl}`)
        .get('/signin')
        .auth('james', 'moon')
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });
});
