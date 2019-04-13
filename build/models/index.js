"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bankAcctStore = _interopRequireDefault(require("./bankAcctStore"));

var _userStore = _interopRequireDefault(require("./userStore"));

var _transactionStore = _interopRequireDefault(require("./transactionStore"));

var _storageInfrastructure = _interopRequireDefault(require("./storageInfrastructure"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  BankAcctStore: _bankAcctStore["default"],
  UserStore: _userStore["default"],
  TransactionStore: _transactionStore["default"],
  StorageInfrastructure: _storageInfrastructure["default"]
};
exports["default"] = _default;