"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Class for creating email services
 * @class
 */
var EmailServices =
/*#__PURE__*/
function () {
  /**
   * Constructor for creating a new class
   * @constructor
   */
  function EmailServices() {
    _classCallCheck(this, EmailServices);

    this.transactionAlert = this.transactionAlert.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.getTransporter = this.getTransporter.bind(this);
    this.sendMail = this.sendMail.bind(this);
  }
  /**
   * Method for sending mail on account creation
   * @param {object} email - the user's email
   */


  _createClass(EmailServices, [{
    key: "createAccount",
    value: function createAccount(user) {
      var transporter = this.getTransporter();
      var mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Account creation successful',
        html: " <style>\n                table {\n                  width: 100%;\n                  border-collapse: collapse;\n                }\n                th {\n                  background-color: rgb(18, 18, 107);\n                  color: white;\n                }\n                td, th {\n                  text-align: center;\n                  padding: 8px;\n                }\n                .even {\n                  background-color: rgb(222, 222, 233);;\n                }\n             </style>\n              <div>\n               <table>\n                  <tr>\n                    <th colspan=\"2\">ACCOUNT DETAILS</th>\n                  </tr>\n                 <tr class=\"even\">\n                   <td>FirstName:</td>\n                   <td>".concat(user.firstName, "</td>\n                 </tr>\n                 <tr>\n                   <td>LastName:</td>\n                   <td>").concat(user.lastName, "</td>\n                 </tr>\n                 <tr class=\"even\">\n                   <td>AccountNumber</td>\n                   <td>").concat(user.accountnumber, "</td>\n                 </tr>\n                 <tr>\n                  <td>Email:</td>\n                  <td>").concat(user.email, "</td>\n                 </tr>\n               </table>\n             </div>")
      };
      this.sendMail(transporter, mailOptions);
    }
    /**
     * Method for sending credit or debit alert
     * @param {string} email - the recepient email
     * @param {object} transaction - the transaction object
     */

  }, {
    key: "transactionAlert",
    value: function transactionAlert(email, transaction) {
      var transporter = this.getTransporter();
      var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Banka Alert on your account [".concat(transaction.type.toUpperCase(), "]"),
        html: " <style>\n                table {\n                  width: 100%;\n                  border-collapse: collapse;\n                }\n                th {\n                  background-color: rgb(18, 18, 107);\n                  color: white;\n                }\n                td, th {\n                  text-align: center;\n                  padding: 8px;\n                }\n                .even {\n                  background-color: rgb(222, 222, 233);;\n                }\n             </style>\n              <div>\n               <table>\n                  <tr>\n                    <th colspan=\"2\">TRANSACTION DETAILS</th>\n                  </tr>\n                 <tr class=\"even\">\n                   <td>Account Number:</td>\n                   <td>".concat(transaction.accountnumber, "</td>\n                 </tr>\n                 <tr>\n                   <td>Amount:</td>\n                   <td>&#x20A6 ").concat(transaction.amount, "</td>\n                 </tr>\n                 <tr class=\"even\">\n                   <td>Transaction type:</td>\n                   <td>").concat(transaction.type.toUpperCase(), "</td>\n                 </tr>\n                 <tr>\n                  <td>Transaction date:</td>\n                  <td>").concat(transaction.createdon, "</td>\n                 </tr>\n                 <tr class=\"even\">\n                  <td>Previous Balance:</td>\n                  <td>&#x20A6 ").concat(transaction.oldbalance, "</td>\n                </tr>\n                 <tr>\n                  <td>New Balance:</td>\n                  <td>&#x20A6 ").concat(transaction.newbalance, "</td>\n                </tr>\n               </table>\n            </div>")
      };
      this.sendMail(transporter, mailOptions);
    }
    /**
     * Method for sending password reset link to the user
     * @param {object} user - the user object
     * @param {function} callback - the callback function
     * @returns - the callback function
     */

  }, {
    key: "sendResetLink",
    value: function sendResetLink(user, callback) {
      var transporter = this.getTransporter();
      var mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Password Reset Link',
        html: "<div>\n              <h3>Please, click on the link below to reset your password</h3>\n              <a href=\"https://mighty-retreat-71326.herokuapp.com/api/v1/passwordreset_form/".concat(user.id, "/").concat(user.token, "\">password reset link</a>\n            </div>")
      };
      this.sendMail(transporter, mailOptions, callback);
    }
    /**
     * For geeting nodemailer transporter object
     * @private
     * @returns - the transporter object
     */

  }, {
    key: "getTransporter",
    value: function getTransporter() {
      var transporter = _nodemailer["default"].createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      return transporter;
    }
    /**
     * private method for sending email
     * @private
     * @param {object} transporter - the transporter object
     * @param {object} mailOptions - the nodemail mailOptions object
     * @param {function} callback - a callback function
     */

  }, {
    key: "sendMail",
    value: function sendMail(transporter, mailOptions, callback) {
      if (callback) {
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) callback(err);else callback(null, "Email sent:".concat(info.response));
        });
      } else {
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) console.log(err);else console.log("Email sent:".concat(info.response));
        });
      }
    }
  }]);

  return EmailServices;
}();

var Email = new EmailServices();
var _default = Email;
exports["default"] = _default;