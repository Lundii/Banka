"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireDefault(require("../../server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-unused-expressions */

/* eslint-disable no-undef */
var expect = _chai["default"].expect;

_chai["default"].use(_chaiHttp["default"]);

describe('User can view specific account transaction history', function () {
  it('should return a status 200 if the request is successful', function (done) {
    var body = {
      email: 'chukwudi.james@email.com',
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res.body.data).to.include.all.keys('token');
      expect(res.body.data.token).to.be.a('String');
      var _res$body$data = res.body.data,
          token = _res$body$data.token,
          id = _res$body$data.id;

      _chai["default"].request(_server["default"]).get("/api/v1/user/".concat(id, "/1004848398/transactions")).set('Authorization', token).end(function (er, resp) {
        var transId = resp.body.data[0].id;

        _chai["default"].request(_server["default"]).get("/api/v1/user/".concat(id, "/transactions/").concat(transId)).set('Authorization', token).end(function (er1, resp1) {
          expect(resp1).to.have.status(200);
          expect(resp1).to.be.a('object');
          expect(resp1.body).to.have.all.keys('status', 'data');
          expect(resp1.body.data).to.be.a('object');
          expect(resp1.body.data).to.include.all.keys('id', 'createdon', 'accountnumber', 'amount', 'type', 'oldbalance', 'newbalance');
          expect(resp1.body.data.accountnumber).to.be.a('Number');
          expect(resp1.body.data.id).to.be.a('Number');
          expect(resp1.body.data.amount).to.be.a('Number');
          expect(resp1.body.data.type).to.be.a('String');
          expect(resp1.body.data.oldbalance).to.be.a('Number');
          expect(resp1.body.data.newbalance).to.be.a('Number');
          done();
        });
      });
    });
  });
  it('should return a status 400 if transaction id is invalid/incorrect', function (done) {
    var body = {
      email: 'chukwudi.james@email.com',
      password: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/auth/signin').send(body).end(function (err, res) {
      expect(res.body.data).to.include.all.keys('token');
      expect(res.body.data.token).to.be.a('String');
      var _res$body$data2 = res.body.data,
          token = _res$body$data2.token,
          id = _res$body$data2.id;

      _chai["default"].request(_server["default"]).get("/api/v1/user/".concat(id, "/1004848398/transactions")).set('Authorization', token).end(function (er, resp) {
        _chai["default"].request(_server["default"]).get("/api/v1/user/".concat(id, "/transactions/1211")).set('Authorization', token).end(function (er1, resp1) {
          expect(resp1).to.have.status(400);
          expect(resp1).to.be.a('object');
          expect(resp1.body).to.have.all.keys('status', 'error');
          expect(resp1.body.error).to.be.a('String');
          done();
        });
      });
    });
  });
  it('should return a status 401 if the client is not a user (client)', function (done) {
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

      _chai["default"].request(_server["default"]).get("/api/v1/user/".concat(id, "/transactions/76")).set('Authorization', token).end(function (er, resp) {
        expect(resp).to.have.status(401);
        expect(resp).to.be.a('object');
        expect(resp.body).to.have.all.keys('status', 'error');
        expect(resp.body.error).to.be.a('String');
        done();
      });
    });
  });
  it('should return a status 401 is user does not have a valid or expired token', function (done) {
    var id = 50048987839302;

    _chai["default"].request(_server["default"]).get("/api/v1/user/".concat(id, "/transactions/980")).set('Authorization', 'ghjklldiOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJtb25kYXkiLCJlbWFpbCI6Im1vbmRheXR1ZXNkYXlAZ21haWwuY29tIiwiaWF0IjoxNTU0OTM3Njc4LCJleHAiOjE1NTQ5NDQ4NzgsImlzcyI6Im1vbmRheS5sdW5kaWkifQ.XBP-AmW9ssM6T3GYeQIY-GUGMu7vjR2bbXey3Hc0dUU').end(function (err, res) {
      expect(res).to.have.status(401);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
});