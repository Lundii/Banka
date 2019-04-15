"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _check = require("express-validator/check");

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
    this.bankAcctStore = store.bankAcctStore;
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
      })], _util.validate, this.homeController.signup);
      this.router.route('/auth/signin').post([(0, _check.body)(['email', 'password'], 'field is required').exists(), (0, _check.body)('email', 'is invalid'), (0, _check.body)(['email, password'], 'cannot be empty').isEmpty()], _util.validate, this.homeController.signin);
      return this.router;
    }
  }]);

  return HomeRouter;
}();

exports["default"] = HomeRouter;