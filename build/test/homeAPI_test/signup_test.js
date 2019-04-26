"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireWildcard(require("../../server"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-unused-expressions */

/* eslint-disable no-undef */
var expect = _chai["default"].expect;

_chai["default"].use(_chaiHttp["default"]);

describe('Test for signup API', function () {
  after(function (done) {
    _server.store.userStore.remove({
      email: 'testAdmin@email.com'
    }, function (err, result) {
      done();
    });
  });
  it('should return a status 200 if all important fields are entered', function (done) {
    var body = {
      firstName: 'Onu',
      lastName: 'Wednesday',
      email: 'testAdmin@email.com',
      password: 'password',
      confirmPassword: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/signup').send(body).end(function (err, res) {
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
  it('should return a status 400 if firstName field is absent', function (done) {
    var body = {
      lastName: 'Monday',
      email: 'testAdmin@email.com',
      password: 'password',
      confirmPassword: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/signup').send(body).end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
  it('should return a status 400 if lastName field is absent', function (done) {
    var body = {
      firstName: 'Monday',
      email: 'testAdmin@email.com',
      password: 'password',
      confirmPassword: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/signup').send(body).end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
  it('should return a status 400 if email field is absent', function (done) {
    var body = {
      firstName: 'Monday',
      lastName: 'Onu',
      password: 'password',
      confirmPassword: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/signup').send(body).end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
  it('should return a status 400 if password field is absent', function (done) {
    var body = {
      firstName: 'Monday',
      lastName: 'Onu',
      email: 'testAdmin@email.com',
      confirmPassword: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/signup').send(body).end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
  it('should return a status 400 if confirmPassword field is absent', function (done) {
    var body = {
      firstName: 'Monday',
      lastName: 'Onu',
      email: 'testAdmin@email.com',
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/signup').send(body).end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
  it('should return a status 400 if email is invalid', function (done) {
    var body = {
      firstName: 'Monday',
      lastName: 'Onu',
      email: 'email--@com',
      password: 'password',
      confirmPassword: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/signup').send(body).end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
  it('should return a status 400 if password and confirmPassword does not match', function (done) {
    var body = {
      firstName: 'Monday',
      lastName: 'Onu',
      email: 'goodEmail@something.com',
      password: 'password',
      confirmPassword: 'password2'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/signup').send(body).end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
  it('should return a status 400 if email is not unique', function (done) {
    var body = {
      firstName: 'Peter',
      lastName: 'Tunde',
      email: 'peter123tunde@email.com',
      password: 'password',
      confirmPassword: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/signup').send(body).end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
});