"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * To create a new store class
 */
var Store =
/*#__PURE__*/
function () {
  /**
   * Constructor for creating a new store class
   * @Constructor
   * @param {string} name - the name of the store
   * @param {Table} table - the name of the Table class used by this store class
   */
  function Store(name, table) {
    _classCallCheck(this, Store);

    this._name = name;
    this._table = table;
  }
  /**
   * Creates a new column object and save it to the table
   * @param {object} data - the data object to save
   * @param {function} callback - a callback function after the process finishes
   * @return {function} The callback funtion
   */


  _createClass(Store, [{
    key: "create",
    value: function create(data, callback) {
      if (Array.isArray(data)) {
        this._table.addColumnAll(data, function (err, result) {
          if (err) return callback(err);
          return callback(null, result);
        });
      } else if (_typeof(data) === 'object') {
        this._table.addColumn(data, function (err, result) {
          if (err) return callback(err);
          return callback(null, result);
        });
      } else {
        return callback(new Error('Invalid data'));
      }
    }
    /**
     * Reads a column from the table
     * @param {object} query - query object
     * @param {function} callback - callback function when the process is done
     * @return {function} The callback function
     */

  }, {
    key: "read",
    value: function read(query, callback) {
      this._table.findColumn(query, function (err, result) {
        if (err) return callback(err);
        return callback(null, result);
      });
    }
    /**
     * Updates a column from the table
     * @param {object} query - query object
     * @param {object} query - the new data object
     * @param {function} callback - callback function when the process is done
     * @return {function} The callback function
     */

  }, {
    key: "update",
    value: function update(query, newObject, callback) {
      this._table.updateColumn(query, newObject, function (err, result) {
        if (err) return callback(err);
        return callback(null, result);
      });
    }
    /**
     * Reads a column from the table
     * @param {object} query - query object
     * @param {function} callback - callback function when the process is done
     * @return {function} The callback function
     */

  }, {
    key: "remove",
    value: function remove(query, callback) {
      this._table.removeColumn(query, function (err, result) {
        if (err) return callback(err);
        return callback(null, result);
      });
    }
  }]);

  return Store;
}();

var _default = Store;
exports["default"] = _default;