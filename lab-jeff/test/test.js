'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = require('chai').expect;
const request = require('chai').request;
const mongoose = require('mongoose');
const serverPort = 9000;


describe('routing', function() {
  var server;
  before((done) => {
    server = require('../_server');
    done();
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {});
    server.close();
    done();
  });

  it('Should handle unregistered GET routes.', function(done) {
    request('localhost:' + serverPort)
    .get('/api/undefinedRoute')
    .end(function(err){
      expect(err).to.have.status(404);
      done();
    });
  });

  it('Should handle registered POST routes.', function(done) {
    request('localhost:' + serverPort)
    .post('/api/user/signup')
    .send({
      username: 'jeff',
      password: 'password'
    })
    .end(function(res){
      expect(res).to.have.status(200);
      done();
    });
  });

});
