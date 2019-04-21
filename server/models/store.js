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
  constructor(name, pool, tableSchema) {
    this.name = name;
    this.pool = pool;
    pool.query(tableSchema);
  }

  /**
   * Creates a new column object and save it to the table
   * @param {object} data - the data object to save
   * @param {function} callback - a callback function after the process finishes
   * @return {function} The callback funtion
   */
  create(data, callback) {
    const columns = Object.keys(data);
    const arr = [];
    const values = [];
    for (let i = 0; i < columns.length; i += 1) {
      arr.push(data[columns[i]]);
      values.push(`$${i + 1}`);
    }
    const text = `INSERT INTO ${this.name} (${columns.join(', ')}) VALUES(${values.join(', ')}) RETURNING *`;
    this.pool.query(text, arr, (err, result) => {
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
  read(query, callback) {
    const key = Object.keys(query);
    const text = `SELECT * FROM ${this.name} WHERE ${key[0]} = '${query[key[0]]}';`;
    this.pool.query(text, (err, result) => {
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
  update(query, newObject, callback) {
    const key = Object.keys(query);
    const key2 = Object.keys(newObject);
    const text = `UPDATE ${this.name} SET ${key2[0]} = '${newObject[key2[0]]}' WHERE ${key[0]} = ${query[key[0]]} RETURNING *;`;
    this.pool.query(text, (err, result) => {
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
  remove(query, callback) {
    const key = Object.keys(query);
    const text = `DELETE FROM ${this.name} WHERE ${key[0]} = '${query[key[0]]}';`;
    this.pool.query(text, (err, result) => {
      if (err) return callback(err);
      return callback(null, result.rows);
    });
  }
}

export default Store;
