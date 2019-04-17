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
    this._name = name;
    this._tables = [];
    this._createTable = this.createTable.bind(this);
    this._searchTable = this._searchTable.bind(this);
  }

  /**
   * Creates a new table and add it to the database
   * @param {string} name - The name of the table
   * @return {Table} The newly created table class
   */
  createTable(name) {
    if (this._searchTable(name)) {
      return new Error('Table name already exists');
    }
    const table = new Table(name);
    this._tables.push(table);
    return table;
  }

  /**
   * Deletes a table from the database
   * @param {string} name - The name of the table to delete
   * @return {Table} The table class removed
   */
  deleteTable(name) {
    const index = this._searchTable(name);
    if (index === 0) {
      return new Error('Table does not exist');
    }
    return this._tables.splice(index, 1);
  }

  /**
   * Private method used for searching the database for tables
   * @private
   * @param {string} name - The name of the table to search for
   * @return {number} index of the table or 0 if table does not exit
   */
  _searchTable(name) {
    for (let i = 0; i < this._tables.length; i += 1) {
      if (this._tables[i].name === name) {
        return i;
      }
    }
    return 0;
  }
}

export default Database;
