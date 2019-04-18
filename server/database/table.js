/* eslint-disable radix */
/* eslint-disable no-restricted-properties */
/**
 *Creates a new Table
 @class
 */
class Table {
  /**
   * Constructor for table class
   * @constructor
   * @param {string} name - the name of table
   */
  constructor(name) {
    this.name = name;
    this.columns = [];
    this.indexId = 100;
    this.getRandomNumber = this.getRandomNumber.bind();
    this.generateId = this.generateId.bind(this);
    this.search = this.search.bind(this);
  }

  /**
   * Adds columns to the table class
   * @param {object} object - the object data to add to the table
   * @param {function} callback - a callback function after the process runs
   * @return {function} The callback function
   */
  addColumn(object, callback) {
    if (arguments.length < 2) return callback(new Error('Expects two(2) function arguments'));
    if (typeof object !== 'object') return callback(new Error('Column data must be an object'));
    if (typeof callback !== 'function') return callback(new Error('Callback must be a function'));
    const resultArray = [];
    this.generateId(object);
    this.columns.push(object);
    resultArray.push(object);
    return callback(null, resultArray);
  }

  /**
   * Adds an array of columns to the table clas
   * @param {array} array - an array of object to add to the table
   * @param {function} callback - a callback function after the process runs
   * @return {funtion} The callback function
   */
  addColumnAll(array, callback) {
    if (arguments.length < 2) return callback(new Error('Expects two(2) function arguments'));
    if (!Array.isArray(array)) return callback(new Error('Data must be an array of object data'));
    if (typeof callback !== 'function') return callback(new Error('Callback must be a function'));
    const added = [];
    array.forEach((object) => {
      this.generateId(object);
      this.columns.push(object);
      added.push(object);
    });
    return callback(null, added);
  }

  /**
   * To find a column stored in the table
   * @param {object} query - the query object
   * @param {function} callback - a callback function after the process runs
   * @return {function} The callback function
   */
  findColumn(query, callback) {
    if (arguments.length < 2) return callback(new Error('Expects two(2) function arguments'));
    if (typeof query !== 'object') return callback(new Error('query must be an object'));
    if (typeof callback !== 'function') return callback(new Error('Callbak must be a function'));
    if (Object.keys(query) === 0) {
      return callback(null, this.columns);
    }
    const result = this.search(query);
    return callback(null, result);
  }

  /**
   * To update a column stored in the table
   * @param {object} query - the query object
   * @param {object} newObject - the new data object
   * @param {function} callback - a callback function after the process runs
   * @return {funtion} The callback function
   */
  updateColumn(query, newObject, callback) {
    if (arguments.length < 3) return callback(new Error('Expects three(3) function arguments'));
    if (typeof query !== 'object') return callback(new Error('query must be an object'));
    if (typeof newObject !== 'object') return callback(new Error('query must be an object'));
    if (typeof callback !== 'function') return callback(new Error('Callbak must be a function'));
    const result = this.search(query);
    const newObjectKey = Object.keys(newObject)[0];
    const newObjectValue = newObject[newObjectKey];
    result[0][newObjectKey] = newObjectValue;
    return callback(null, result);
  }

  /**
   * To remove a column stored in the table
   * @param {object} query - the query object
   * @param {function} callback - a callback function after the process runs
   * @return {function} The callback function
   */
  removeColumn(query, callback) {
    if (arguments.length < 2) return callback(new Error('Expects two(2) function arguments'));
    if (typeof query !== 'object') return callback(new Error('query must be an object'));
    if (typeof callback !== 'function') return callback(new Error('Callbak must be a function'));
    const result = this.search(query);
    const index = this.columns.indexOf(result[0]);
    this.columns.splice(index, 1);
    return callback(result);
  }

  /**
   * Private method to search the table for columns
   * @private
   * @param {object} query - query object to use as search key
   * @return {array} An array containing the query result
   */
 search(query) {
    const searchKey = Object.keys(query)[0];
    const searchValue = query[searchKey];
    const result = this.columns.filter(row => row[searchKey] === searchValue);
    return result;
  }

  /**
   * Private method to generate unique Id for the each columns
   * @private
   * @param {object} object - the column to generate the id for
   * @return {objct} The column with its unique id
   */
 generateId(object) {
    const rand1 = this.getRandomNumber(5000, 6000);
    const rand2 = this.padNumberLength(this.getRandomNumber(0, 1000000), 8);
    const unique = this.indexId.toString();
    this.indexId += 1;
    const id = parseInt(rand1 + unique + rand2);
    object.id = id;
    return object;
  }

  /**
   * Private method to generate random number between two values
   * @private
   * @param {number} min - minimum number included in the  generation (inclusive)
   * @param {number} max - maximnum number to be generated (exclusive)
   */
  getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Private method to pad numbers
   * @private
   * @param {number} number - the number to pad with leading zeros
   * @param {numer} length  - the length of padded number
   */
  padNumberLength(number, length) {
    if (number <= Math.pow(10, length)) {
      number = (`000000${number}`).slice(-length);
    }
    return number;
  }
}

export default Table;
