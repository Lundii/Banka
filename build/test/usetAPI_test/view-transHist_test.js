"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireDefault(require("../../server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-unused-expressions */

/* eslint-disable no-undef */
var expect = _chai["default"].expect;

_chai["default"].use(_chaiHttp["default"]);

describe('User can view account transaction history', function () {
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
        expect(resp).to.have.status(200);
        expect(resp).to.be.a('object');
        expect(resp.body).to.have.all.keys('status', 'data');
        expect(resp.body.data).to.be.a('Array');
        expect(resp.body.data[0]).to.be.a('object');
        expect(resp.body.data[0]).to.include.all.keys('id', 'createdon', 'accountnumber', 'amount', 'type', 'oldbalance', 'newbalance');
        expect(resp.body.data[0].accountnumber).to.be.a('Number');
        expect(resp.body.data[0].id).to.be.a('Number');
        expect(resp.body.data[0].amount).to.be.a('Number');
        expect(resp.body.data[0].type).to.be.a('String');
        expect(resp.body.data[0].oldbalance).to.be.a('Number');
        expect(resp.body.data[0].newbalance).to.be.a('Number');
        done();
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
      var _res$body$data2 = res.body.data,
          token = _res$body$data2.token,
          id = _res$body$data2.id;

      _chai["default"].request(_server["default"]).get("/api/v1/user/".concat(id, "/1004837498/transactions")).set('Authorization', token).end(function (er, resp) {
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

    _chai["default"].request(_server["default"]).get("/api/v1/user/".concat(id, "/1004837498/transactions")).set('Authorization', 'ghjklldiOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJtb25kYXkiLCJlbWFpbCI6Im1vbmRheXR1ZXNkYXlAZ21haWwuY29tIiwiaWF0IjoxNTU0OTM3Njc4LCJleHAiOjE1NTQ5NDQ4NzgsImlzcyI6Im1vbmRheS5sdW5kaWkifQ.XBP-AmW9ssM6T3GYeQIY-GUGMu7vjR2bbXey3Hc0dUU').end(function (err, res) {
      expect(res).to.have.status(401);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
});