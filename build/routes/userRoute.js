"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _controllers = _interopRequireDefault(require("../controllers"));

var _util = require("../util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Creates a router class for using page APIs
 * @class
 */
var UserRouter =
/*#__PURE__*/
function () {
  /**
   * Constructor for creating the UserRouter class
   * @constructor
   * @param {Router} router - express router class
   * @param {Store} store - Store classes used in the application
   */
  function UserRouter(router, store) {
    _classCallCheck(this, UserRouter);

    this.router = router;
    this.userController = new _controllers["default"].UserController(store);
  }
  /**
   * Method used for routing
   */


  _createClass(UserRouter, [{
    key: "route",
    value: function route() {
      this.router.route('/accounts').post(_util.validateToken, this.userController.createAccount);
      return this.router;
    }
  }]);

  return UserRouter;
}();

exports["default"] = UserRouter;