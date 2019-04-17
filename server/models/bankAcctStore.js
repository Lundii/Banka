import Table from '../database/table';
import Store from './store';

/**
 * Bank Account Store class
 * @class
 * @extends Store
 */
class BankAcctStore extends Store {
  /**
   * Constructor for class BankAcctStore
   * @param {sting} name - the name of store
   * @param {Database} database - the database to use for storage
   */
  constructor(name, database) {
    const table = new Table(name);
    database.createTable(table);
    super(name, table);
  }
}

export default BankAcctStore;
