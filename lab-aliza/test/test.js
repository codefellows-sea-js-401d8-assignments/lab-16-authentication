'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const expect = chai.expect;
const mongoose = require('mongoose');
let app = require('../server');
let server;
const port = 5000;

const TEST_DB_SERVER = 'mongodb://localhost/test_db';
process.env.DB_SERVER = TEST_DB_SERVER;

describe('Authentication tests', () => {
  before((done) => {
    server = app.listen(port, () => {
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
      .send({email:'aliza@aliza.com', password:'password12345'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
        expect(res.body.token.length).to.not.eql(0);
        expect(res).to.have.status(200);
        done();
      });
  });
  it('POST 400', (done) => {
    request('localhost:5000')
      .post('/api/signup')
      .send({blah:'blah'})
      .end((err, res) => {
        expect(res.body).to.eql('bad request');
        expect(res).to.have.status(400);
        done();
      });
  });

  it('GET 200', (done) => {
    request('localhost:5000')
      .get('/api/signin')
      .auth('aliza@aliza.com','password12345')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        expect(res.body.token.length).to.not.eql(0);
        done();
      });
  });
  it('GET 401', (done) => {
    request('localhost:5000')
      .get('/api/signin')
      .auth('wrongemail', 'wrongpassword')
      .end((err, res) => {
        expect(res.body).to.eql('unauthorized');
        expect(res).to.have.status(401);
        done();
      });
  });
  it('GET 404', (done) => {
    request('localhost:5000')
      .get('/wrong')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
