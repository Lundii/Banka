"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addData = addData;
exports.removeData = removeData;

var _pgFormat = _interopRequireDefault(require("pg-format"));

var _index = require("../util/index");

var _server = require("../server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable import/no-cycle */
var emails = ['petertunde@gmail.com', 'aishalawal23@gmail.com', 'chukwudi.james@gmail.com', 'billmark56@gmail.com', 'amaka.padi@gmail.com', 'jefferysunday12@gmail.com', 'onumonday@gmail.com'];
var accountNumbers = [1004875498, 1004870909, 1004848398, 1003847890, 1000047890, 1004839098, 1003437498, 1004837498, 1007877890, 1004809890];
var userPasswords = ['password', 'password', 'password', 'password', 'password', 'password', 'password', 'password'];
var hashPass = userPasswords.map(function (password) {
  return (0, _index.hashPassword)(password);
});
var users = [['Peter', 'Tunde', emails[0], hashPass[0], 'client', false], ['Aisha', 'Lawal', emails[1], hashPass[1], 'client', false], ['Chukwudi', 'James', emails[2], hashPass[2], 'client', false], ['Bill', 'Mark', emails[3], hashPass[3], 'client', false], ['Amaka', 'Padi', emails[4], hashPass[4], 'staff', false], ['Jeffery', 'Sunday', emails[5], hashPass[5], 'staff', false], ['Onu', 'Monday', emails[6], hashPass[6], 'staff', true]];
var insertUsersQuery = (0, _pgFormat["default"])('INSERT INTO users(firstName, lastName, email, password, type, isAdmin) VALUES %L returning *', users);
var accounts = [[accountNumbers[0], 'petertunde@gmail.com', 'savings', 'active', 340000.00, new Date()], [accountNumbers[1], 'petertunde@gmail.com', 'savings', 'active', 3000.00, new Date()], [accountNumbers[2], 'petertunde@gmail.com', 'current', 'active', 0.00, new Date()], [accountNumbers[3], 'aishalawal23@gmail.com', 'savings', 'active', 100.00, new Date()], [accountNumbers[4], 'aishalawal23@gmail.com', 'current', 'active', 400000.00, new Date()], [accountNumbers[5], 'aishalawal23@gmail.com', 'savings', 'dormant', 0.00, new Date()], [accountNumbers[6], 'aishalawal23@gmail.com', 'savings', 'dormant', 23000.00, new Date()], [accountNumbers[7], 'chukwudi.james@gmail.com', 'savings', 'dormant', 0.00, new Date()], [accountNumbers[8], 'chukwudi.james@gmail.com', 'savings', 'active', 0.00, new Date()], [accountNumbers[9], 'billmark56@gmail.com', 'savings', 'dormant', 0.00, new Date()]];
var insertAccountsQuery = (0, _pgFormat["default"])('INSERT INTO bankaccounts(accountNumber, ownerEmail, type, status, balance, createdOn) VALUES %L RETURNING *', accounts);
var transactions = [[accountNumbers[2], 'credit', 5, 150000.00, 0.00, 150000.00, new Date()], [accountNumbers[2], 'credit', 5, 150000.00, 0.00, 150000.00, new Date()], [accountNumbers[2], 'credit', 5, 150000.00, 10000.00, 160000.00, new Date()], [accountNumbers[2], 'debit', 5, 160000.00, 35000.00, 125000.00, new Date()]];
var insertTransactionsQuery = (0, _pgFormat["default"])('INSERT INTO transactions(accountNumber, type, cashier, amount, oldBalance, newBalance, createdOn) VALUES %L RETURNING *', transactions);

function addData(callback) {
  _server.store.userStore.compoundQuery(insertUsersQuery, function (err, result) {
    _server.store.bankAcctStore.compoundQuery(insertAccountsQuery, function (err1, result1) {
      _server.store.transactionStore.compoundQuery(insertTransactionsQuery, function (err2, result2) {
        callback();
      });
    });
  });
}

function removeData() {
  emails.forEach(function (email) {
    _server.store.userStore.remove({
      email: email
    }, function (err, result) {
      if (err) throw new Error('Error removing default users', err);
    });
  });
  accountNumbers.forEach(function (accountNumber) {
    _server.store.bankAcctStore.remove({
      accountNumber: accountNumber
    }, function (err, result) {
      if (err) throw new Error('Error removing default users', err);
    });
  });
  accountNumbers.forEach(function (accountNumber) {
    _server.store.transactionStore.remove({
      accountNumber: accountNumber
    }, function (err, result) {
      if (err) throw new Error('Error removing default users', err);
    });
  });
}