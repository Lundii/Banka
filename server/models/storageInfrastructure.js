import config from '../config';

/**
 * Infrastructure class for setting up initial storage values
 * @class
 */
class StorageInfrastructure {
  constructor(store) {
    this.init = this.init.bind(this);
    this.userStore = store.userStore;
    this.bankAcctStore = store.bankAcctStore;
    this.transactionStore = store.transactionStore;
    this.createTables = this.createTables.bind(this);
    this.createDefaultAdmmin = this.createDefaultAdmmin.bind(this);
  }

  /**
   * The initialization method
   */
  init() {
    this.createTables();
  }

  createTables() {
    this.userStore.createTable((err, result) => {
      this.bankAcctStore.createTable((err1, result1) => {
        this.transactionStore.createTable((err2, result2) => {
          this.createDefaultAdmmin();
        });
      });
    });
  }

  createDefaultAdmmin() {
    this.userStore.read({ email: config.development.adminAccount.email }, (err, result) => {
      if (result && !result.length) {
        this.userStore.create(config.development.adminAccount, (er, res) => {
        });
      }
    });
  }
}

export default StorageInfrastructure;
