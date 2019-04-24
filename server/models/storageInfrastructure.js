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
    this.createDefaultAdmin = this.createDefaultAdmin.bind(this);
    this.createDefaultStaff = this.createDefaultStaff.bind(this);
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
          this.createDefaultAdmin();
        });
      });
    });
  }

  createDefaultAdmin() {
    this.userStore.read({ email: config.development.adminAccount.email }, (err, result) => {
      this.createDefaultStaff();
      if (result && !result.length) {
        this.userStore.create(config.development.adminAccount, (er, res) => {
          this.createDefaultStaff();
        });
      }
    });
  }

  createDefaultStaff() {
    this.userStore.read({ email: config.development.staffAccount.email }, (err, result) => {
      if (result && !result.length) {
        this.userStore.create(config.development.staffAccount, (er, res) => {
        });
      }
    });
  }
}

export default StorageInfrastructure;
