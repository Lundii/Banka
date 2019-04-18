"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable radix */

/* eslint-disable no-restricted-properties */

/**
 *Creates a new Table
 @class
 */
var Table =
/*#__PURE__*/
function () {
  /**
   * Constructor for table class
   * @constructor
   * @param {string} name - the name of table
   */
  function Table(name) {
    _classCallCheck(this, Table);

    this._name = name;
    this._columns = [];
    this._indexId = 100;
    this._getRandomNumber = this._getRandomNumber.bind();
    this._generateId = this._generateId.bind(this);
    this._search = this._search.bind(this);
  }
  /**
   * Adds columns to the table class
   * @param {object} object - the object data to add to the table
   * @param {function} callback - a callback function after the process runs
   * @return {function} The callback function
   */


  _createClass(Table, [{
    key: "addColumn",
    value: function addColumn(object, callback) {
      if (arguments.length < 2) return callback(new Error('Expects two(2) function arguments'));
      if (_typeof(object) !== 'object') return callback(new Error('Column data must be an object'));
      if (typeof callback !== 'function') return callback(new Error('Callback must be a function'));
      var resultArray = [];

      this._generateId(object);

      this._columns.push(object);

      resultArray.push(object);
      return callback(null, resultArray);
    }
    /**
     * Adds an array of columns to the table clas
     * @param {array} array - an array of object to add to the table
     * @param {function} callback - a callback function after the process runs
     * @return {funtion} The callback function
     */

  }, {
    key: "addColumnAll",
    value: function addColumnAll(array, callback) {
      var _this = this;

      if (arguments.length < 2) return callback(new Error('Expects two(2) function arguments'));
      if (!Array.isArray(array)) return callback(new Error('Data must be an array of object data'));
      if (typeof callback !== 'function') return callback(new Error('Callback must be a function'));
      var added = [];
      array.forEach(function (object) {
        _this._generateId(object);

        _this._columns.push(object);

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

  }, {
    key: "findColumn",
    value: function findColumn(query, callback) {
      if (arguments.length < 2) return callback(new Error('Expects two(2) function arguments'));
      if (_typeof(query) !== 'object') return callback(new Error('query must be an object'));
      if (typeof callback !== 'function') return callback(new Error('Callbak must be a function'));

      if (Object.keys(query) === 0) {
        return callback(null, this._columns);
      }

      var result = this._search(query);

      return callback(null, result);
    }
    /**
     * To update a column stored in the table
     * @param {object} query - the query object
     * @param {object} newObject - the new data object
     * @param {function} callback - a callback function after the process runs
     * @return {funtion} The callback function
     */

  }, {
    key: "updateColumn",
    value: function updateColumn(query, newObject, callback) {
      if (arguments.length < 3) return callback(new Error('Expects three(3) function arguments'));
      if (_typeof(query) !== 'object') return callback(new Error('query must be an object'));
      if (_typeof(newObject) !== 'object') return callback(new Error('query must be an object'));
      if (typeof callback !== 'function') return callback(new Error('Callbak must be a function'));

      var result = this._search(query);

      var newObjectKey = Object.keys(newObject)[0];
      var newObjectValue = newObject[newObjectKey];
      result[0][newObjectKey] = newObjectValue;
      return callback(null, result);
    }
    /**
     * To remove a column stored in the table
     * @param {object} query - the query object
     * @param {function} callback - a callback function after the process runs
     * @return {function} The callback function
     */

  }, {
    key: "removeColumn",
    value: function removeColumn(query, callback) {
      if (arguments.length < 2) return callback(new Error('Expects two(2) function arguments'));
      if (_typeof(query) !== 'object') return callback(new Error('query must be an object'));
      if (typeof callback !== 'function') return callback(new Error('Callbak must be a function'));

      var result = this._search(query);

      var index = this._columns.indexOf(result[0]);

      this._columns.splice(index, 1);

      return callback(result);
    }
    /**
     * Private method to search the table for columns
     * @private
     * @param {object} query - query object to use as search key
     * @return {array} An array containing the query result
     */

  }, {
    key: "_search",
    value: function _search(query) {
      var searchKey = Object.keys(query)[0];
      var searchValue = query[searchKey];

      var result = this._columns.filter(function (row) {
        return row[searchKey] === searchValue;
      });

      return result;
    }
    /**
     * Private method to generate unique Id for the each columns
     * @private
     * @param {object} object - the column to generate the id for
     * @return {objct} The column with its unique id
     */

  }, {
    key: "_generateId",
    value: function _generateId(object) {
      var rand1 = this._getRandomNumber(5000, 6000);

      var rand2 = this._padNumberLength(this._getRandomNumber(0, 1000000), 8);

      var unique = this._indexId.toString();

      this._indexId += 1;
      var id = parseInt(rand1 + unique + rand2);
      object.id = id;
      return object;
    }
    /**
     * Private method to generate random number between two values
     * @private
     * @param {number} min - minimum number included in the  generation (inclusive)
     * @param {number} max - maximnum number to be generated (exclusive)
     */

  }, {
    key: "_getRandomNumber",
    value: function _getRandomNumber(min, max) {
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

  }, {
    key: "_padNumberLength",
    value: function _padNumberLength(number, length) {
      if (number <= Math.pow(10, length)) {
        number = "000000".concat(number).slice(-length);
      }

      return number;
    }
  }]);

  return Table;
}();

var _default = Table;
exports["default"] = _default;