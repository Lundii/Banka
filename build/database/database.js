"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _table = _interopRequireDefault(require("./table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Creates a new Database
 * @Class
 */
var Database =
/*#__PURE__*/
function () {
  /**
   * Constructor for database class
   * @constructor
   * @param {string} name - The name of the database
   */
  function Database(name) {
    _classCallCheck(this, Database);

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


  _createClass(Database, [{
    key: "createTable",
    value: function createTable(name) {
      if (this._searchTable(name)) {
        return new Error('Table name already exists');
      }

      var table = new _table["default"](name);

      this._tables.push(table);

      return table;
    }
    /**
     * Deletes a table from the database
     * @param {string} name - The name of the table to delete
     * @return {Table} The table class removed
     */

  }, {
    key: "deleteTable",
    value: function deleteTable(name) {
      var index = this._searchTable(name);

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

  }, {
    key: "_searchTable",
    value: function _searchTable(name) {
      for (var i = 0; i < this._tables.length; i += 1) {
        if (this._tables[i].name === name) {
          return i;
        }
      }

      return 0;
    }
  }]);

  return Database;
}();

var _default = Database;
exports["default"] = _default;