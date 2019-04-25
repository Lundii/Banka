"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _emailServices = _interopRequireDefault(require("../util/emailServices"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Staff route controller class
 * @class
 */
var StaffController =
/*#__PURE__*/
function () {
  /**
   * Constructor for staff route controller class
   * @constructor
   * @param {Store} store - the store class used for storing data
   */
  function StaffController(store) {
    _classCallCheck(this, StaffController);

    this.store = store;
    this.actDeactAccount = this.actDeactAccount.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.creditAccount = this.creditAccount.bind(this);
    this.debitAccount = this.debitAccount.bind(this);
    this.viewAccountList = this.viewAccountList.bind(this);
    this.viewSpecificAccount = this.viewSpecificAccount.bind(this);
  }
  /**
   * Method for handling activating or deactivating account route(PATCH api/v1/staff/<id>/account/<accountNumber>)
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */


  _createClass(StaffController, [{
    key: "actDeactAccount",
    value: function actDeactAccount(req, res) {
      var _this = this;

      req.params.accountNumber = parseInt(req.params.accountNumber, 10);
      this.store.bankAcctStore.read({
        accountNumber: req.params.accountNumber
      }, function (err, result) {
        if (err) throw new Error('Cannot find account');

        if (!result.length) {
          return res.status(400).json({
            status: 400,
            error: 'Account number does not exit in the database'
          });
        }

        if (result[0].status === req.body.status) {
          return res.status(400).json({
            status: 400,
            error: "Account number is already ".concat(req.body.status)
          });
        }

        _this.store.bankAcctStore.update({
          accountNumber: req.params.accountNumber
        }, req.body, function (er, result2) {
          if (er) throw new Error('Error searching for file');
          var message = result2[0].status === 'dormant' ? 'Account successfully deactivated' : 'Account successfully activated';
          var response = {
            status: 200,
            data: {
              accountNumber: result2[0].accountnumber,
              status: result2[0].status,
              message: message
            }
          };
          res.status(200).json(response);
        });
      });
    }
    /**
     * Method for deleting an account route(DELETE api/v1/staff/<id>/account/<accountNumber>)
     * @param {object} req - the request object
     * @param {object} res  - the response object
     */

  }, {
    key: "deleteAccount",
    value: function deleteAccount(req, res) {
      var _this2 = this;

      req.params.accountNumber = parseInt(req.params.accountNumber, 10);
      this.store.bankAcctStore.read({
        accountNumber: req.params.accountNumber
      }, function (err, result) {
        if (err) throw new Error('Cannot find account');

        if (!result.length) {
          return res.status(400).json({
            status: 400,
            error: 'Account number does not exit in the database'
          });
        }

        _this2.store.bankAcctStore.remove({
          accountNumber: req.params.accountNumber
        }, function (er, result2) {
          var response = {
            status: 200,
            message: 'Account successfully deleted'
          };
          res.status(200).json(response);
        });
      });
    }
    /**
     * Method for handling crediting account route(POST api/v1/staff/<id>/transactions/<accountNumber>/credit)
     * @param {object} req - the request object
     * @param {object} res  - the response object
     */

  }, {
    key: "creditAccount",
    value: function creditAccount(req, res) {
      var _this3 = this;

      req.params.accountNumber = parseInt(req.params.accountNumber, 10);
      this.store.bankAcctStore.read({
        accountNumber: req.params.accountNumber
      }, function (err, result) {
        if (err) throw new Error('Cannot find account');

        if (!result.length) {
          return res.status(400).json({
            status: 400,
            error: 'Account number does not exit in the database'
          });
        }

        var data = {
          createdOn: new Date(),
          type: 'credit',
          accountNumber: req.params.accountNumber,
          cashier: parseFloat(req.params.id),
          amount: parseFloat(req.body.creditAmount),
          oldBalance: result[0].balance,
          newBalance: result[0].balance + parseFloat(req.body.creditAmount)
        };

        _this3.store.transactionStore.create(data, function (err1, result1) {
          if (err1) throw new Error('Error saving transaction');

          _emailServices["default"].transactionAlert(result[0].owneremail, result1[0]);

          _this3.store.bankAcctStore.update({
            accountNumber: req.params.accountNumber
          }, {
            balance: result1[0].newbalance
          }, function (err2, result2) {
            if (err2) throw new Error('Error updating transaction');
            var resp = {
              status: 200,
              data: {
                transactionId: result1[0].id,
                accountNumber: req.params.accountNumber.toString(),
                amount: parseFloat(result1[0].amount),
                cashier: req.params.id,
                transactionType: result1[0].type,
                accountBalance: result1[0].newbalance.toString()
              }
            };
            res.status(200).json(resp);
          });
        });
      });
    }
    /**
    * Method for handling deleting an account route(POST api/v1/staff/<id>/transactions/<accountNumber>/debit)
     * @param {object} req - the request object
     * @param {object} res  - the response object
     */

  }, {
    key: "debitAccount",
    value: function debitAccount(req, res) {
      var _this4 = this;

      req.params.accountNumber = parseInt(req.params.accountNumber, 10);
      this.store.bankAcctStore.read({
        accountNumber: req.params.accountNumber
      }, function (err, result) {
        if (err) throw new Error('Cannot find account');

        if (!result.length) {
          return res.status(400).json({
            status: 400,
            error: 'Account number does not exit in the database'
          });
        }

        if (parseFloat(req.body.debitAmount) > result[0].balance) {
          return res.status(400).json({
            status: 400,
            error: 'Insufficient Balance'
          });
        }

        if (result[0].status === 'dormant') {
          return res.status(400).json({
            status: 400,
            error: 'Account dormant'
          });
        }

        var data = {
          createdOn: new Date(),
          type: 'debit',
          accountNumber: req.params.accountNumber,
          cashier: parseFloat(req.params.id),
          amount: parseFloat(req.body.debitAmount),
          oldBalance: result[0].balance,
          newBalance: result[0].balance - parseFloat(req.body.debitAmount)
        };

        _this4.store.transactionStore.create(data, function (err1, result1) {
          if (err1) throw new Error('Error saving transaction');

          _emailServices["default"].transactionAlert(result[0].owneremail, result1[0]);

          _this4.store.bankAcctStore.update({
            accountNumber: req.params.accountNumber
          }, {
            balance: result1[0].newbalance
          }, function (err2, result2) {
            if (err2) throw new Error('Error updating transaction');
            var resp = {
              status: 200,
              data: {
                transactionId: result1[0].id,
                accountNumber: req.params.accountNumber.toString(),
                amount: parseFloat(result1[0].amount),
                cashier: req.params.id,
                transactionType: result1[0].type,
                accountBalance: result1[0].newbalance.toString()
              }
            };
            res.status(200).json(resp);
          });
        });
      });
    }
    /**
    * Method for viewing all account list
     * @param {object} req - the request object
     * @param {object} res  - the response object
     */

  }, {
    key: "viewAccountList",
    value: function viewAccountList(req, res) {
      if (req.query && req.query.status && req.query.status !== 'dormant' && req.query.status !== 'active') {
        return res.status(400).json({
          status: 400,
          error: "".concat(req.query.status, " account does not exit")
        });
      }

      if (req.query && Object.keys(req.query).length && Object.keys(req.query)[0] !== 'status') {
        return res.status(400).json({
          status: 400,
          error: 'invalid query parameters'
        });
      }

      if (req.query && req.query.status) {
        this.store.bankAcctStore.read({
          status: req.query.status
        }, function (err, result) {
          if (err) throw new Error('Error reading bank accounts');
          var resp = {
            status: 200,
            data: result
          };
          res.status(200).json(resp);
        });
      } else {
        this.store.bankAcctStore.read({}, function (err, result) {
          if (err) throw new Error('Error reading bank accounts');
          var resp = {
            status: 200,
            data: result
          };
          res.status(200).json(resp);
        });
      }
    }
    /**
    * Method for viewing specific account
     * @param {object} req - the request object
     * @param {object} res  - the response object
     */

  }, {
    key: "viewSpecificAccount",
    value: function viewSpecificAccount(req, res) {
      var _this5 = this;

      this.store.userStore.read({
        email: req.params.email
      }, function (err, result) {
        if (result && !result.length) {
          return res.status(400).json({
            status: 400,
            error: 'User does not exit in the database'
          });
        }

        _this5.store.bankAcctStore.read({
          owneremail: req.params.email
        }, function (err1, result1) {
          if (result1 && !result1.length) {
            return res.status(200).json({
              status: 200,
              message: 'No account found for this user'
            });
          }

          var resp = {
            status: 200,
            data: result1
          };
          res.status(200).json(resp);
        });
      });
    }
  }]);

  return StaffController;
}();

var _default = StaffController;
exports["default"] = _default;