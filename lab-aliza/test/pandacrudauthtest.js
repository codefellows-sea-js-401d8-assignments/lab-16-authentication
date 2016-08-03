'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
const request = chai.request;
const expect = chai.expect;
const mongoose = require('mongoose');
const Panda = require('../model/pandamodel');
var app = require('../server');
let server;

const TEST_DB_SERVER = 'mongodb://localhost/test_db';
process.env.DB_SERVER = TEST_DB_SERVER;

describe('Test CRUD ', () => {
  let testPanda;
  before((done) => {
    server = app.listen(5000, () => {
      console.log('up on 5000');
    });
    testPanda = Panda({
      name: 'aliza',
      age: 27,
      happy: true,
      zookeeperId: '12345'
    });
    testPanda.save((err, panda) => {
      testPanda = panda;
      done();
    });
  });
  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      server.close();
      done();
    });
  });

  it('POST 200', (done) => {
    request('localhost:5000')
      .post('/api/panda')
      .send({
        name: 'aliza',
        age: 27,
        happy: true
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });

  it('POST 400', (done) => {
    request('localhost:5000')
      .post('/api/panda')
      .auth({huzzah: 'huzzah'})
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });

  it('GET 200', (done) => {
    request('localhost:5000')
      .get('/api/panda/' + testPanda._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body.age).to.eql(27);
        done();
      });
  });

  it('GET 404', (done) => {
    request('localhost:5000')
      .get('/api/panda')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('PUT 200', (done) => {
    request('localhost:5000')
      .put('/api/panda/' + testPanda._id)
      .auth({
        name: 'tyler',
        age: 87,
        happy: false,
        zookeeperId: '12345'
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        done();
      });
  });

  it('PUT 400', (done) => {
    request('localhost:5000')
      .put('/api/panda/' + testPanda._id)
      .send()
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
  it('PUT 404', (done) => {
    request('localhost:5000')
      .put('/api/panda/')
      .send({
        name: 'tyler',
        age: 87,
        happy: false
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it('DELETE 204', (done) => {
    request('localhost:5000')
      .delete('/api/panda/' + testPanda._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(204);
        done();
      });
  });
  it('DELETE 404', (done) => {
    request('localhost:5000')
      .delete('/api/panda/')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
