import Table from './table';

/**
 * Creates a new Database
 * @Class
 */

class Database {
  /**
   * Constructor for database class
   * @constructor
   * @param {string} name - The name of the database
   */
  constructor(name) {
    this.name = name;
    this.tables = [];
    this.createTable = this.createTable.bind(this);
    this.searchTable = this.searchTable.bind(this);
  }

  /**
   * Creates a new table and add it to the database
   * @param {string} name - The name of the table
   * @return {Table} The newly created table class
   */
  createTable(name) {
    if (this.searchTable(name)) {
      return new Error('Table name already exists');
    }
    const table = new Table(name);
    this.tables.push(table);
    return table;
  }

  /**
   * Deletes a table from the database
   * @param {string} name - The name of the table to delete
   * @return {Table} The table class removed
   */
  deleteTable(name) {
    const index = this.searchTable(name);
    if (index === 0) {
      return new Error('Table does not exist');
    }
    return this.tables.splice(index, 1);
  }

  /**
   * Private method used for searching the database for tables
   * @private
   * @param {string} name - The name of the table to search for
   * @return {number} index of the table or 0 if table does not exit
   */
  searchTable(name) {
    for (let i = 0; i < this.tables.length; i += 1) {
      if (this.tables[i].name === name) {
        return i;
      }
    }
    return 0;
  }
}

export default Database;
