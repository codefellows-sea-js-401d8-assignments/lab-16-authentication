'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const request = chai.request;
const expect = chai.expect;
const mongoose = require('mongoose');

const TEST_DB_SERVER = 'mongodb://localhost/test_db';
process.env.DB_SERVER = TEST_DB_SERVER;

let app = require('./test_server');

let server, userToken, pandaId;

describe('testing different routes for our server ', () => {
  before((done) =>{
    server = app.listen(5000, ()=>{
      console.log('Server on 5000');
      done();
    });
    request('localhost:5000')
      .post('/api/signup')
      .send({username:'first', password:'password'})
      .end();
    request('localhost:5000')
      .get('/api/signin')
      .auth('first', 'password')
      .end((res)=>{
        userToken = res.body.token;
        done();
      });
  });
  after((done) =>{
    mongoose.connection.db.dropDatabase((done)=>{
      mongoose.disconnect(() => {
        server.close();
        done();
      });
    });
    done();
  });
  it('should POST a new user', (done) => {
    request('localhost:5000')
      .post('/api/signup')
      .send({username:'aliza', password:'password'})
      .end((err, res)=>{
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should NOT POST a new user', (done) => {
    request('localhost:5000')
      .post('/api/signup')
      .send({blah:'blah'})
      .end((err, res)=>{
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should GET (login) a user', (done) => {
    request('localhost:5000')
      .get('/api/signin')
      .auth('aliza', 'password')
      .end((err, res)=>{
        userToken = res.body.token;
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('should NOT login a new user because of bad auth', (done) => {
    request('localhost:5000')
      .get('/api/signin')
      .auth('bad', 'auth')
      .end((err, res)=>{
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should POST a new panda', (done) =>{
    request('localhost:5000')
      .post('/api/panda')
      .set('Authorization', 'Bearer ' + userToken)
      .send({name: 'panda'})
      .end((err, res)=>{
        pandaId = res.body._id;
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.name).to.eql('panda');
        done();
      });
  });

  it('should GET a panda by id', (done) =>{
    request('localhost:5000')
      .get('/api/panda/' + pandaId)
      .end((err, res)=>{
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should NOT POST a new panda', (done) =>{
    request('localhost:5000')
      .post('/api/panda')
      .set('Authorization', 'Bearer ' + userToken)
      .end((err, res)=>{
        expect(res).to.have.status(400);
        done();
      });
  });

  it('should NOT POST a new panda - bad auth', (done) =>{
    request('localhost:5000')
      .post('/api/panda')
      .set('Authorization', 'Bearer ')
      .end((err, res)=>{
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should GET all pandas', (done) =>{
    request('localhost:5000')
      .get('/api/all')
      .end((err, res) =>{
        expect(res).to.have.status(200);
        done();
      });
  });

});
