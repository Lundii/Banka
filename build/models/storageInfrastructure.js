"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defaultDatas = require("./defaultDatas");

var _index = require("../util/index");

var _assert = require("assert");

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

    if (!store.userStore) throw new Error('UserStore cannot be null');
    if (!store.bankAcctStore) throw new Error('BankAcctStore cannot be null');
    this.init = this.init.bind(this);
    this.userStore = store.userStore;
    this.bankAcctStore = store.bankAcctStore;
    this.transactionStore = store.transactionStore;
    this._createDefaultUsers = this._createDefaultUsers.bind(this);
    this._createDafaultAccounts = this._createDafaultAccounts.bind(this);
    this._createDefaultTransactions = this._createDefaultTransactions.bind(this);
  }
  /**
   * The initialization method
   */


  _createClass(StorageInfrastructure, [{
    key: "init",
    value: function init() {
      this._createDefaultUsers();

      this._createDafaultAccounts();

      this._createDefaultTransactions();
    }
    /**
     * Private method for creating default users
     * @private
     */

  }, {
    key: "_createDefaultUsers",
    value: function _createDefaultUsers() {
      _defaultDatas.Users.forEach(function (object) {
        var hashPass = (0, _index.hashPassword)(object.password);
        object.password = hashPass;
      });

      this.userStore.create(_defaultDatas.Users, function (err, result) {
        if (err) throw new Error('Error creating default users');
      });
    }
    /**
     * Private method for creating default accounts
     * @private
     */

  }, {
    key: "_createDafaultAccounts",
    value: function _createDafaultAccounts() {
      this.bankAcctStore.create(_defaultDatas.Accounts, function (err, result) {
        if (err) throw new Error('Error creating default accounts');
      });
    }
    /**
     * Private method for creating default transactions
     * @private
     */

  }, {
    key: "_createDefaultTransactions",
    value: function _createDefaultTransactions() {
      this.transactionStore.create(_defaultDatas.Accounts, function (err, result) {
        if (err) throw new Error('Error creating default transactions');
      });
    }
  }]);

  return StorageInfrastructure;
}();

var _default = StorageInfrastructure;
exports["default"] = _default;