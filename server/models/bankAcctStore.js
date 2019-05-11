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
  constructor(name, pool) {
    const createAccountTable = `CREATE TABLE IF NOT EXISTS ${name}(
      id SERIAL PRIMARY KEY,
      accountNumber INTEGER UNIQUE NOT NULL,
      ownerEmail VARCHAR(300) REFERENCES users(email) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
      type VARCHAR (50) NOT NULL,
      status VARCHAR (20) NOT NULL,
      balance REAL NOT NULL,
      createdOn TIMESTAMP
    );`;
    super(name, pool, createAccountTable);
  }
}

export default BankAcctStore;
