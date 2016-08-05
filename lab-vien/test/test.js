'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const User = require('../model/User');
const Shanesgroupie = require('../model/Shanesgroupie');
const mongoose = require('mongoose');

const TEST_PORT = 8000;
const TEST_DB_SERVER = 'mongodb://localhost/test_db';
process.env.MONGO_URI = TEST_DB_SERVER;
process.env.PORT = TEST_PORT;
const baseUrl = `localhost:${TEST_PORT}/api`;

const testServer = require('../server');

describe('testing auth router', function() {
  before(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      testServer.close(function() {
        mongoose.connection.close(function() {
          done();
        });
      });
    });
  });

  describe('testing POST /api/signup', function() {
    after(function(done) {
      User.remove({})
        .then(() => {
          done();
        });
    });

    it('POST /api/signup should return error status 400 with bad body', function(done) {
      request(`${baseUrl}`)
        .post('/signup')
        .send({
          username: 'vienly'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('POST /api/signup should return status 200 and token for valid registration', function(done) {
      this.timeout(3000);
      request(`${baseUrl}`)
        .post('/signup')
        .send({
          username: 'vienly',
          password: 'password',
          email: 'hello@kitty.com'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });

  describe('testing GET /api/signin', function() {
    before(function(done) {
      request(`${baseUrl}`)
        .post('/signup')
        .send({
          username: 'james',
          password: 'moon',
          email: 'james@moon.com'
        })
        .end(function() {
          done();
        });
    });

    after(function(done) {
      User.remove({})
        .then(() => {
          done();
        });
    });

    it('GET /api/signin should return error status 401 with unauthenticated credentials', function(done) {
      request(`${baseUrl}`)
        .get('/signin')
        .auth('fakeuser', 'fakepass')
        .end(function(err, res) {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('GET /api/signin should return status 200 and token with authenticated credentials', function(done) {
      request(`${baseUrl}`)
        .get('/signin')
        .auth('james', 'moon')
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });

  describe('testing GET/POST/PUT/DELETE to /api/shanesgroupie with authorization', function() {
    before(function(done) {
      let admin = new User();
      let basic = new User();
      admin.role = 'admin';
      admin.username = 'test_admin';
      admin.basic.email = 'test_admin_email';
      basic.role = 'basic';
      basic.username = 'test_basic';
      basic.basic.email = 'test_basic_email';

      admin.generateHash('password')
      .then(admin => admin.save())
      .then(admin => admin.generateToken())
      .then((adminToken) => {
        basic.generateHash('password')
        .then(basic => basic.save())
        .then(basic => basic.generateToken())
        .then((basicToken) => {
          this.basicToken = basicToken;
          this.adminToken = adminToken;
          let testGroupie = new Shanesgroupie();
          testGroupie.name = 'testGroupie';
          testGroupie.age = 99;
          testGroupie.location = 'LA probably';
          testGroupie.save()
          .then((testGroupie) => {
            this.groupieId = testGroupie._id;
            done();
          });
        });
      });
    });

    after(function(done) {
      User.remove({})
        .then(() => {
          Shanesgroupie.remove({})
          .then(() => done());
        });
    });

    it('GET /api/shanesgroupie should return error status 500 with malformed/fake token', function(done) {
      request(`${baseUrl}`)
        .get('/shanesgroupie')
        .set('Authorization', 'Bearer ' + 'faketoken')
        .end(function(err, res) {
          expect(res.status).to.equal(500);
          expect(res.text).to.have.string('internal server problem');
          done();
        });
    });

    it('GET /api/shanesgroupie should return error status 401 with no token', function(done) {
      request(`${baseUrl}`)
        .get('/shanesgroupie')
        .end(function(err, res) {
          expect(res.status).to.equal(401);
          expect(res.text).to.have.string('Unauthorized');
          done();
        });
    });

    it('GET /api/shanesgroupie should return error status 200 with valid basic token', function(done) {
      request(`${baseUrl}`)
        .get('/shanesgroupie')
        .set('Authorization', 'Bearer ' + this.basicToken.token)
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body[0]).to.have.property('name').to.be.a('string').and.to.match(/^testGroupie$/);
          done();
        });
    });

    it('POST /api/shanesgroupie should return error status 401 with basic token', function(done) {
      request(`${baseUrl}`)
        .post('/shanesgroupie')
        .set('Authorization', 'Bearer ' + this.basicToken.token)
        .send({
          name: 'jenny death',
          age: '22',
          location: 'LA ;)'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(401);
          expect(res.text).to.have.string('Unauthorized');
          done();
        });
    });

    it('POST /api/shanesgroupie should return error status 200 with valid admin token', function(done) {
      request(`${baseUrl}`)
        .post('/shanesgroupie')
        .set('Authorization', 'Bearer ' + this.adminToken.token)
        .send({
          name: 'jenny death',
          age: '22',
          location: 'LA ;)'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('name').to.be.a('string').and.to.match(/^jenny death$/);
          done();
        });
    });

    it('PUT /api/shanesgroupie should return error status 401 with basic token', function(done) {
      console.log(this.groupieId);
      request(`${baseUrl}`)
        .put('/shanesgroupie/' + this.groupieId)
        .set('Authorization', 'Bearer ' + this.basicToken.token)
        .send({
          name: 'new name'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('PUT /api/shanesgroupie should return error status 200 with valid admin token', function(done) {
      console.log(this.groupieId);
      request(`${baseUrl}`)
        .put('/shanesgroupie/' + this.groupieId)
        .set('Authorization', 'Bearer ' + this.adminToken.token)
        .send({
          name: 'new name'
        })
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('DELETE /api/shanesgroupie should return error status 401 with basic token', function(done) {
      request(`${baseUrl}`)
        .delete('/shanesgroupie/' + this.groupieId)
        .set('Authorization', 'Bearer ' + this.basicToken.token)
        .end(function(err, res) {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('DELETE /api/shanesgroupie should return error status 200 with valid admin token', function(done) {
      request(`${baseUrl}`)
        .delete('/shanesgroupie/' + this.groupieId)
        .set('Authorization', 'Bearer ' + this.adminToken.token)
        .end(function(err, res) {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
});
