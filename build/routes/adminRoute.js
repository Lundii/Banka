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
 * Creates a router class for staff page APIs
 * @class
 */
var StaffRouter =
/*#__PURE__*/
function () {
  /**
   * Constructor for creating the AdminRouter class
   * @constructor
   * @param {Router} router - express router class
   * @param {Store} store - Store classes used in the application
   */
  function StaffRouter(router, store) {
    _classCallCheck(this, StaffRouter);

    this.router = router;
    this.store = store;
    this.adminController = new _controllers["default"].AdminController(store);
    this.staffController = new _controllers["default"].StaffController(store);
    this._verifyIfAdmin = this._verifyIfAdmin.bind(this);
    this._verifyIfStaff = this._verifyIfStaff.bind(this);
  }
  /**
   * Method used for routing
   */


  _createClass(StaffRouter, [{
    key: "route",
    value: function route() {
      this.router.route('/:_id/account/:accountNumber').patch(_util.validateToken, this._verifyIfStaff, this.staffController.actDeactAccount);
      this.router.route('/:_id/account/:accountNumber')["delete"](_util.validateToken, this._verifyIfStaff, this.staffController.deleteAccount);
      return this.router;
    }
    /**
     * Private method used to check if user is a staff
     * @private
     * @param {object} req - the server request object
     * @param {object} res - the server response object
     * @param {function} next - express middleware next() function
     */

  }, {
    key: "_verifyIfStaff",
    value: function _verifyIfStaff(req, res, next) {
      req.params._id = parseInt(req.params._id);
      this.store.userStore.read({
        _id: req.params._id
      }, function (err, result) {
        if (result.length && result[0].type !== 'staff') {
          return res.status(401).json({
            status: 401,
            error: 'Unauthorized access'
          });
        }

        next();
      });
    }
    /**
     * Private method used to check if user is an staff
     * @private
     * @param {object} req - the server request object
     * @param {object} res - the server response object
     * @param {function} next - express middleware next() function
     */

  }, {
    key: "_verifyIfAdmin",
    value: function _verifyIfAdmin(req, res, next) {
      req.params._id = parseInt(req.params._id);
      this.store.userStore.read({
        _id: req.params._id
      }, function (err, result) {
        if (result.length && result[0].isAdmin === false) {
          return res.status(401).json({
            status: 401,
            error: 'Unauthorized access'
          });
        }

        next();
      });
    }
  }]);

  return StaffRouter;
}();

exports["default"] = StaffRouter;