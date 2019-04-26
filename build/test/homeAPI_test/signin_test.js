"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireDefault(require("../../server"));

var _seedData = require("../../models/seedData");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-unused-expressions */

/* eslint-disable no-undef */
var expect = _chai["default"].expect;

_chai["default"].use(_chaiHttp["default"]);

before(function (done) {
  this.timeout(4000);

  _chai["default"].request(_server["default"]).get('/api/v1').end(function (err, res) {
    setTimeout(function () {
      (0, _seedData.addData)(done);
    }, 2000);
  });
});
after(function (done) {
  this.timeout(3000);
  (0, _seedData.removeData)();
  setTimeout(done, 2000);
});
describe('Test for Signin API', function () {
  it('should return a status 200 if all username and password is correct', function (done) {
    var body = {
      email: 'peter123tunde@email.com',
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res).to.have.status(200);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'data');
      expect(res.body.data).to.include.all.keys('id', 'token', 'firstName', 'lastName', 'email');
      expect(res.body.data.id).to.be.a('Number');
      expect(res.body.data.firstName).to.be.a('String');
      expect(res.body.data.lastName).to.be.a('String');
      expect(res.body.data.email).to.be.a('String');
      expect(res.body.data.token).to.be.a('String');
      done();
    });
  });
  it('should return a status 400 if email field is absent', function (done) {
    var body = {
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
  it('should return a status 400 if password field is absent', function (done) {
    var body = {
      email: 'testAdmin@email.com'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
  it('should return a status 403 if user is not in the database', function (done) {
    var body = {
      email: 'testAdmin@email.com',
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res).to.have.status(403);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
  it('should return a status 403 if user inputs wrong password', function (done) {
    var body = {
      email: 'peter123tunde@email.com',
      password: 'password1'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res).to.have.status(403);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
});