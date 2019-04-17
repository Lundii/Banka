import Table from '../database/table';
import Store from './store';

/**
 * Transaction Store class
 * @class
 * @extends Store
 */
class TransactionStore extends Store {
  /**
   * Constructor for class TransactionStore
   * @param {sting} name - the name of store
   * @param {Database} database - the database to use for storage
   */
  constructor(name, database) {
    const table = new Table(name);
    database.createTable(table);
    super(name, table);
  }
}

export default TransactionStore;
