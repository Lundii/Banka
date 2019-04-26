"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireDefault(require("../../server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-unused-expressions */

/* eslint-disable no-undef */
var expect = _chai["default"].expect;

_chai["default"].use(_chaiHttp["default"]);

describe('Admin can Activate or deactivate an account Number', function () {
  it('should return a status 200 if the account is successfully de-activated if activated initially', function (done) {
    var body = {
      email: 'onumonday@email.com',
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res.body.data).to.include.all.keys('token');
      expect(res.body.data.token).to.be.a('String');
      var _res$body$data = res.body.data,
          token = _res$body$data.token,
          id = _res$body$data.id;
      var body2 = {
        status: 'dormant'
      };

      _chai["default"].request(_server["default"]).patch("/api/v1/admin/".concat(id, "/account/1004870909")).send(body2).set('Authorization', token).end(function (er, resp) {
        expect(resp).to.have.status(200);
        expect(resp).to.be.a('object');
        expect(resp.body).to.have.all.keys('status', 'data');
        expect(resp.body.data).to.include.all.keys('accountNumber', 'status', 'message');
        expect(resp.body.data.accountNumber).to.be.a('Number');
        expect(resp.body.data.status).to.be.a('String');
        expect(resp.body.data.message).to.be.a('String');
        done();
      });
    });
  });
  it('should return a status 400 if the account is already active', function (done) {
    var body = {
      email: 'onumonday@email.com',
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res.body.data).to.include.all.keys('token');
      expect(res.body.data.token).to.be.a('String');
      var _res$body$data2 = res.body.data,
          token = _res$body$data2.token,
          id = _res$body$data2.id;
      var body2 = {
        status: 'active'
      };

      _chai["default"].request(_server["default"]).patch("/api/v1/admin/".concat(id, "/account/1003847890")).send(body2).set('Authorization', token).end(function (er, resp) {
        expect(resp).to.have.status(400);
        expect(resp).to.be.a('object');
        expect(resp.body).to.have.all.keys('status', 'error');
        expect(resp.body.error).to.be.a('String');
        done();
      });
    });
  });
  it('should return a status 200 if the account is successfully activated if de-activated initially', function (done) {
    var body = {
      email: 'onumonday@email.com',
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res.body.data).to.include.all.keys('token');
      expect(res.body.data.token).to.be.a('String');
      var _res$body$data3 = res.body.data,
          token = _res$body$data3.token,
          id = _res$body$data3.id;
      var body2 = {
        status: 'active'
      };

      _chai["default"].request(_server["default"]).patch("/api/v1/admin/".concat(id, "/account/1003437498")).send(body2).set('Authorization', token).end(function (er, resp) {
        expect(resp).to.have.status(200);
        expect(resp).to.be.a('object');
        expect(resp.body).to.have.all.keys('status', 'data');
        expect(resp.body.data).to.include.all.keys('accountNumber', 'status', 'message');
        expect(resp.body.data.accountNumber).to.be.a('Number');
        expect(resp.body.data.status).to.be.a('String');
        expect(resp.body.data.message).to.be.a('String');
        done();
      });
    });
  });
  it('should return a status 400 if the account is already dormant', function (done) {
    var body = {
      email: 'onumonday@email.com',
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res.body.data).to.include.all.keys('token');
      expect(res.body.data.token).to.be.a('String');
      var _res$body$data4 = res.body.data,
          token = _res$body$data4.token,
          id = _res$body$data4.id;
      var body2 = {
        status: 'dormant'
      };

      _chai["default"].request(_server["default"]).patch("/api/v1/admin/".concat(id, "/account/1004809890")).send(body2).set('Authorization', token).end(function (er, resp) {
        expect(resp).to.have.status(400);
        expect(resp).to.be.a('object');
        expect(resp.body).to.have.all.keys('status', 'error');
        expect(resp.body.error).to.be.a('String');
        done();
      });
    });
  });
  it('should return a status 401 if the user is not a staff or admin', function (done) {
    var body = {
      email: 'peter123tunde@email.com',
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res.body.data).to.include.all.keys('token');
      expect(res.body.data.token).to.be.a('String');
      var _res$body$data5 = res.body.data,
          token = _res$body$data5.token,
          id = _res$body$data5.id;
      var body2 = {
        status: 'active'
      };

      _chai["default"].request(_server["default"]).patch("/api/v1/admin/".concat(id, "/account/100495432")).send(body2).set('Authorization', token).end(function (er, resp) {
        expect(resp).to.have.status(401);
        expect(resp).to.be.a('object');
        expect(resp.body).to.have.all.keys('status', 'error');
        expect(resp.body.error).to.be.a('String');
        done();
      });
    });
  });
  it('should return a status 400 if account does not exit', function (done) {
    var body = {
      email: 'onumonday@email.com',
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res.body.data).to.include.all.keys('token');
      expect(res.body.data.token).to.be.a('String');
      var _res$body$data6 = res.body.data,
          token = _res$body$data6.token,
          id = _res$body$data6.id;
      var body2 = {
        status: 'active'
      };

      _chai["default"].request(_server["default"]).patch("/api/v1/admin/".concat(id, "/account/107495432")).send(body2).set('Authorization', token).end(function (er, resp) {
        expect(resp).to.have.status(400);
        expect(resp).to.be.a('object');
        expect(resp.body).to.have.all.keys('status', 'error');
        expect(resp.body.error).to.be.a('String');
        done();
      });
    });
  });
  it('should return a status 401 is user does not have a valid or expired token', function (done) {
    var body = {
      status: 'active'
    };
    var id = 50048987839302;

    _chai["default"].request(_server["default"]).patch("/api/v1/admin/".concat(id, "/account/100495432")).send(body).set('Authorization', 'ghjklldiOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJtb25kYXkiLCJlbWFpbCI6Im1vbmRheXR1ZXNkYXlAZ21haWwuY29tIiwiaWF0IjoxNTU0OTM3Njc4LCJleHAiOjE1NTQ5NDQ4NzgsImlzcyI6Im1vbmRheS5sdW5kaWkifQ.XBP-AmW9ssM6T3GYeQIY-GUGMu7vjR2bbXey3Hc0dUU').end(function (err, res) {
      expect(res).to.have.status(401);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
});