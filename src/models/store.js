/**
 * To create a new store class
 */
class Store {
  /**
   * Constructor for creating a new store class
   * @Constructor
   * @param {string} name - the name of the store
   * @param {Table} table - the name of the Table class used by this store class
   */
  constructor(name, table) {
    this._name = name;
    this._table = table;
  }

  /**
   * Creates a new column object and save it to the table
   * @param {object} data - the data object to save
   * @param {function} callback - a callback function after the process finishes
   * @return {function} The callback funtion
   */
  create(data, callback) {
    if (arguments.length < 2) return callback(new Error('Two(2) method arguments expected'));
    if (typeof data !== 'object') return callback(new Error('Data must be an object or an array of object'));
    if (typeof callback !== 'function') return callback(new Error('Callback must be a function'));
    if (Array.isArray(data)) {
      this._table.addColumnAll(data, (err, result) => {
        if (err) return callback(err);
        return callback(null, result);
      });
    } else if (typeof data === 'object') {
      this._table.addColumn(data, (err, result) => {
        if (err) return callback(err);
        return callback(null, result);
      });
    } else {
      return callback(new Error('Invalid data'));
    }
  }

  /**
   * Reads a column from the table
   * @param {string} query - query object
   * @param {function} callback - callback function when the process is done
   * @return {function} The callback function
   */
  read(query, callback) {
    if (arguments.length < 2) return callback(new Error('Two(2) method arguments expected'));
    if (typeof query !== 'object') return callback(new Error('Query must be an object'));
    if (typeof callback !== 'function') return callback(new Error('Callback must be a function'));
    this._table.findColumn(query, (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    });
  }
}

export default Store;
