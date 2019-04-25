"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Infrastructure class for setting up initial storage values
 * @class
 */
var StorageInfrastructure =
/*#__PURE__*/
function () {
  function StorageInfrastructure(store) {
    _classCallCheck(this, StorageInfrastructure);

    this.init = this.init.bind(this);
    this.userStore = store.userStore;
    this.bankAcctStore = store.bankAcctStore;
    this.transactionStore = store.transactionStore;
    this.createTables = this.createTables.bind(this);
    this.createDefaultAdmin = this.createDefaultAdmin.bind(this);
    this.createDefaultStaff = this.createDefaultStaff.bind(this);
  }
  /**
   * The initialization method
   */


  _createClass(StorageInfrastructure, [{
    key: "init",
    value: function init() {
      this.createTables();
    }
    /**
     * Creates table for the database
     */

  }, {
    key: "createTables",
    value: function createTables() {
      var _this = this;

      this.userStore.createTable(function (err, result) {
        _this.bankAcctStore.createTable(function (err1, result1) {
          _this.transactionStore.createTable(function (err2, result2) {
            _this.createDefaultAdmin();
          });
        });
      });
    }
    /**
     * Creates a default admin for the application
     */

  }, {
    key: "createDefaultAdmin",
    value: function createDefaultAdmin() {
      var _this2 = this;

      this.userStore.read({
        email: _config["default"].development.adminAccount.email
      }, function (err, result) {
        _this2.createDefaultStaff();

        if (result && !result.length) {
          _this2.userStore.create(_config["default"].development.adminAccount, function (er, res) {
            _this2.createDefaultStaff();
          });
        }
      });
    }
    /**
     * Creates a default staff for the application
     */

  }, {
    key: "createDefaultStaff",
    value: function createDefaultStaff() {
      var _this3 = this;

      this.userStore.read({
        email: _config["default"].development.staffAccount.email
      }, function (err, result) {
        if (result && !result.length) {
          _this3.userStore.create(_config["default"].development.staffAccount, function (er, res) {});
        }
      });
    }
  }]);

  return StorageInfrastructure;
}();

var _default = StorageInfrastructure;
exports["default"] = _default;