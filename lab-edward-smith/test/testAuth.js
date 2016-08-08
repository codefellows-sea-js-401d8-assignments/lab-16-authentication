'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const server = require('../server');
const mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost:/auth_test_dev');

describe('Auth tests', function() {
  it('should POST data', function(done) {
    chai.request('localhost:3000')
      .post('/api/signup')
      .send({email: 'edsmith@whitehouse.com', password: 'testpass1234'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.token).to.not.have.length(0);
        done();
      })
    })
    it('should fail on POST', function(done) {
      chai.request('localhost:3000')
        .post('/api/signup')
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.body).to.eql('Bad Request');
          done();
        })
    })
    it('should GET a token', function(done){
      chai.request('localhost:3000')
        .get('/api/signin')
        .auth('edsmith@whitehouse.com', 'testpass1234')
        .end(function(err, res){
          expect(res).to.have.status(200);
          expect(res.body.token).to.not.have.length(0);
          done();
        })
    })
    it('should GET a 401 error', function(done){
      chai.request('localhost:3000')
        .get('/api/signin')
        .auth('edsmith@whitehouse.com', 'test')
        .end(function(err, res){
          expect(res).to.have.status(401);
          expect(res.body).to.eql('Bad Authentication')
          done();
        })
    })
})
describe('router catch all', function() {
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      server.close();
      done();
    })
  })
  it('should GET a 404 error', function(done){
    chai.request('localhost:3000')
      .get('/asdfasdf0')
      .end(function(err, res) {
        expect(res).to.have.status(404);
        done();
      })
  })
})
