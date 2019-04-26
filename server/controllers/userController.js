import jwt from 'jsonwebtoken';
import { generateAccountNumber } from '../util';
import Email from '../util/emailServices';
import config from '../config';
/**
 * Home route controller class
 * @class
 */
class UserController {
  /**
   * Constructor for user route controller class
   * @constructor
   * @param {Store} store - the store class used for storing data
   */
  constructor(store) {
    this.store = store;
    this.createAccount = this.createAccount.bind(this);
    this.accountHistory = this.accountHistory.bind(this);
    this.specificTranHist = this.specificTranHist.bind(this);
    this.specAcctDetails = this.specAcctDetails.bind(this);
    this.confirmEmail = this.confirmEmail.bind(this);
  }

  /**
   * Method for handling creating account route(POST api/v1/accounts)
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  createAccount(req, res) {
    const accountNumber = generateAccountNumber(req.body.type);
    const data = {
      accountNumber,
      createdOn: new Date(),
      ownerEmail: req.body.email,
      type: req.body.type,
      status: 'active',
      balance: 0.00,
    };
    console.log(req.body.email);
    this.store.userStore.read({ email: req.body.email }, (err, result) => {
      console.log(result)
      if (result && !result.length) {
        return res.status.json({
          status: 400,
          error: 'user does not exit',
        });
      }
      if (result && result.length && result[0].emailconfirmed === false) {
        const payload = {
          email: req.body.email,
          password: result[0].password,
        };
        const secret = process.env.JWT_SECRET || 'yougofindmesoteyyougotire';
        const token = jwt.sign(payload, secret, config.jwt_options);
        result[0].token = token;
        Email.sendConfirmationEmail(result[0]);
        return res.status(403).json({
          status: 403,
          message: 'Please click on the link sent to your mail to confirm your email before creating an account',
        });
      }
      this.store.bankAcctStore.create(data, (err1, result1) => {
        if (err) throw new Error('Error saving account Number');
        result1[0].firstName = result[0].firstname;
        result1[0].lastName = result[0].lastname;
        result1[0].email = req.body.email;
        Email.createAccount(result1[0]);
        const response = {
          status: 200,
          data: {
            id: result1[0].id,
            firstName: result[0].firstname,
            lastName: result[0].lastname,
            accountNumber: result1[0].accountnumber,
            email: req.body.email,
            type: result1[0].type,
            status: result1[0].status,
            openingBalance: result1[0].balance,
          },
        };
        res.status(200).json(response);
      });
    });
  }

  /**
   * Method for getting account history
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  accountHistory(req, res) {
    this.store.transactionStore.read({ accountNumber: req.params.accountNumber }, (err, result) => {
      if (result && !result.length) {
        return res.status(200).json({
          status: 200,
          message: 'No transaction for this account',
        });
      }
      const resp = {
        status: 200,
        data: result,
      };
      res.status(200).json(resp);
    });
  }

  /**
   * Method for getting a specific account transaction history
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  specificTranHist(req, res) {
    this.store.transactionStore.read({ id: req.params.transId }, (err, result) => {
      if (result && !result.length) {
        return res.status(400).json({
          status: 400,
          error: 'Transaction does not exit',
        });
      }
      const resp = {
        status: 200,
        data: result[0],
      };
      res.status(200).json(resp);
    });
  }

  /**
   * Method for getting a specific account details
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  specAcctDetails(req, res) {
    this.store.bankAcctStore.read({ accountNumber: req.params.accountNumber }, (err, result) => {
      if (result && !result.length) {
        return res.status(400).json({
          status: 400,
          error: 'Account does not exit',
        });
      }
      const resp = {
        status: 200,
        data: result[0],
      };
      res.status(200).json(resp);
    });
  }

  confirmEmail(req, res) {
    this.store.userStore.update({ id: req.params.id }, { emailConfirmed: true }, (err, result) => {
      if (err) throw new Error('Error updating');
      res.status(200).json({
        status: 200,
        message: 'Email confirmed. Proceed to create an account',
      });
    });
  }
}

export default UserController;
