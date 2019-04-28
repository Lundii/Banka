import Store from './store';

/**
 * User Store class
 * @class
 * @extends Store
 */
class UserStore extends Store {
  /**
   * Constructor for class UserStore
   * @param {sting} name - the name of store
   * @param {Database} database - the database to use for storage
   */
  constructor(name, pool) {
    const createUserTable = `CREATE TABLE IF NOT EXISTS ${name}(
      id serial PRIMARY KEY,
      firstName VARCHAR (50) NOT NULL,
      lastName VARCHAR (50) NOT NULL,
      email VARCHAR (300) UNIQUE NOT NULL,
      password VARCHAR (500) NOT NULL,
      type VARCHAR (20) NOT NULL,
      isAdmin BOOLEAN NOT NULL,
      emailConfirmed BOOLEAN NOT NULL,
      createdAnAccount BOOLEAN NOT NULL
    );`;
    super(name, pool, createUserTable);
  }
}

export default UserStore;
