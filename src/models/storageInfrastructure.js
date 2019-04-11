import { Users, Accounts } from './defaultDatas';
import { hashPassword } from '../util/index';

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
    this._createDefaultUsers = this._createDefaultUsers.bind(this);
    this._createDafaultAccounts = this._createDafaultAccounts.bind(this);
  }

  /**
   * The initialization method
   */
  init() {
    this._createDefaultUsers();
    this._createDafaultAccounts();
  }

  /**
   * Private method for creating default users
   * @private
   */
  _createDefaultUsers() {
    Users.forEach((object) => {
      const hashPass = hashPassword(object.password);
      object.password = hashPass;
    });
    this.userStore.create(Users, (err, result) => {
      if (err) throw new Error('Error creating default users');
    });
  }

  _createDafaultAccounts() {
    this.bankAcctStore.create(Accounts, (err, result) => {
      if (err) throw new Error('Error creating default accounts');
    });
  }
}

export default StorageInfrastructure;
