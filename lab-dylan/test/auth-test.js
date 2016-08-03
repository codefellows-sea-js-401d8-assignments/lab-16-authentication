'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const expect = chai.expect;
const BasicHTTP = require('../lib/basic_http');
const
process.env.APP_SECRET = 'This is the APP SECRET';

const mongoose = require('mongoose');
const User = require('../model/user');
var app = require('../server');
var server;


describe('Test crud', () => {
  let testUser;
  before((done) => {
    server = app.listen(5000, () => {
      console.log('server up on 5000');
      done();
    });
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      server.close();
      done();
    });
  });
  it('should save the test user', (done) => {
    request('localhost:5000')
      .post('/api/signup/')
      .send({username: 'dylanjsa90', password: '1234'})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        done();
      });
  });

  it('should login the user', (done) => {
    request('localhost:3000').auth('dylanjsa90', '1234')
      .get('/api/signin')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        done();
      });
  });

  it('bad request', (done) => {
    done()
  });
});
