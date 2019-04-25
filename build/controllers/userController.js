"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = require("../util");

var _emailServices = _interopRequireDefault(require("../util/emailServices"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Home route controller class
 * @class
 */
var UserController =
/*#__PURE__*/
function () {
  /**
   * Constructor for user route controller class
   * @constructor
   * @param {Store} store - the store class used for storing data
   */
  function UserController(store) {
    _classCallCheck(this, UserController);

    this.store = store;
    this.createAccount = this.createAccount.bind(this);
    this.accountHistory = this.accountHistory.bind(this);
    this.specificTranHist = this.specificTranHist.bind(this);
    this.specAcctDetails = this.specAcctDetails.bind(this);
  }
  /**
   * Method for handling creating account route(POST api/v1/accounts)
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */


  _createClass(UserController, [{
    key: "createAccount",
    value: function createAccount(req, res) {
      var accountNumber = (0, _util.generateAccountNumber)(req.body.type);
      var data = {
        accountNumber: accountNumber,
        createdOn: new Date(),
        ownerEmail: req.body.email,
        type: req.body.type,
        status: 'active',
        balance: 0.00
      };
      this.store.bankAcctStore.create(data, function (err, result) {
        console.log(err);
        if (err) throw new Error('Error saving account Number');
        result[0].firstName = req.body.firstName;
        result[0].lastName = req.body.lastName;
        result[0].email = req.body.email;

        _emailServices["default"].createAccount(result[0]);

        var response = {
          status: 200,
          data: {
            id: result[0].id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            accountNumber: result[0].accountnumber,
            email: req.body.email,
            type: result[0].type,
            status: result[0].status,
            openingBalance: result[0].balance
          }
        };
        res.status(200).json(response);
      });
    }
    /**
     * Method for getting account history
     * @param {object} req - the request object
     * @param {object} res  - the response object
     */

  }, {
    key: "accountHistory",
    value: function accountHistory(req, res) {
      this.store.transactionStore.read({
        accountNumber: req.params.accountNumber
      }, function (err, result) {
        if (result && !result.length) {
          return res.status(200).json({
            status: 200,
            message: 'No transaction for this account'
          });
        }

        var resp = {
          status: 200,
          data: result
        };
        res.status(200).json(resp);
      });
    }
    /**
     * Method for getting a specific account transaction history
     * @param {object} req - the request object
     * @param {object} res  - the response object
     */

  }, {
    key: "specificTranHist",
    value: function specificTranHist(req, res) {
      this.store.transactionStore.read({
        id: req.params.transId
      }, function (err, result) {
        if (result && !result.length) {
          return res.status(400).json({
            status: 400,
            error: 'Transaction does not exit'
          });
        }

        var resp = {
          status: 200,
          data: result[0]
        };
        res.status(200).json(resp);
      });
    }
    /**
     * Method for getting a specific account details
     * @param {object} req - the request object
     * @param {object} res  - the response object
     */

  }, {
    key: "specAcctDetails",
    value: function specAcctDetails(req, res) {
      this.store.bankAcctStore.read({
        accountNumber: req.params.accountNumber
      }, function (err, result) {
        if (result && !result.length) {
          return res.status(400).json({
            status: 400,
            error: 'Account does not exit'
          });
        }

        var resp = {
          status: 200,
          data: result[0]
        };
        res.status(200).json(resp);
      });
    }
  }]);

  return UserController;
}();

var _default = UserController;
exports["default"] = _default;