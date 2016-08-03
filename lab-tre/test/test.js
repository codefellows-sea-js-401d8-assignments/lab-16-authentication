'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = require('chai').expect;
const request = require('chai').request;
const mongoose = require('mongoose');
const serverPort = 5000;


describe('routing server', function() {
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

  it('Should throw error for unknown GET routes.', function(done) {
    request('localhost:' + serverPort)
    .get('/api/unknown')
    .end(function(err){
      expect(err).to.have.status(404);
      done();
    });
  });

  it('Should pass if POST routes are registered.', function(done) {
    request('localhost:' + serverPort)
    .post('/api/user/signup')
    .send({
      username: 'micheal3',
      password: 'rowdy1000'
    })
    .end(function(res){
      expect(res).to.have.status(200);
      done();
    });
  });
});
