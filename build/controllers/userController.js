"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = require("../util");

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
        createdOn: new Date().getTime,
        owner: req.params._id,
        type: req.body.type,
        status: 'active',
        balance: 0.00
      };
      this.store.bankAcctStore.create(data, function (err, result) {
        if (err) throw new Error('Error saving account Number');
        var response = {
          status: 200,
          data: {
            _id: result[0]._id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            accountNumber: result[0].accountNumber,
            email: req.body.email,
            type: result[0].type,
            openingBalance: result[0].balance
          }
        };
        res.status(200).json(response);
      });
    }
  }]);

  return UserController;
}();

var _default = UserController;
exports["default"] = _default;