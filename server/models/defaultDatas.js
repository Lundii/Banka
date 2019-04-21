/* eslint-disable import/no-cycle */

import { hashPassword } from '../util/index';
import { store } from '../server';

export const Users = [
  {
    firstName: 'Peter',
    lastName: 'Tunde',
    email: 'petertunde@gmail.com',
    password: 'password',
    type: 'client',
    isAdmin: false,
  },
  {
    firstName: 'Aisha',
    lastName: 'Lawal',
    email: 'aishalawal23@gmail.com',
    password: 'password',
    type: 'client',
    isAdmin: false,
  },
  {
    firstName: 'Chukwudi',
    lastName: 'James',
    email: 'chukwudi.james@gmail.com',
    password: 'password',
    type: 'client',
    isAdmin: false,
  },
  {
    firstName: 'Bill',
    lastName: 'Mark',
    email: 'billmark56@gmail.com',
    password: 'password',
    type: 'client',
    isAdmin: false,
  },
  {
    firstName: 'Amaka',
    lastName: 'Padi',
    email: 'amaka.padi@gmail.com',
    password: 'password',
    type: 'staff',
    isAdmin: false,
  },
  {
    firstName: 'Jeffery',
    lastName: 'Sunday',
    email: 'jefferysunday12@gmail.com',
    password: 'password',
    type: 'staff',
    isAdmin: false,
  },
  {
    firstName: 'Onu',
    lastName: 'Monday',
    email: 'onumonday@gmail.com',
    password: 'password',
    type: 'staff',
    isAdmin: true,
  },
];

export const Accounts = [
  {
    accountNumber: 1004875498,
    createdOn: new Date(),
    owner: 1,
    type: 'savings',
    status: 'active',
    balance: 340000.00,
  },
  {
    accountNumber: 1004870909,
    createdOn: new Date(),
    owner: 1,
    type: 'savings',
    status: 'active',
    balance: 3000.00,
  },
  {
    accountNumber: 1004848398,
    createdOn: new Date(),
    owner: 1,
    type: 'savings',
    status: 'active',
    balance: 0.00,
  },
  {
    accountNumber: 1003847890,
    createdOn: new Date(),
    owner: 1,
    type: 'savings',
    status: 'active',
    balance: 100.00,
  },
  {
    accountNumber: 1000047890,
    createdOn: new Date(),
    owner: 1,
    type: 'savings',
    status: 'active',
    balance: 400000.00,
  },
  {
    accountNumber: 1004839098,
    createdOn: new Date(),
    owner: 2,
    type: 'savings',
    status: 'dormant',
    balance: 0.00,
  },
  {
    accountNumber: 1003437498,
    createdOn: new Date(),
    owner: 3,
    type: 'savings',
    status: 'dormant',
    balance: 0.00,
  },
  {
    accountNumber: 1004837498,
    createdOn: new Date(),
    owner: 4,
    type: 'savings',
    status: 'dormant',
    balance: 0.00,
  },
  {
    accountNumber: 1004809890,
    createdOn: new Date(),
    owner: 4,
    type: 'savings',
    status: 'dormant',
    balance: 0.00,
  },
  {
    accountNumber: 1007877890,
    createdOn: new Date(),
    owner: 4,
    type: 'savings',
    status: 'active',
    balance: 0.00,
  },
];

export const Transactions = [
  {
    createdOn: new Date(),
    type: 'credit',
    accountNumber: 1004837498,
    cashier: 5,
    amount: 150000.00,
    oldBalance: 0.00,
    newBalance: 150000.00,
  },
  {
    createdOn: new Date(),
    type: 'credit',
    accountNumber: 1004837498,
    cashier: 5,
    amount: 150000.00,
    oldBalance: 0.00,
    newBalance: 150000.00,
  },
  {
    createdOn: new Date(),
    type: 'credit',
    accountNumber: 1004837498,
    cashier: 5,
    amount: 10000.00,
    oldBalance: 150000.00,
    newBalance: 160000.00,
  },
  {
    createdOn: new Date(),
    type: 'credit',
    accountNumber: 1004837498,
    cashier: 5,
    amount: 35000.00,
    oldBalance: 160000.00,
    newBalance: 125000.00,
  },
];

export function addData() {
  Users.forEach((object) => {
    const hashPass = hashPassword(object.password);
    object.password = hashPass;
    store.userStore.create(object, (err, result1) => {
      // console.log(err);
      if (err) throw new Error('Error creating default users', err);
    });
  });

  Accounts.forEach((object) => {
    store.bankAcctStore.create(object, (err, result1) => {
      // console.log(err);
      if (err) throw new Error('Error creating default bank accounts', err);
    });
  });

  Transactions.forEach((object) => {
    store.transactionStore.create(object, (err, result1) => {
      // console.log(err);
      if (err) throw new Error('Error creating default transactions', err);
    });
  });
}

export function removeData() {
  Users.forEach((object) => {
    store.userStore.remove({ email: `${object.email}` }, (err, result) => {
      // console.log(err);
      if (err) throw new Error('Error removing default users', err);
    });
  });

  Accounts.forEach((object) => {
    store.bankAcctStore.remove({ accountnumber: `${object.accountNumber}` }, (err, result) => {
      // console.log(err);
      if (err) throw new Error('Error removing default users', err);
    });
  });

  Transactions.forEach((object) => {
    store.transactionStore.remove({ accountnumber: `${object.accountNumber}` }, (err, result) => {
      // console.log(err);
      if (err) throw new Error('Error removing default users', err);
    });
  });
}

export function addUsers(callback) {
  Users.forEach((object) => {
    const hashPass = hashPassword(object.password);
    object.password = hashPass;
    store.userStore.create(object, (err, result) => {
      // console.log(err);
      if (err) return callback(err);
      return callback(null, result);
    });
  });
}
export function addAccounts(callback) {
  Accounts.forEach((object) => {
    store.bankAcctStore.create(object, (err, result) => {
      // console.log(err);
      if (err) return callback(err);
      return callback(null, err);
    });
  });
}

export function removeUsers(callback) {
  Users.forEach((object) => {
    store.userStore.remove({ email: `${object.email}` }, (err, result) => {
      // console.log(err);
      if (err) throw new Error('Error removing default users', err);
      return callback(null, result);
    });
  });
}

export function removeAccounts(callback) {
  Accounts.forEach((object) => {
    store.bankAcctStore.remove({ accountnumber: `${object.accountNumber}` }, (err, result) => {
      // console.log(err);
      if (err) throw new Error('Error removing default users', err);
    });
  });

}
