import { Users, Accounts, Transactions } from './defaultDatas';
import { hashPassword } from '../util/index';
import { throws } from 'assert';

/**
 * Infrastructure class for setting up initial storage values
 * @class
 */
class StorageInfrastructure {
  constructor(store) {
    if (!store.userStore) throw new Error('UserStore cannot be null');
    if (!store.bankAcctStore) throw new Error('BankAcctStore cannot be null');
    this.init = this.init.bind(this);
    this.userStore = store.userStore;
    this.bankAcctStore = store.bankAcctStore;
    this.transactionStore = store.transactionStore;
    this.createDefaultUsers = this.createDefaultUsers.bind(this);
    this.createDafaultAccounts = this.createDafaultAccounts.bind(this);
    this.createDefaultTransactions = this.createDefaultTransactions.bind(this);
  }

  /**
   * The initialization method
   */
  init() {
    this.createDefaultUsers();
    this.createDafaultAccounts();
    this.createDefaultTransactions();
  }

  /**
   * Private method for creating default users
   * @private
   */
  createDefaultUsers() {
    Users.forEach((object) => {
      const hashPass = hashPassword(object.password);
      object.password = hashPass;
    });
    this.userStore.create(Users, (err, result) => {
      if (err) throw new Error('Error creating default users');
    });
  }

  /**
   * Private method for creating default accounts
   * @private
   */
  createDafaultAccounts() {
    this.bankAcctStore.create(Accounts, (err, result) => {
      if (err) throw new Error('Error creating default accounts');
    });
  }

  /**
   * Private method for creating default transactions
   * @private
   */
  createDefaultTransactions() {
    this.transactionStore.create(Accounts, (err, result) => {
      if (err) throw new Error('Error creating default transactions');
    });
  }
}

export default StorageInfrastructure;
