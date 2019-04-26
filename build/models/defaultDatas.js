"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transactions = exports.Accounts = exports.Users = void 0;
var Users = [{
  firstName: 'Peter',
  lastName: 'Tunde',
  email: 'peter123tunde@email.com',
  password: 'password',
  type: 'client',
  isAdmin: false
}, {
  firstName: 'Aisha',
  lastName: 'Lawal',
  email: 'aishalawal23@email.com',
  password: 'password',
  type: 'client',
  isAdmin: false
}, {
  firstName: 'Chukwudi',
  lastName: 'James',
  email: 'chukwudi.james@email.com',
  password: 'password',
  type: 'client',
  isAdmin: false
}, {
  firstName: 'Bill',
  lastName: 'Mark',
  email: 'billmark56@email.com',
  password: 'password',
  type: 'client',
  isAdmin: false
}, {
  firstName: 'Amaka',
  lastName: 'Padi',
  email: 'amaka.padi@email.com',
  password: 'password',
  type: 'staff',
  isAdmin: false
}, {
  firstName: 'Jeffery',
  lastName: 'Sunday',
  email: 'jefferysunday12@email.com',
  password: 'password',
  type: 'staff',
  isAdmin: false
}, {
  firstName: 'Onu',
  lastName: 'Monday',
  email: 'onumonday@email.com',
  password: 'password',
  type: 'staff',
  isAdmin: true
}];
exports.Users = Users;
var Accounts = [{
  accountNumber: 1004875498,
  createdOn: new Date().getTime,
  owner: 1,
  type: 'savings',
  status: 'active',
  balance: 340000.00
}, {
  accountNumber: 1004870909,
  createdOn: new Date().getTime,
  owner: 1,
  type: 'savings',
  status: 'active',
  balance: 3000.00
}, {
  accountNumber: 1004848398,
  createdOn: new Date().getTime,
  owner: 1,
  type: 'savings',
  status: 'active',
  balance: 0.00
}, {
  accountNumber: 1003847890,
  createdOn: new Date().getTime,
  owner: 1,
  type: 'savings',
  status: 'active',
  balance: 100.00
}, {
  accountNumber: 1000047890,
  createdOn: new Date().getTime,
  owner: 1,
  type: 'savings',
  status: 'active',
  balance: 400000.00
}, {
  accountNumber: 1004839098,
  createdOn: new Date().getTime,
  owner: 2,
  type: 'savings',
  status: 'dormant',
  balance: 0.00
}, {
  accountNumber: 1003437498,
  createdOn: new Date().getTime,
  owner: 3,
  type: 'savings',
  status: 'dormant',
  balance: 0.00
}, {
  accountNumber: 1004837498,
  createdOn: new Date().getTime,
  owner: 4,
  type: 'savings',
  status: 'dormant',
  balance: 0.00
}, {
  accountNumber: 1004809890,
  createdOn: new Date().getTime,
  owner: 4,
  type: 'savings',
  status: 'dormant',
  balance: 0.00
}, {
  accountNumber: 1007877890,
  createdOn: new Date().getTime,
  owner: 4,
  type: 'savings',
  status: 'active',
  balance: 0.00
}];
exports.Accounts = Accounts;
var Transactions = [{
  createdOn: new Date().getDate,
  type: 'credit',
  accountNumber: 1004837498,
  cashier: 5,
  amount: 150000.00,
  oldBalance: 0.00,
  newBalance: 150000.00
}, {
  createdOn: new Date().getDate,
  type: 'credit',
  accountNumber: 1004837498,
  cashier: 5,
  amount: 150000.00,
  oldBalance: 0.00,
  newBalance: 150000.00
}, {
  createdOn: new Date().getDate,
  type: 'credit',
  accountNumber: 1004837498,
  cashier: 5,
  amount: 10000.00,
  oldBalance: 150000.00,
  newBalance: 160000.00
}, {
  createdOn: new Date().getDate,
  type: 'credit',
  accountNumber: 1004837498,
  cashier: 5,
  amount: 35000.00,
  oldBalance: 160000.00,
  newBalance: 125000.00
}];
exports.Transactions = Transactions;