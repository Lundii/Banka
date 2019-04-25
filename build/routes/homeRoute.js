"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _check = require("express-validator/check");

var _path = _interopRequireDefault(require("path"));

var _controllers = _interopRequireDefault(require("../controllers"));

var _util = require("../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Creates a router class for handling landing page APIs
 * @class
 */
var HomeRouter =
/*#__PURE__*/
function () {
  /**
   * Constructor for creating the HomeRouter class
   * @constructor
   * @param {Router} router - express router class
   * @param {Store} store - Store classes used in the application
   */
  function HomeRouter(router, store) {
    _classCallCheck(this, HomeRouter);

    this.router = router;
    this.store = store;
    this.verifyUser = this.verifyUser.bind(this);
    this.setHeaderscookies = this.setHeaderscookies.bind(this);
    this.setHeadersparams = this.setHeadersparams.bind(this);
    this.homeController = new _controllers["default"].HomeController(store);
  }
  /**
   * Method used for routing
   */


  _createClass(HomeRouter, [{
    key: "route",
    value: function route() {
      this.router.route('/').get(function (req, res) {
        res.status(200).json({
          status: 200,
          message: 'Welcome to Banka app'
        });
      });
      this.router.route('/signup').post(_util.passwordMatch, [(0, _check.body)(['firstName', 'lastName', 'email', 'password', 'confirmPassword'], 'field is required').exists(), (0, _check.body)('email', 'is invalid').isEmail(), (0, _check.body)(['firstName', 'lastName', 'password', 'confirmPassword'], ' cannot be empty').isLength({
        min: 1
      }), (0, _check.body)('confirmPassword', 'Confirm password does not match password').custom(function (value, _ref) {
        var req = _ref.req;

        if (value !== req.body.password) {
          return Promise.reject(new Error('Confirm password does not match password'));
        }

        return Promise.resolve(true);
      })], _util.validate, this.homeController.signup);
      this.router.route('/auth/signin').post([(0, _check.body)(['email', 'password'], 'field is required').exists(), (0, _check.body)('email', 'is invalid').isEmail(), (0, _check.body)(['email', 'password'], 'cannot be empty').isLength({
        min: 1
      })], _util.validate, this.homeController.signin);
      this.router.route('/passwordreset').get(this.homeController.getResetMail).post([(0, _check.body)('email', 'field is required').exists(), (0, _check.body)('email', 'is invalid').isEmail(), (0, _check.body)(['email'], 'cannot be empty').isLength({
        min: 1
      })], _util.validate, this.verifyUser, this.homeController.sendResetLink);
      this.router.route('/passwordreset_form/:id/:token').get(this.setHeadersparams, _util.validateToken, this.homeController.sendResetForm);
      this.router.route('/passwordreset_form').post(this.setHeaderscookies, _util.validateToken, [(0, _check.body)(['password', 'confirmPassword'], 'field is required').exists(), (0, _check.body)(['password', 'confirmPassword'], ' cannot be empty').isLength({
        min: 1
      }), (0, _check.body)('confirmPassword', 'Confirm password does not match password').custom(function (value, _ref2) {
        var req = _ref2.req;

        if (value !== req.body.password) {
          return Promise.reject(new Error('Confirm password does not match password'));
        }

        return Promise.resolve(true);
      })], _util.validate, this.homeController.resetPassword);
      return this.router;
    }
    /**
      * Middlware to check if a user exits in the database
      * @private
      * @param {object} req - the server request object
      * @param {object} res - the server response object
      * @param {function} next - express middleware next() function
      */

  }, {
    key: "verifyUser",
    value: function verifyUser(req, res, next) {
      this.store.userStore.read({
        email: req.body.email
      }, function (err, result) {
        if (result && !result.length) {
          res.status(400).sendFile(_path["default"].join(__dirname, '..', '/controllers/files/incorrectMail.html'));
        }
      });
      next();
    }
    /**
      * Middlware for setting token authorization form req.params
      * @private
      * @param {object} req - the server request object
      * @param {object} res - the server response object
      * @param {function} next - express middleware next() function
      */

  }, {
    key: "setHeadersparams",
    value: function setHeadersparams(req, res, next) {
      req.headers.authorization = req.params.token;
      this.store.userStore.read({
        id: req.params.id
      }, function (err, result) {
        if (result && result.length) {
          req.body.tokenSecret = result[0].password + result[0].email;
          next();
        } else {
          return res.status(400).json({
            status: 400,
            error: 'User does not exit'
          });
        }
      });
    }
    /**
      * Middlware for setting token authorization form req.cookies
      * @private
      * @param {object} req - the server request object
      * @param {object} res - the server response object
      * @param {function} next - express middleware next() function
      */

  }, {
    key: "setHeaderscookies",
    value: function setHeaderscookies(req, res, next) {
      req.headers.authorization = req.cookies.auth;
      this.store.userStore.read({
        id: req.cookies.id
      }, function (err, result) {
        if (result && result.length) {
          req.body.tokenSecret = result[0].password + result[0].email;
          next();
        } else {
          return res.status(400).json({
            status: 400,
            error: 'User does not exit'
          });
        }
      });
    }
  }]);

  return HomeRouter;
}();

exports["default"] = HomeRouter;