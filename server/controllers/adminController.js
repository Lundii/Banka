
import {
  hashPassword,
} from '../util';
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
    this.getStaffs = this.getStaffs.bind(this);
    this.createStaff = this.createStaff.bind(this);
    this.deleteStaff = this.deleteStaff.bind(this);
    this.editClient = this.editClient.bind(this);
  }

  getStaffs(req, res) {
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

  createStaff(req, res) {
    const emailField = { email: req.body.email };
    this.store.userStore.read(emailField, (err, result) => {
      if (err) throw new Error('Error reading data');
      if (result && result.length) {
        return res.status(400).json({
          status: 400,
          error: 'Email already exits',
        });
      }
      const password = `${req.body.firstName.toLowerCase()}${req.body.lastName.toLowerCase()}`;
      const hashPass = hashPassword(password);
      req.body.password = hashPass;
      const data = {
        firstName: req.body.firstName.trim().toUpperCase(),
        lastName: req.body.lastName.trim().toUpperCase(),
        email: req.body.email,
        password: req.body.password,
        type: 'staff',
        isAdmin: req.body.isadmin,
        emailConfirmed: false,
        createdanaccount: false,
      };
      this.store.userStore.create(data, (er, dataR) => {
        if (er) throw new Error('Error creating file');
        const data1 = {
          id: dataR[0].id,
          firstname: dataR[0].firstname,
          lastname: dataR[0].lastname,
          email: dataR[0].email,
          type: dataR[0].type,
          isadmin: dataR[0].isadmin,
          message: 'Staff successfully created',
        };
        const response = {
          status: 200,
          data: data1,
        };
        return res.status(200).json(response);
      });
    });
  }

  deleteStaff(req, res) {
    this.store.userStore.read({ email: req.body.staffemail }, (err, result) => {
      if (result && !result.length) {
        return res.status(400).json({
          status: 400,
          error: 'Staff not found',
        });
      }
      this.store.userStore.remove({ email: req.body.staffemail }, (err1, result1) => {
        if (err1) throw new Error('Eror deleting staff');
        return res.status(200).json({
          status: 200,
          message: `${result1[0].isadmin ? 'Admin' : 'Staff'} successfully deleted`,
        });
      });
    });
  }

  editClient(req, res) {
    this.store.userStore.read({ email: req.body.clientEmail }, (err, result) => {
      if (result[0].type !== 'client') {
        return res.status(401).json({
          status: '401',
          error: 'Unauthorized access',
        });
      }
      const query = `UPDATE users 
        SET firstName = '${req.body.firstName || result[0].firstname}',
            lastName = '${req.body.lastName || result[0].lastname}',
            email = '${req.body.email || result[0].email}'
        WHERE email = '${req.body.clientEmail}' RETURNING *`;
      this.store.userStore.compoundQuery(query, (err1, result1) => {
        const resdata = {
          status: 200,
          data: {
            firstName: req.body.firstName || result1[0].firstname,
            lastName: req.body.lastName || result1[0].lastname,
            email: req.body.email || result1[0].email,
            message: 'Update successful',
          },
        };
        return res.status(200).json(resdata);
      });
    });
  }
}

export default AdminController;
