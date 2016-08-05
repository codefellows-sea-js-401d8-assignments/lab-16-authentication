'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const request = chai.request;
const expect = chai.expect;
const mongoose = require('mongoose');


const TEST_DB_SERVER = 'mongodb://localhost/test_db';
process.env.DB_SERVER = TEST_DB_SERVER;

let app = require('./test_server');

let server;

describe('Authenication Testing', ()=>{
  before((done)=>{
    server = app.listen(4000, ()=>{
      console.log('Server On 4000');
      done();
    });
  });
  after((done)=>{
    mongoose.connection.db.dropDatabase(()=>{
      server.close();
      done();
    });
  });
  it('POST should sign up a new user', (done)=>{
    request('localhost:4000')
      .post('/api/signup')
      .send({email:'e@email.com', password:'words'})
      .end((err, res)=>{
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('POST should return a 401', (done) =>{
    request('localhost:4000')
      .post('/api/signup')
      .end((err, res)=>{
        expect(res).to.have.status(401);
        done();
      });
  });

  it('GET should return a 200', (done) =>{
    request('localhost:4000')
      .get('/api/signin')
      .auth('e@email.com', 'words')
      .end((err, res)=>{
        expect(res).to.have.status(200);
        expect(res.body.token.length).to.not.eql(0);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('GET should return a 401', (done)=>{
    request('localhost:4000')
      .get('/api/signin')
      .auth('e@email.com', 'nope')
      .end((err, res)=>{
        expect(res).to.have.status(401);
        expect(res.body).to.have.string('No matching password');
        done();
      });
  });
});
