'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const expect = chai.expect;
const mongoose = require('mongoose');

const TEST_DB_SERVER = 'mongodb://localhost/test_db';
process.env.DB_SERVER = TEST_DB_SERVER;

let app = require('./test_server');
let server;

describe('Testing Authentication for signup and signin', () => {
  before((done) => {
    server = app.listen(5000, () => {
      console.log('test server is up');
      done();
    });
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      server.close();
      done();
    });
  });

  it('/POST should signup a new user and respond with their json web token', (done) => {
    request('localhost:5000')
      .post('/api/auth/signup')
      .send({username:'dude', password:'helloworld'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.text).to.have.string('token');
        done();
      });
  });
  it('/POST should send back a 400 error with invalid body', (done) => {
    request('localhost:5000')
      .post('/api/auth/signup')
      .send({type:'james', pass:'food'})
      .end((err, res) => {
        expect(err).to.have.status(400);
        expect(res.text).to.eql('Bad request');
        done();
      });
  });

  it('/GET should signin with the new user and provide the json web token', (done) => {
    request('localhost:5000')
      .get('/api/auth/signin')
      .auth('dude','helloworld')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.text).to.have.string('token');
        done();
      });
  });
  it('/GET should send back a 401 error with authentication error', (done) => {
    request('localhost:5000')
      .get('/api/auth/signin')
      .auth('james', 'moon')
      .end((err, res) => {
        expect(err).to.have.status(401);
        expect(res.text).to.have.string('Authentication failed');
        done();
      });
  });
});
