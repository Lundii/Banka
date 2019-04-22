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
  constructor(name, pool) {
    const createTransactionTable = `CREATE TABLE IF NOT EXISTS ${name}(
      id SERIAL PRIMARY KEY,
      accountNumber INTEGER REFERENCES bankAccounts(accountNumber) ON DELETE CASCADE NOT NULL,
      type VARCHAR (50) NOT NULL,
      cashier INTEGER NOT NULL,
      amount REAL NOT NULL,
      oldBalance REAL NOT NULL,
      newBalance REAL NOT NULL,
      createdOn TIMESTAMP
    );`;
    super(name, pool, createTransactionTable);
  }
}

export default TransactionStore;
