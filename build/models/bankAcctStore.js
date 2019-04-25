"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _store = _interopRequireDefault(require("./store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Bank Account Store class
 * @class
 * @extends Store
 */
var BankAcctStore =
/*#__PURE__*/
function (_Store) {
  _inherits(BankAcctStore, _Store);

  /**
   * Constructor for class BankAcctStore
   * @param {sting} name - the name of store
   * @param {Database} database - the database to use for storage
   */
  function BankAcctStore(name, pool) {
    _classCallCheck(this, BankAcctStore);

    var createAccountTable = "CREATE TABLE IF NOT EXISTS ".concat(name, "(\n      id SERIAL PRIMARY KEY,\n      accountNumber INTEGER UNIQUE NOT NULL,\n      ownerEmail VARCHAR(300) REFERENCES users(email) ON DELETE CASCADE NOT NULL,\n      type VARCHAR (50) NOT NULL,\n      status VARCHAR (20) NOT NULL,\n      balance REAL NOT NULL,\n      createdOn TIMESTAMP\n    );");
    return _possibleConstructorReturn(this, _getPrototypeOf(BankAcctStore).call(this, name, pool, createAccountTable));
  }

  return BankAcctStore;
}(_store["default"]);

var _default = BankAcctStore;
exports["default"] = _default;