'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;
const ObjectID = require('mongodb').ObjectID;

const mongoose = require('mongoose');

//connect to mongod
const TEST_DB_SERVER = 'mongodb://localhost/test_db';
process.env.DB_SERVER = TEST_DB_SERVER;

const testServer = require('../server');

describe('Testing hitlist CRUD with mongodb', function() {
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      testServer.close(function() {
        mongoose.connection.close(function() {
          done();
        });
      });
    });
  });

  // HIT TESTS
  describe('testing hit POST functionality', function() {
    it('POST /api/hit with invalid body should respond with error 400', function(done) {
      request('localhost:3000')
        .post('/api/hit')
        .send({
          name: 'shane',
          bad_property: 'CF401',
          time: 'saturday july 30th'
        })
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.text).to.have.string('bad request');
          done();
        });
    });

    it('POST /api/hit with valid body should respond with status code 200', function(done) {
      request('localhost:3000')
        .post('/api/hit')
        .send({
          name: 'shane',
          time: 'saturday july 30th',
          price: '2 us dollars'
        })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('name').to.be.a('string').and.to.match(/^shane$/);
          expect(res.body).to.have.property('price').to.be.a('string').and.to.match(/^2 us dollars$/);
          done();
        });
    });
  });

  describe('testing hit GET functionality', function() {
    before(function(done) {
      request('localhost:3000')
        .post('/api/hit')
        .send({
          name: 'jeff',
          time: 'aug 29th',
          price: '3 us dollars'
        })
        .end((err, res) => {
          this._id = res.body._id;
          done();
        });
    });

    after(function(done) {
      request('localhost:3000')
        .delete('./api/hit/' + this._id)
        .end(() => {
          done();
        });
    });

    it('GET /api/hit with invalid ID should respond with status code 404', function(done) {
      request('localhost:3000')
        .get('/api/hit/' + ObjectID.createFromTime(1))
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.text).to.have.string('not found');
          done();
        });
    });

    it('GET /api/hit with valid ID should respond with status code 200', function(done) {
      request('localhost:3000')
        .get('/api/hit/' + this._id)
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('name').to.be.a('string').and.to.match(/^jeff$/);
          expect(res.body).to.have.property('price').to.be.a('string').and.to.match(/^3 us dollars$/);
          done();
        });
    });

    it('GET /api/hit/all with should respond with status code 200', function(done) {
      request('localhost:3000')
        .get('/api/hit/all')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('testing hit PUT functionality', function() {
    before(function(done) {
      request('localhost:3000')
        .post('/api/hit')
        .send({
          name: 'vien',
          time: 'sept 29th',
          price: '100000 us dollars'
        })
        .end((err, res) => {
          this._id = res.body._id;
          done();
        });
    });

    after(function(done) {
      request('localhost:3000')
        .delete('./api/hit/' + this._id)
        .end(() => {
          done();
        });
    });

    it('PUT /api/hit with invalid ID should respond with status code 404', function(done) {
      request('localhost:3000')
        .put('/api/hit/' + ObjectID.createFromTime(1))
        .send({
          name: 'new vien'
        })
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.text).to.have.string('not found');
          done();
        });
    });

    it('PUT /api/hit with valid ID and invalid body should respond with status code 400', function(done) {
      request('localhost:3000')
        .put('/api/hit/' + this._id)
        .send({
          notAProperty: 'new vien'
        })
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.text).to.have.string('bad request');
          done();
        });
    });

    it('PUT /api/hit with valid ID and body should respond with status code 200', function(done) {
      request('localhost:3000')
        .put('/api/hit/' + this._id)
        .send({
          name: 'new vien'
        })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.text).to.have.string('successfully updated');
          done();
        });
    });
  });

  describe('testing hit DELETE functionality', function() {
    before(function(done) {
      request('localhost:3000')
        .post('/api/hit')
        .send({
          name: 'to be deleted',
          time: 'sept 29th',
          price: '100000 us dollars'
        })
        .end((err, res) => {
          this._id = res.body._id;
          done();
        });
    });

    it('DELETE /api/hit with invalid ID should respond with status code 404', function(done) {
      request('localhost:3000')
        .delete('/api/hit/' + ObjectID.createFromTime(1))
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.text).to.have.string('not found');
          done();
        });
    });

    it('DELETE /api/hit with valid ID should respond with status code 204', function(done) {
      request('localhost:3000')
        .delete('/api/hit/' + this._id)
        .end(function(err, res) {
          expect(res).to.have.status(204);
          done();
        });
    });
  });

  // HITLIST TESTS
  describe('testing hitlist POST functionality', function() {
    it('POST /api/hitlist with invalid body should respond with error 400', function(done) {
      request('localhost:3000')
        .post('/api/hitlist')
        .send({
          hitman: 'big boss',
          bad_property: 'CF401',
          note: 'natural born killing'
        })
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.text).to.have.string('bad request');
          done();
        });
    });

    it('POST /api/hitlist/ with valid body should respond with status code 200', function(done) {
      request('localhost:3000')
        .post('/api/hitlist')
        .send({
          hitman: '47',
          location: 'san francisco',
          note: 'stealth optional'
        })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('hitman').to.be.a('string').and.to.match(/^47$/);
          expect(res.body).to.have.property('note').to.be.a('string').and.to.match(/^stealth optional$/);
          done();
        });
    });
  });

  describe('testing hitlist GET functionality', function() {
    before(function(done) {
      request('localhost:3000')
        .post('/api/hitlist')
        .send({
          hitman: 'killer',
          location: 'chungking station',
          note: 'dont get too close'
        })
        .end((err, res) => {
          this._id = res.body._id;
          done();
        });
    });

    after(function(done) {
      request('localhost:3000')
        .delete('./api/hitlist/' + this._id)
        .end(() => {
          done();
        });
    });

    it('GET /api/hitlist with invalid ID should respond with status code 404', function(done) {
      request('localhost:3000')
        .get('/api/hit/' + ObjectID.createFromTime(1))
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.text).to.have.string('not found');
          done();
        });
    });

    it('GET /api/hitlist with valid ID should respond with status code 200', function(done) {
      request('localhost:3000')
        .get('/api/hitlist/' + this._id)
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('hitman').to.be.a('string').and.to.match(/^killer$/);
          expect(res.body).to.have.property('note').to.be.a('string').and.to.match(/^dont get too close$/);
          done();
        });
    });

    it('GET /api/hitlist/all with should respond with status code 200', function(done) {
      request('localhost:3000')
        .get('/api/hitlist/all')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('testing hitlist PUT functionality', function() {
    before(function(done) {
      request('localhost:3000')
        .post('/api/hitlist')
        .send({
          hitman: 'leon',
          location: 'newyork',
          note: 'dont take a little girl under your wings'
        })
        .end((err, res) => {
          this._id = res.body._id;
          done();
        });
    });

    after(function(done) {
      request('localhost:3000')
        .delete('./api/hitlist/' + this._id)
        .end(() => {
          done();
        });
    });

    it('PUT /api/hitlist with invalid ID should respond with status code 404', function(done) {
      request('localhost:3000')
        .put('/api/hitlist/' + ObjectID.createFromTime(1)) // create a fake objectID
        .send({
          hitman: 'Mathilda'
        })
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.text).to.have.string('not found');
          done();
        });
    });

    it('PUT /api/hitlist with valid ID and invalid body should respond with status code 400', function(done) {
      request('localhost:3000')
        .put('/api/hitlist/' + this._id)
        .send({
          notAProperty: 'mathilda'
        })
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.text).to.have.string('bad request');
          done();
        });
    });

    it('PUT /api/hitlist with valid ID and body should respond with status code 200', function(done) {
      request('localhost:3000')
        .put('/api/hitlist/' + this._id)
        .send({
          hitman: 'Mathilda'
        })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.text).to.have.string('successfully updated');
          done();
        });
    });
  });

  describe('testing hitlist DELETE functionality', function() {
    before(function(done) {
      request('localhost:3000')
        .post('/api/hitlist')
        .send({
          hitman: 'mickey knox',
          location: 'New Mexico',
          note: 'naturally'
        })
        .end((err, res) => {
          this._id = res.body._id;
          done();
        });
    });

    it('DELETE /api/hitlist with invalid ID should respond with status code 404', function(done) {
      request('localhost:3000')
        .delete('/api/hitlist/' + ObjectID.createFromTime(1))
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.text).to.have.string('not found');
          done();
        });
    });

    it('DELETE /api/hitlist with valid ID should respond with status code 204', function(done) {
      request('localhost:3000')
        .delete('/api/hitlist/' + this._id)
        .end(function(err, res) {
          expect(res).to.have.status(204);
          done();
        });
    });
  });

  // HITLIST ENTRY TESTS
  describe('testing hitlist entry POST functionality', function() {
    before(function(done) {
      request('localhost:3000')
        .post('/api/hitlist')
        .send({
          hitman: 'jef costello',
          location: 'paris',
          note: 'perfectly'
        })
        .end((err, res) => {
          this.hitlist_id = res.body._id;
          done();
        });
    });

    after(function(done) {
      request('localhost:3000')
        .delete('./api/hitlist/' + this.hitlist_id)
        .end(() => {
          done();
        });
    });

    it('POST /api/hitlist/:id/entry with invalid body should respond with error 400', function(done) {
      request('localhost:3000')
        .post(`/api/hitlist/${this.hitlist_id}/entry`)
        .send({
          name: 'bad name',
          bad_property: 'CF401',
          time: 'bad time'
        })
        .end(function(err, res) {
          expect(res).to.have.status(400);
          expect(res.text).to.have.string('bad request');
          done();
        });
    });

    it('POST /api/hitlist/:id/entry with valid body should respond with status code 200', function(done) {
      request('localhost:3000')
        .post(`/api/hitlist/${this.hitlist_id}/entry`)
        .send({
          name: 'vien',
          price: '9 us dollars',
          time: 'tomorrow'
        })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('name').to.be.a('string').and.to.match(/^vien$/);
          expect(res.body).to.have.property('price').to.be.a('string').and.to.match(/^9 us dollars$/);
          done();
        });
    });
  });

  describe('testing hitlist entry GET functionality', function() {
    before(function(done) {
      request('localhost:3000')
        .post('/api/hitlist')
        .send({
          hitman: 'jef costello',
          location: 'paris',
          note: 'perfectly'
        })
        .end((err, res) => {
          this.hitlist_id = res.body._id;
          request('localhost:3000')
            .post(`/api/hitlist/${this.hitlist_id}/entry`)
            .send({
              name: 'vien',
              price: '3 dollars',
              time: 'immediately'
            })
            .end(() => {
              done();
            });
        });
    });

    after(function(done) {
      request('localhost:3000')
        .delete(`/api/hitlist/${this.hitlist_id}/entry`)
        .end(() => {
          request('localhost:3000')
            .delete('./api/hitlist/' + this.hitlist_id)
            .end(() => {
              done();
            });
        });
    });

    it('GET /api/hitlist/:id/entry with invalid ID should respond with error 404', function(done) {
      request('localhost:3000')
        .get(`/api/hitlist/${ObjectID.createFromTime(1)}/entry`)
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.text).to.have.string('not found');
          done();
        });
    });

    it('GET /api/hitlist/:id/entry with valid ID should respond with status code 200', function(done) {
      request('localhost:3000')
        .get(`/api/hitlist/${this.hitlist_id}/entry`)
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.body.length).to.eql(1);
          done();
        });
    });
  });

  describe('testing hitlist entry PUT functionality', function() {
    before(function(done) {
      request('localhost:3000')
        .post('/api/hitlist')
        .send({
          hitman: 'jef costello',
          location: 'paris',
          note: 'perfectly'
        })
        .end((err, res) => {
          this.hitlist_id = res.body._id;
          request('localhost:3000')
            .post(`/api/hitlist/${this.hitlist_id}/entry`)
            .send({
              name: 'vien',
              price: '3 dollars',
              time: 'immediately'
            })
            .end((err, res) => {
              this.existingHit_id = res.body._id;
              request('localhost:3000')
                .post('/api/hit')
                .send({
                  name: 'to be added to jef hitlist',
                  price: 'free',
                  time: 'whenever'
                })
                .end((err, res) => {
                  this.hit_id = res.body._id;
                  done();
                });
            });
        });
    });

    after(function(done) {
      request('localhost:3000')
        .delete(`/api/hitlist/${this.hitlist_id}/entry/${this.existingHit_id}`)
        .end(() => {
          request('localhost:3000')
            .delete('/api/hitlist/' + this.hitlist_id)
            .end(() => {
              request('localhost:3000')
              .delete('/api/hit' + this.hit_id)
              .end(() => {
                done();
              });
            });
        });
    });

    it('PUT /api/hitlist/:id/entry with invalid hitlist ID should respond with error 404', function(done) {
      request('localhost:3000')
        .put(`/api/hitlist/${ObjectID.createFromTime(1)}/entry`)
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.text).to.have.string('not found');
          done();
        });
    });

    it('PUT /api/hitlist/:id/entry with valid hitlist ID and no new hit ID should respond with status code 404', function(done) {
      request('localhost:3000')
        .put(`/api/hitlist/${this.hitlist_id}/entry`)
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.text).to.have.string('not found');
          done();
        });
    });

    it('PUT /api/hitlist/:id/entry with valid hitlist ID and valid new hit ID should respond with status code 200', function(done) {
      request('localhost:3000')
        .put(`/api/hitlist/${this.hitlist_id}/entry/${this.hit_id}`)
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.text).to.have.string('successfully added hit');
          done();
        });
    });
  });

  describe('testing hitlist entry DELETE functionality', function() {
    before(function(done) {
      request('localhost:3000')
        .post('/api/hitlist')
        .send({
          hitman: 'john boy',
          location: 'california',
          note: 'suavely'
        })
        .end((err, res) => {
          this.hitlist_id = res.body._id;
          request('localhost:3000')
            .post(`/api/hitlist/${this.hitlist_id}/entry`)
            .send({
              name: 'vien',
              price: '3 dollars',
              time: 'immediately'
            })
            .end((err, res) => {
              this.existingHit_id = res.body._id;
              done();
            });
        });
    });

    it('DELETE /api/hitlist/:id/entry/:id with invalid hitlist ID should respond with error 404', function(done) {
      request('localhost:3000')
        .delete(`/api/hitlist/${ObjectID.createFromTime(1)}/entry`)
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.text).to.have.string('not found');
          done();
        });
    });

    it('DELETE /api/hitlist/:id/entry/:id with valid hitlist ID and no existing hit ID should respond with status code 404', function(done) {
      request('localhost:3000')
        .delete(`/api/hitlist/${this.hitlist_id}/entry`)
        .end(function(err, res) {
          expect(res).to.have.status(404);
          expect(res.text).to.have.string('not found');
          done();
        });
    });

    it('DELETE /api/hitlist/:id/entry with valid hitlist ID and valid hit ID should respond with status code 404', function(done) {
      request('localhost:3000')
        .delete(`/api/hitlist/${this.hitlist_id}/entry/${this.existingHit_id}`)
        .end(function(err, res) {
          expect(res).to.have.status(200);
          expect(res.text).to.have.string('successfully removed hit');
          done();
        });
    });
  });
});
