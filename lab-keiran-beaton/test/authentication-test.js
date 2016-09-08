'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
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
      console.log(res.token);
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

  describe('with an exising user', function() {
    before(function(done) {
      let user = new User({username: 'test', basic: {email: 'test@test.com'}});
      user.generateHash('123').then((token) => {
        this.tokenData = token;
        user.save().then((userData) => {
          this.user = userData;
          done();
        }, (err) => {throw err;});
      }, (err) => {throw err;});
    });

    it('api/signin should get a 200 status', function(done) {
      request(baseUrl)
        .get('/signin')
        
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body).to.have.property('token');
          expect(res.body.token.length).to.not.eql(0);
          done();
        });
    });

    it('api/signin should get a 400 status', function(done) {
      request(baseUrl)
      .get('/signin')
      .end((err, res) => {
        expect(err.message).to.eql('Unauthorized');
        expect(res).to.not.have.status(200);
        done();
      });
    });
  });
});
