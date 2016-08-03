'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const expect = chai.expect;
const User = require('../model/user');
const baseUrl = 'localhost:5000/api';

// const BasicHTTP = require('../lib/basic_http');


describe('Test authenication', function() {
  it('should create a user', function(done) {
    request(baseUrl)
      .post('/signup')
      .send({username: 'dylanjsa90', password: '1234'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
        expect(res.body.token.length).to.not.eql(0);
        done();
      });
  });

  describe('tests with user in database', function() {
    before(function(done) {
      let testUser = new User({username: 'testUser', password: 'testpass'});
      testUser.createHash('testpass').then((token) => {
        this.tokenData = token;
        testUser.save().then((userData) => {
          this.user = userData;
          done();
        }, (err) => {throw err});
      }, (err) => {throw err});
    });

    it('should authenicate the test user', function(done) {
      request(baseUrl)
      .get('/signin')
      .auth('testUser', 'testpass')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
        expect(res.body.token.length).to.not.eql(0);
        done();
      });
    });

    it('should authenicate the user with a token', function(done) {
      request(baseUrl)
      .get('/jwt_auth')
      .set('Authorization', 'Bearer' + this.tokenData.token)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.msg).to.eql('success');
        done();
      });
    });

    it('should not authenicate without a token', function(done) {
      request(baseUrl)
        .get('/jwt_auth')
        .end((err, res) => {
          expect(err).to.not.eql(null);
          expect(res.status).to.eql(401);
          done();
        });
    });
  });
});




// before((done) => {
//   server = app.listen(5000, () => {
//     console.log('server up on 5000');
//     done();
//   });
// });
// after((done) => {
//   mongoose.connection.db.dropDatabase(() => {
//     server.close();
//     done();
//   });
// });
