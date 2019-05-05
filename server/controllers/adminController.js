/**
 * Admin route controller class
 * @class
 */
class AdminController {
  /**
     * Constructor for admin route controller class
     * @constructor
     * @param {Store} store - the store class used for storing data
     */
  constructor(store) {
    this.store = store;
    this.getUsers = this.getUsers.bind(this);
  }

  getUsers(req, res) {
    if ((req.query.type && !req.query.type) || (req.query.type && req.query.type !== 'staff' && req.query.type !== 'admin')) {
      return res.status(400).json({
        status: 400,
        error: `${req.query.type} account does not exit`,
      });
    }
    if (req.query && Object.keys(req.query).length && Object.keys(req.query)[0] !== 'type') {
      return res.status(400).json({
        status: 400,
        error: 'invalid query parameters',
      });
    }
    if (req.query.type) {
      let query;
      if (req.query.type === 'staff') {
        query = `SELECT * FROM users
                   WHERE type = 'staff' AND isadmin = false`;
      } else if (req.query.type === 'admin') {
        query = `SELECT * FROM users
                   WHERE type = 'staff' AND isadmin = true`;
      }
      this.store.userStore.compoundQuery(query, (err, result) => {
        if (err) throw new Error('Error reading staffs');
        const resp = {
          status: 200,
          data: result,
        };
        res.status(200).json(resp);
      });
    } else {
      this.store.userStore.read({}, (err, result) => {
        if (err) throw new Error('Error reading staffs');
        const resp = {
          status: 200,
          data: result,
        };
        res.status(200).json(resp);
      });
    }
  }
}

export default AdminController;
