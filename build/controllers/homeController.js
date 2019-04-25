"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _path = _interopRequireDefault(require("path"));

var _util = require("../util");

var _config = _interopRequireDefault(require("../config"));

var _emailServices = _interopRequireDefault(require("../util/emailServices"));

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
    this.getResetMail = this.getResetMail.bind(this);
    this.sendResetLink = this.sendResetLink.bind(this);
    this.sendResetForm = this.sendResetForm.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
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
          var secret = process.env.JWT_SECRET || 'yougofindmesoteyyougotire';

          var token = _jsonwebtoken["default"].sign(payload, secret, _config["default"].jwt_options);

          dataR[0].token = token;
          var data1 = {
            id: dataR[0].id,
            firstName: dataR[0].firstname,
            lastName: dataR[0].lastname,
            email: dataR[0].email,
            type: dataR[0].type,
            isAdmin: dataR[0].isadmin,
            token: dataR[0].token
          };
          var response = {
            status: 200,
            data: data1
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
        var secret = process.env.JWT_SECRET || 'yougofindmesoteyyougotire';

        var token = _jsonwebtoken["default"].sign(payload, secret, _config["default"].jwt_options);

        result[0].token = token;
        var resData = {
          id: result[0].id,
          firstName: result[0].firstname,
          lastName: result[0].lastname,
          email: result[0].email,
          token: result[0].token
        };
        var response = {
          status: 200,
          data: resData
        };
        return res.status(200).json(response);
      });
    }
    /**
     * Method for sending to input email for password reset
     * @param {object} req - the request object
     * @param {object} res  - the response object
     */

  }, {
    key: "getResetMail",
    value: function getResetMail(req, res) {
      res.status(200).sendFile(_path["default"].join(__dirname, '/files/userEmail.html'));
    }
    /**
     * Method for sending email reset link for password reset
     * @param {object} req - the request object
     * @param {object} res  - the response object
     */

  }, {
    key: "sendResetLink",
    value: function sendResetLink(req, res) {
      this.store.userStore.read({
        email: req.body.email
      }, function (err, result) {
        var payload = {
          email: req.body.email,
          password: result[0].password
        };
        var secret = result[0].password + req.body.email;

        var token = _jsonwebtoken["default"].sign(payload, secret, _config["default"].jwt_options);

        result[0].token = token;

        _emailServices["default"].sendResetLink(result[0], function (err1, result1) {
          if (err1) {
            return res.status(500).json({
              status: 500,
              error: 'there was an error sending your reset link, make sure you are connected to the internet. Please re-enter your mail and resend'
            });
          }

          res.status(200).sendFile(_path["default"].join(__dirname, '..', '/controllers/files/emailLink.html'));
        });
      });
    }
    /**
     * Method for sending password reset form
     * @param {object} req - the request object
     * @param {object} res  - the response object
     */

  }, {
    key: "sendResetForm",
    value: function sendResetForm(req, res) {
      res.cookie('auth', req.params.token, {
        expires: new Date(Date.now() + 900000)
      });
      res.cookie('id', req.params.id, {
        expires: new Date(Date.now() + 900000)
      });
      res.status(200).sendFile(_path["default"].join(__dirname, '..', '/controllers/files/passwordResetForm.html'));
    }
    /**
     * Method for reseting the password
     * @param {object} req - the request object
     * @param {object} res  - the response object
     */

  }, {
    key: "resetPassword",
    value: function resetPassword(req, res) {
      var hashPass = (0, _util.hashPassword)(req.body.password);
      this.store.userStore.update({
        id: req.cookies.id
      }, {
        password: hashPass
      }, function (err, result) {
        res.status(200).json({
          status: 200,
          message: 'password successfully changed'
        });
      });
    }
  }]);

  return HomeController;
}();

var _default = HomeController;
exports["default"] = _default;