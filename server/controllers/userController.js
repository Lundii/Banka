// import nodemailer from 'nodemailer';
import { generateAccountNumber } from '../util';
import Email from '../util/emailServices';
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
    this.store.bankAcctStore.create(data, (err, result) => {
      if (err) throw new Error('Error saving account Number');
      Email.createAccount(req.body.email);
      const response = {
        status: 200,
        data: {
          id: result[0].id,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          accountNumber: result[0].accountnumber,
          email: req.body.email,
          type: result[0].type,
          status: result[0].status,
          openingBalance: result[0].balance,
        },
      };
      res.status(200).json(response);
    });
  }

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
}

export default UserController;
