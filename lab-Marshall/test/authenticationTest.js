'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const expect = chai.expect;
const baseUrl = 'localhost:5000/api';
const User = require('../model/users');

process.env.SECRET = 'secret';

describe('PLEASE AUTHENTICATE', function(){
  it('should create a new user', function(done){
    chai.request(baseUrl)
      .post('/signup')
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
        .get('/signin')
        .auth('test', 'foobar123')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body).to.have.property('token');
          expect(res.body.token.length).to.not.equal(0);
          done();
        });
    });


  });
});
