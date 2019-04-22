/* eslint-disable import/no-cycle */

import format from 'pg-format';
import { hashPassword } from '../util/index';
import { store } from '../server';

const emails = ['petertunde@gmail.com', 'aishalawal23@gmail.com', 'chukwudi.james@gmail.com', 'billmark56@gmail.com',
  'amaka.padi@gmail.com', 'jefferysunday12@gmail.com', 'onumonday@gmail.com'];

const accountNumbers = [1004875498, 1004870909, 1004848398, 1003847890, 1000047890, 1004839098, 1003437498,
  1004837498, 1007877890, 1004809890];

const userPasswords = ['password', 'password', 'password', 'password', 'password', 'password', 'password', 'password'];
const hashPass = userPasswords.map(password => hashPassword(password));

const users = [['Peter', 'Tunde', emails[0], hashPass[0], 'client', false],
  ['Aisha', 'Lawal', emails[1], hashPass[1], 'client', false],
  ['Chukwudi', 'James', emails[2], hashPass[2], 'client', false],
  ['Bill', 'Mark', emails[3], hashPass[3], 'client', false],
  ['Amaka', 'Padi', emails[4], hashPass[4], 'staff', false],
  ['Jeffery', 'Sunday', emails[5], hashPass[5], 'staff', false],
  ['Onu', 'Monday', emails[6], hashPass[6], 'staff', true]];

const insertUsersQuery = format('INSERT INTO users(firstName, lastName, email, password, type, isAdmin) VALUES %L returning *', users);

const accounts = [[accountNumbers[0], 'petertunde@gmail.com', 'savings', 'active', 340000.00, new Date()],
  [accountNumbers[1], 'petertunde@gmail.com', 'savings', 'active', 3000.00, new Date()],
  [accountNumbers[2], 'petertunde@gmail.com', 'current', 'active', 0.00, new Date()],
  [accountNumbers[3], 'aishalawal23@gmail.com', 'savings', 'active', 100.00, new Date()],
  [accountNumbers[4], 'aishalawal23@gmail.com', 'current', 'active', 400000.00, new Date()],
  [accountNumbers[5], 'aishalawal23@gmail.com', 'savings', 'dormant', 0.00, new Date()],
  [accountNumbers[6], 'aishalawal23@gmail.com', 'savings', 'dormant', 23000.00, new Date()],
  [accountNumbers[7], 'chukwudi.james@gmail.com', 'savings', 'dormant', 0.00, new Date()],
  [accountNumbers[8], 'chukwudi.james@gmail.com', 'savings', 'active', 0.00, new Date()],
  [accountNumbers[9], 'billmark56@gmail.com', 'savings', 'dormant', 0.00, new Date()]];

const insertAccountsQuery = format('INSERT INTO bankaccounts(accountNumber, ownerEmail, type, status, balance, createdOn) VALUES %L RETURNING *', accounts);

const transactions = [[1004837498, 'credit', 5, 150000.00, 0.00, 150000.00, new Date()],
  [accountNumbers[7], 'credit', 5, 150000.00, 0.00, 150000.00, new Date()],
  [accountNumbers[7], 'credit', 5, 150000.00, 10000.00, 160000.00, new Date()],
  [accountNumbers[7], 'debit', 5, 160000.00, 35000.00, 125000.00, new Date()]];

const insertTransactionsQuery = format('INSERT INTO transactions(accountNumber, type, cashier, amount, oldBalance, newBalance, createdOn) VALUES %L RETURNING *', transactions);

export function addData(callback) {
  store.userStore.compoundQuery(insertUsersQuery, (err, result) => {
    store.bankAcctStore.compoundQuery(insertAccountsQuery, (err1, result1) => {
      store.transactionStore.compoundQuery(insertTransactionsQuery, (err2, result2) => {
        callback();
      });
    });
  });
}

export function removeData() {
  emails.forEach((email) => {
    store.userStore.remove({ email }, (err, result) => {
      if (err) throw new Error('Error removing default users', err);
    });
  });

  accountNumbers.forEach((accountNumber) => {
    store.bankAcctStore.remove({ accountNumber }, (err, result) => {
      if (err) throw new Error('Error removing default users', err);
    });
  });

  accountNumbers.forEach((accountNumber) => {
    store.transactionStore.remove({ accountNumber }, (err, result) => {
      if (err) throw new Error('Error removing default users', err);
    });
  });
}
