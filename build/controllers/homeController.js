"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _check = require("express-validator/check");

var _util = require("../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Home route controller class
 * @class
 */
var HomeController =
/*#__PURE__*/
function () {
  /**
   * Constructor for home route controller class
   * @constructor
   * @param {Store} store - the store class used for storing data
   */
  function HomeController(store) {
    _classCallCheck(this, HomeController);

    this.store = store;
    this.signup = this.signup.bind(this);
    this.signin = this.signin.bind(this);
  }
  /**
   * Method for handling signup route(POST api/v1/signup)
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */


  _createClass(HomeController, [{
    key: "signup",
    value: function signup(req, res) {
      var _this = this;

      var errors = (0, _check.validationResult)(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          error: 'Please enter a valid email address'
        });
      }

      var reqFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
      var required = (0, _util.checkReqFields)(Object.keys(req.body), reqFields);

      if (required >= 0) {
        return res.status(400).json({
          status: 400,
          error: "".concat(reqFields[required], " is required")
        });
      }

      var _req$body = req.body,
          password = _req$body.password,
          confirmPassword = _req$body.confirmPassword;

      if (!(0, _util.passwordMatch)(password, confirmPassword)) {
        return res.status(400).json({
          status: 400,
          error: 'Password and confirm password does not match'
        });
      }

      var emailField = {
        email: req.body.email
      };
      this.store.userStore.read(emailField, function (err, result) {
        if (err) throw new Error('Error reading data');

        if (result && result.length) {
          return res.status(400).json({
            status: 400,
            error: 'Email already exits'
          });
        }

        var hashPass = (0, _util.hashPassword)(req.body.password);
        req.body.password = hashPass;
        var data = {
          id: 1,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
          type: 'client',
          isAdmin: 'false'
        };

        _this.store.userStore.create(data, function (er, dataR) {
          if (er) throw new Error('Error creating file');
          var payload = {
            firstName: req.body.firstName,
            email: req.body.email
          };
          var options = {
            expiresIn: '2h',
            issuer: 'monday.lundii'
          };
          var secret = process.env.JWT_SECRET || 'yougofindmesoteyyougotire';

          var token = _jsonwebtoken["default"].sign(payload, secret, options);

          dataR[0].token = token;
          var response = {
            status: 200,
            data: dataR[0]
          };
          return res.status(200).json(response);
        });
      });
    }
    /**
     * Method for handling signin route(POST api/v1/auth/signin)
     * @param {object} req - the request object
     * @param {object} res  - the response object
     */

  }, {
    key: "signin",
    value: function signin(req, res) {
      var reqFields = ['email', 'password'];
      var required = (0, _util.checkReqFields)(Object.keys(req.body), reqFields);

      if (required >= 0) {
        return res.status(400).json({
          status: 400,
          error: "".concat(reqFields[required], " is required")
        });
      }

      var emailField = {
        email: req.body.email
      };
      this.store.userStore.read(emailField, function (err, result) {
        if (err) throw new Error('Error reading data');

        if (result && !result.length) {
          return res.status(403).json({
            status: 403,
            error: 'username or password is incorrect'
          });
        }

        var verifypassword = (0, _util.comparePassword)(req.body.password, result[0].password);

        if (!verifypassword) {
          return res.status(403).json({
            status: 403,
            error: 'username or password is incorrect'
          });
        }

        var payload = {
          firstName: result[0].firstName,
          email: result[0].email
        };
        var options = {
          expiresIn: '2h',
          issuer: 'monday.lundii'
        };
        var secret = process.env.JWT_SECRET || 'yougofindmesoteyyougotire';

        var token = _jsonwebtoken["default"].sign(payload, secret, options);

        result[0].token = token;
        var response = {
          status: 200,
          data: result[0]
        };
        return res.status(200).json(response);
      });
    }
  }]);

  return HomeController;
}();

var _default = HomeController;
exports["default"] = _default;