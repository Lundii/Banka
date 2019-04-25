"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _server = _interopRequireDefault(require("../../server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-unused-expressions */

/* eslint-disable no-undef */
var expect = _chai["default"].expect;

_chai["default"].use(_chaiHttp["default"]);

describe('Reset password route', function () {
  it('should return a status 200 if route is reached', function (done) {
    _chai["default"].request(_server["default"]).get('/api/v1/passwordreset').end(function (err, res) {
      expect(res).to.be.html;
      done();
    });
  });
  it('should return a status 400 if user is invalid', function (done) {
    _chai["default"].request(_server["default"]).post('/api/v1/passwordreset_form').end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
  it('should return a status 400 if user is invalid', function (done) {
    _chai["default"].request(_server["default"]).get('/api/v1/passwordreset_form/3423/werfgjiuiytgj').end(function (err, res) {
      expect(res).to.have.status(400);
      expect(res).to.be.a('object');
      expect(res.body).to.have.all.keys('status', 'error');
      expect(res.body.error).to.be.a('String');
      done();
    });
  });
});