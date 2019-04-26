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

describe('Staff can debit an account Number', function () {
  after(function (done) {
    _server.store.transactionStore.remove({
      accountNumber: 1000047890
    }, function (err, result) {
      done();
    });
  });
  it('should return a status 200 if the account is successfully debited', function (done) {
    var body = {
      email: 'amaka.padi@email.com',
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res.body.data).to.include.all.keys('token');
      expect(res.body.data.token).to.be.a('String');
      var _res$body$data = res.body.data,
          token = _res$body$data.token,
          id = _res$body$data.id;
      var body2 = {
        debitAmount: 20000
      };

      _chai["default"].request(_server["default"]).post("/api/v1/staff/".concat(id, "/transactions/1000047890/debit")).send(body2).set('Authorization', token).end(function (er, resp) {
        expect(resp).to.have.status(200);
        expect(resp).to.be.a('object');
        expect(resp.body).to.have.all.keys('status', 'data');
        expect(resp.body.data).to.include.all.keys('transactionId', 'accountNumber', 'amount', 'cashier', 'transactionType', 'accountBalance');
        expect(resp.body.data.transactionId).to.be.a('Number');
        expect(resp.body.data.accountNumber).to.be.a('String');
        expect(resp.body.data.amount).to.be.a('Number');
        expect(resp.body.data.cashier).to.be.a('Number');
        expect(resp.body.data.accountBalance).to.be.a('String');
        done();
      });
    });
  });
  it('should return a status 400 if the amount is greater than available balance', function (done) {
    var body = {
      email: 'amaka.padi@email.com',
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res.body.data).to.include.all.keys('token');
      expect(res.body.data.token).to.be.a('String');
      var _res$body$data2 = res.body.data,
          token = _res$body$data2.token,
          id = _res$body$data2.id;
      var body2 = {
        debitAmount: 200000
      };

      _chai["default"].request(_server["default"]).post("/api/v1/staff/".concat(id, "/transactions/1003847890/debit")).send(body2).set('Authorization', token).end(function (er, resp) {
        expect(resp).to.have.status(400);
        expect(resp).to.be.a('object');
        expect(resp.body).to.have.all.keys('status', 'error');
        expect(resp.body.error).to.be.a('String');
        done();
      });
    });
  });
  it('should return a status 400 if the account is dormant', function (done) {
    var body = {
      email: 'amaka.padi@email.com',
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res.body.data).to.include.all.keys('token');
      expect(res.body.data.token).to.be.a('String');
      var _res$body$data3 = res.body.data,
          token = _res$body$data3.token,
          id = _res$body$data3.id;
      var body2 = {
        debitAmount: 200000
      };

      _chai["default"].request(_server["default"]).post("/api/v1/staff/".concat(id, "/transactions/1004837498/debit")).send(body2).set('Authorization', token).end(function (er, resp) {
        expect(resp).to.have.status(400);
        expect(resp).to.be.a('object');
        expect(resp.body).to.have.all.keys('status', 'error');
        expect(resp.body.error).to.be.a('String');
        done();
      });
    });
  });
  it('should return a status 401 if the user is not a staff(cahier)', function (done) {
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
        debitAmount: 20000
      };

      _chai["default"].request(_server["default"]).post("/api/v1/staff/".concat(id, "/transactions/1004837498/credit")).send(body2).set('Authorization', token).end(function (er, resp) {
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
      email: 'amaka.padi@email.com',
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res.body.data).to.include.all.keys('token');
      expect(res.body.data.token).to.be.a('String');
      var _res$body$data5 = res.body.data,
          token = _res$body$data5.token,
          id = _res$body$data5.id;
      var body2 = {
        debitAmount: 20000
      };

      _chai["default"].request(_server["default"]).post("/api/v1/staff/".concat(id, "/transactions/1004930098/debit")).send(body2).set('Authorization', token).end(function (er, resp) {
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
      debitAmount: 20000
    };
    var id = 50048987839302;

    _chai["default"].request(_server["default"]).post("/api/v1/staff/".concat(id, "/transactions/100495432/debit")).send(body).set('Authorization', 'ghjklldiOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXkljE5hbWUiOiJtb25kYXkiLCJlbWFpbCI6Im1vfyRheXR1ZXNkYXlAZ21haWwuY29tIiwiaWF0IjoxNTU0OTM3Njc4LCJleHAiOjE1NTQ5NDQ4NzgsImlzcyI6Im1vbmRheS5sdW5kaWkifQ.XBP-AmW9ssM6T3GYeQIY-GUGMu7vjR2bbXey3Hc0dUU').end(function (err, res) {
      expect(res).to.have.status(401);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
});