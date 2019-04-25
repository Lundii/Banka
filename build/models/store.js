"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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
  function Store(name, pool, tableSchema) {
    _classCallCheck(this, Store);

    this.name = name;
    this.pool = pool;
    this.tableSchema = tableSchema;
  }

  _createClass(Store, [{
    key: "createTable",
    value: function createTable(callback) {
      var _this = this;

      this.pool.query(this.tableSchema, function (err, result) {
        if (err) throw new Error("Error creating ".concat(_this.name, " Table"));
        return callback(null, result);
      });
    }
    /**
     * Creates a new column object and save it to the table
     * @param {object} data - the data object to save
     * @param {function} callback - a callback function after the process finishes
     * @return {function} The callback funtion
     */

  }, {
    key: "create",
    value: function create(data, callback) {
      var columns = Object.keys(data);
      var arr = [];
      var values = [];

      for (var i = 0; i < columns.length; i += 1) {
        arr.push(data[columns[i]]);
        values.push("$".concat(i + 1));
      }

      var text = "INSERT INTO ".concat(this.name, " (").concat(columns.join(', '), ") VALUES(").concat(values.join(', '), ") RETURNING *");
      this.pool.query(text, arr, function (err, result) {
        if (err) return callback(err);
        return callback(null, result.rows);
      });
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
      var text;

      if (Object.keys(query).length === 0) {
        text = "SELECT * FROM ".concat(this.name);
      } else {
        var key = Object.keys(query);
        text = "SELECT * FROM ".concat(this.name, " WHERE ").concat(key[0], " = '").concat(query[key[0]], "';");
      }

      this.pool.query(text, function (err, result) {
        if (err) return callback(err);
        return callback(null, result.rows);
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
      var key = Object.keys(query);
      var key2 = Object.keys(newObject);
      var text = "UPDATE ".concat(this.name, " SET ").concat(key2[0], " = '").concat(newObject[key2[0]], "' WHERE ").concat(key[0], " = ").concat(query[key[0]], " RETURNING *;");
      this.pool.query(text, function (err, result) {
        if (err) return callback(err);
        return callback(null, result.rows);
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
      var key = Object.keys(query);
      var text = "DELETE FROM ".concat(this.name, " WHERE ").concat(key[0], " = '").concat(query[key[0]], "';");
      this.pool.query(text, function (err, result) {
        if (err) return callback(err);
        return callback(null, result.rows);
      });
    }
    /**
     * Handles a compound query string
     * @param {string} query - query string
     * @param {function} callback - callback function when the process is done
     * @return {function} The callback function
     */

  }, {
    key: "compoundQuery",
    value: function compoundQuery(query, callback) {
      this.pool.query(query, function (err, result) {
        if (err) return callback(err);
        return callback(null, result.rows);
      });
    }
  }]);

  return Store;
}();

var _default = Store;
exports["default"] = _default;