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
    this.store = store;
    this.userController = new _controllers["default"].UserController(store);
    this.verifyIsClient = this.verifyIsClient.bind(this);
  }
  /**
   * Method used for routing
   */


  _createClass(UserRouter, [{
    key: "route",
    value: function route() {
      this.router.route('/:id/accounts').post(_util.validateToken, [(0, _check.body)(['firstName', 'lastName', 'email', 'type'], 'field is required').exists(), (0, _check.body)(['firstName', 'lastName', 'type'], ' cannot be empty').isLength({
        min: 1
      }), (0, _check.body)('type', 'Account type can either be savings or current').custom(function (value) {
        if (value !== 'savings' && value !== 'current') {
          return Promise.reject(new Error('Account type can either be savings or current'));
        }

        return Promise.resolve(true);
      })], _util.validate, this.userController.createAccount);
      this.router.route('/:id/:accountNumber/transactions').get(_util.validateToken, this.verifyIsClient, this.userController.accountHistory);
      this.router.route('/:id/transactions/:transId').get(_util.validateToken, this.verifyIsClient, this.userController.specificTranHist);
      this.router.route('/:id/accounts/:accountNumber').get(_util.validateToken, this.verifyIsClient, this.userController.specAcctDetails);
      return this.router;
    }
    /**
     * Private method used to check if user is a client
     * @private
     * @param {object} req - the server request object
     * @param {object} res - the server response object
     * @param {function} next - express middleware next() function
     */

  }, {
    key: "verifyIsClient",
    value: function verifyIsClient(req, res, next) {
      req.params.id = parseInt(req.params.id, 10);
      this.store.userStore.read({
        id: req.params.id
      }, function (err, result) {
        if (result && !result.length || result[0].type !== 'client') {
          return res.status(401).json({
            status: 401,
            error: 'Unauthorized access'
          });
        }

        next();
      });
    }
  }]);

  return UserRouter;
}();

exports["default"] = UserRouter;