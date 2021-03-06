
import {
  hashPassword,
  firstLetterUppercase,
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
    if (req.query && Object.keys(req.query).length && ((Object.keys(req.query)[0] !== 'type')
    && (Object.keys(req.query)[0] !== 'email') && (Object.keys(req.query)[0] !== 'id'))) {
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
        if (req.query.email) {
          query = query.concat(' \n', `AND email = '${req.query.email}'`);
        }
        if (req.query.id) {
          query = query.concat(' \n', `AND id = '${req.query.id}'`);
        }
      } else if (req.query.type === 'admin') {
        query = `SELECT * FROM users
                   WHERE type = 'staff' AND isadmin = true`;
        if (req.query.email) {
          query = query.concat(' \n', `AND email = '${req.query.email}'`);
        }
        if (req.query.id) {
          query = query.concat(' \n', `AND id = '${req.query.id}'`);
        }
      }
      this.store.userStore.compoundQuery(query, (err, result) => {
        if (result && !result.length) {
          return res.status(200).json({
            status: 200,
            data: result,
            message: `No ${req.query.type} found`,
          });
        }
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
        firstName: firstLetterUppercase(req.body.firstName.trim()),
        lastName: firstLetterUppercase(req.body.lastName.trim()),
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
        };
        const response = {
          status: 200,
          data: data1,
          message: 'Staff successfully created',
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
    this.store.userStore.read({ email: req.body.clientEmail || req.body.userEmail }, (err, result) => {
      if (req.body.clientEmail) {
        if (result[0].type !== 'client') {
          return res.status(401).json({
            status: '401',
            error: 'Unauthorized access',
          });
        }
      }
      const query = `UPDATE users 
        SET firstName = '${firstLetterUppercase(req.body.firstName) || firstLetterUppercase(result[0].firstname)}',
            lastName = '${firstLetterUppercase(req.body.lastName) || firstLetterUppercase(result[0].lastname)}'
        WHERE email = '${req.body.clientEmail || req.body.userEmail}' RETURNING *`;
      this.store.userStore.compoundQuery(query, (err1, result1) => {
        if (err1) throw err1;
        const resdata = {
          status: 200,
          data: {
            firstName: req.body.firstName || result1[0].firstname,
            lastName: req.body.lastName || result1[0].lastname,
          },
          message: 'Update successful',
        };
        return res.status(200).json(resdata);
      });
    });
  }
}

export default AdminController;
