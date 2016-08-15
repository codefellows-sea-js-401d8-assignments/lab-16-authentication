'use strict';

process.env.SECRET = 'secret';
process.env.PASSWORD = 'testpass';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const expect = chai.expect;
const baseUrl = 'localhost:5000/api';
const User = require('../model/users');
const mongoose = require('mongoose');


describe('PLEASE AUTHENTICATE', function(){
  it('should create a new user', function(done){
    chai.request(baseUrl)
      .post('/authenticate/signup')
      .send({email: 'marshallmiller92@gmail.com', password: 'fakeasfuck'})
      .end(function(err, res){
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
        expect(res.body.token.length).to.not.eql(0);
        done();
      });
  });

  describe('with a user in the database', function() {
    before(function(done) {
      let user = new User({username: 'test', basic: {email: 'test'}});
      user.generateHash('foobar123').then((token) => {
        this.tokenData = token;
        user.save().then((userData) => {
          this.user = userData;
          done();
        }, (err) => {throw err;});
      }, (err) => {throw err;});
    });

    it('should authenticate with an existing user', function(done) {
      chai.request(baseUrl)
        .get('/authenticate/signin')
        .auth('test', 'foobar123')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body).to.have.property('token');
          expect(res.body.token.length).to.not.equal(0);
          done();
        });
    });

    it('should not authenticate with bad credentials', function(done) {
      chai.request(baseUrl)
        .get('/authenticate/signin')
        .auth('bad', 'credentials')
        .end((err) => {
          expect(err.message).to.eql('Unauthorized');
          done();
        });
    });

    it('should authenticate with a token', function(done) {
      chai.request(baseUrl)
        .get('/jwtAuth')
        .set('Authorization', 'Bearer ' + this.tokenData.token)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('success!');
          done();
        });
    });

    it('should not authenticate without a token', function(done) {
      chai.request(baseUrl)
        .get('/jwtAuth')
        .end((err, res) => {
          expect(err.message).to.eql('Unauthorized');
          expect(res).to.have.status(401);
          done();
        });
    });



  });
});

describe('auth testing', () => {
  before(function(done) {
    new User({
      userName: 'testName',
      basic: {
        email: 'test email',
        password: 'testpass'
      }
    }).save()
    .then((user) => {
      this.id = user._id;
      done();
    })
    .catch((err) => console.log(err));
  });

  it('should get signin', () => {
    chai.request(baseUrl)
      .get('/authorization/signin')
      .auth('admin', 'testpass')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body[0].userName).to.eql('testName');
      });
  });

  it('should not get signin with bad credentials', () => {
    chai.request(baseUrl)
      .get('/authorization/signin')
      .auth('fakeadmin', 'faketestpass')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(400);
      });
  });

  it('should post on signup', () => {
    chai.request(baseUrl)
      .post('/authorization/signup')
      .auth('admin', 'testpass')
      .send({
        userName: 'testName',
        basic: {
          email: 'testemail',
          password: 'testpass'
        }
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.userName).to.eql('testName');
      });
  });
});
