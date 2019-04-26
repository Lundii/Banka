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

describe('Create Bank Account', function () {
  after(function (done) {
    _server.store.userStore.remove({
      email: 'differentmail@email.com'
    }, function (err, result) {
      done();
    });
  });
  it('should return a status 200 if user is registered and have a valid token', function (done) {
    var body = {
      firstName: 'Sunday',
      lastName: 'Monday',
      email: 'differentmail@email.com',
      password: 'password',
      confirmPassword: 'password'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/signup').send(body).end(function (err, res) {
      expect(res.body.data).to.include.all.keys('token');
      expect(res.body.data.token).to.be.a('String');
      var _res$body$data = res.body.data,
          token = _res$body$data.token,
          id = _res$body$data.id;
      var body2 = {
        firstName: res.body.data.firstName,
        lastName: res.body.data.lastName,
        email: res.body.data.email,
        type: 'savings'
      };

      _chai["default"].request(_server["default"]).post("/api/v1/user/".concat(id, "/accounts")).send(body2).set('Authorization', token).end(function (er, resp) {
        expect(resp).to.have.status(200);
        expect(resp).to.be.a('object');
        expect(resp.body).to.have.all.keys('status', 'data');
        expect(resp.body.data).to.include.all.keys('accountNumber', 'firstName', 'lastName', 'email', 'type', 'openingBalance');
        expect(resp.body.data.accountNumber).to.be.a('Number');
        expect(resp.body.data.firstName).to.be.a('String');
        expect(resp.body.data.lastName).to.be.a('String');
        expect(resp.body.data.email).to.be.a('String');
        expect(resp.body.data.type).to.be.a('String');
        expect(resp.body.data.openingBalance).to.be.a('Number');

        _server.store.bankAcctStore.remove({
          accountNumber: resp.body.data.accountNumber
        }, function (error, re) {
          done();
        });
      });
    });
  });
  it('should return a status 401 is user does not have a valid or expired token', function (done) {
    var body = {
      firstName: 'Sunday',
      lastName: 'Monday',
      email: 'differentmail@email.com',
      type: 'savings'
    };

    _chai["default"].request(_server["default"]).post('/api/v1/user/50087744345864345/accounts').send(body).set('Authorization', 'ghjklldiOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJtb25kYXkiLCJlbWFpbCI6Im1vbmRheXR1ZXNkYXlAZ21haWwuY29tIiwiaWF0IjoxNTU0OTM3Njc4LCJleHAiOjE1NTQ5NDQ4NzgsImlzcyI6Im1vbmRheS5sdW5kaWkifQ.XBP-AmW9ssM6T3GYeQIY-GUGMu7vjR2bbXey3Hc0dUU').end(function (err, res) {
      expect(res).to.have.status(401);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
});