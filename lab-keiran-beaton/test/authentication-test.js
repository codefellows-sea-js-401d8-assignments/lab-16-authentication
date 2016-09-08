'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const mongoose = require('mongoose');
const expect = chai.expect;
const request = chai.request;
let baseUrl = 'localhost:5000/api';
const User = require('../model/user');


describe('testing authentication', function() {
  it('should get a 404', (done) => {
    request(baseUrl)
    .get('/notaroute')
    .end((err, res) => {
      expect(err).to.have.status(404);
      expect(res).to.not.have.status(200);
      done();
    });
  });

  it('api/signup should get a 200 status', (done) => {
    request(baseUrl)
    .post('/signup')
    .send({username: 'keiran', email: 'keiranbeaton@gmail.com', password: '123'})
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body.username).to.eql('keiran');
      done();
    });
  });

  it('api/signup should get a 400 status', (done) => {
    request(baseUrl)
    .post('/signup')
    .end((err, res) => {
      expect(err).to.have.status(400);
      expect(res).to.not.have.status(200);
      done();
    });
  });
});
