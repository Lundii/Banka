import jwt from 'jsonwebtoken';
import { generateAccountNumber, comparePassword, hashPassword } from '../util';
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
    this.getAccounts = this.getAccounts.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.transferFunds = this.transferFunds.bind(this);
    this.buyAirtime = this.buyAirtime.bind(this);
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
      ownerEmail: req.payload.email,
      type: req.body.type,
      status: 'active',
      balance: 0.00,
    };
    this.store.userStore.read({ email: req.payload.email }, (err, result) => {
      if (result && !result.length) {
        return res.status.json({
          status: 400,
          error: 'user does not exit',
        });
      }
      if (result && result.length && result[0].emailconfirmed === false) {
        const payload = {
          password: result[0].password,
          email: result[0].email,
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
        result1[0].email = req.payload.email;

        this.store.userStore.update({ email: req.payload.email }, { createdAnAccount: true }, (err2, result2) => {
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
            message: 'Account successfully created',
          };
          res.status(200).json(response);
        });
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
    const query = `SELECT 
                    users.firstname,
                    users.lastname,
                    bankaccounts.*
                  FROM users 
                  INNER JOIN bankaccounts ON users.email = bankaccounts.owneremail
                  WHERE accountnumber = '${req.params.accountNumber}'
  `;
    this.store.bankAcctStore.compoundQuery(query, (err, result) => {
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
        message: 'Email confirmed. Proceed to create a bank account',
      });
    });
  }

  getAccounts(req, res) {
    const query = `SELECT 
                    users.firstname,
                    users.lastname,
                    bankaccounts.*
                  FROM users 
                  INNER JOIN bankaccounts ON users.email = bankaccounts.owneremail
                  WHERE owneremail = '${req.payload.email}'
  `;
    this.store.userStore.compoundQuery(query, (err, result) => {
      if (result && !result.length) {
        return res.status(200).json({
          status: 200,
          data: result,
          message: 'No account found',
        });
      }
      res.status(200).json({
        status: 200,
        data: result,
      });
    });
  }

  changePassword(req, res) {
    this.store.userStore.read({ id: req.params.id }, (err, result) => {
      if (result && result.length) {
        const verifypassword = comparePassword(req.body.oldPassword, result[0].password);
        if (!verifypassword) {
          return res.status(403).json({
            status: 403,
            error: 'Password is incorrect',
          });
        }
      }
      const hashPass = hashPassword(req.body.newPassword);
      this.store.userStore.update({ id: req.params.id }, { password: hashPass }, (err1, result1) => {
        if (err1) throw new Error('Error updating password');
        return res.status(200).json({
          status: 200,
          message: 'Password successfully changed',
        });
      });
    });
  }

  transferFunds(req, res) {
    // debit sender account
    req.params.accountNumber = parseInt(req.params.accountNumber, 10);
    this.store.bankAcctStore.read({ accountNumber: req.params.accountNumber }, (err, result) => {
      if (err) throw new Error('Cannot find account');
      if (!result.length) {
        return res.status(400).json({
          status: 400,
          error: 'Account number does not exit in the database',
        });
      }
      if (result[0].owneremail !== req.payload.email) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized access',
        });
      }
      if (parseFloat(req.body.transferAmount) > result[0].balance) {
        return res.status(400).json({
          status: 400,
          error: 'Insufficient Balance',
        });
      }
      if (result[0].status === 'dormant') {
        return res.status(400).json({
          status: 400,
          error: 'Account dormant',
        });
      }
      const data = {
        createdOn: new Date(),
        type: 'debit',
        accountNumber: req.params.accountNumber,
        cashier: parseFloat(req.params.id),
        amount: parseFloat(req.body.transferAmount),
        oldBalance: result[0].balance,
        newBalance: result[0].balance - parseFloat(req.body.transferAmount),
      };
      this.store.transactionStore.create(data, (err1, result1) => {
        if (err1) throw new Error('Error saving transaction');
        Email.transactionAlert(result[0].owneremail, result1[0]);
        this.store.bankAcctStore.update({ accountNumber: req.params.accountNumber },
          { balance: result1[0].newbalance }, (err2, result2) => {
            // credit receiver account
            req.body.receiverAcctNum = parseInt(req.body.receiverAcctNum, 10);
            this.store.bankAcctStore.read({ accountNumber: req.body.receiverAcctNum }, (err3, result3) => {
              if (err3) throw new Error('Cannot find account');
              if (!result3.length) {
                return res.status(400).json({
                  status: 400,
                  error: 'Receiver account number does not exit in the database',
                });
              }
              const data2 = {
                createdOn: new Date(),
                type: 'credit',
                accountNumber: req.body.receiverAcctNum,
                cashier: parseFloat(req.params.id),
                amount: parseFloat(req.body.transferAmount),
                oldBalance: result3[0].balance,
                newBalance: result3[0].balance + parseFloat(req.body.transferAmount),
              };
              this.store.transactionStore.create(data2, (err4, result4) => {
                if (err1) throw new Error('Error saving transaction');
                Email.transactionAlert(result[0].owneremail, result4[0]);
                this.store.bankAcctStore.update({ accountNumber: req.body.receiverAcctNum },
                  { balance: result4[0].newbalance }, (err5, result5) => {
                    if (err5) throw new Error('Error updating transaction');
                    const resp = {
                      status: 200,
                      data: {
                        transactionId: result1[0].id,
                        accountNumber: req.params.accountNumber.toString(),
                        amount: parseFloat(result1[0].amount),
                        cashier: req.params.id,
                        transactionType: result1[0].type,
                        accountBalance: result1[0].newbalance.toString(),
                      },
                      message: 'Transfer succesful',
                    };
                    res.status(200).json(resp);
                  });
              });
            });
          });
      });
    });
  }

  buyAirtime(req, res, next) {
    this.store.bankAcctStore.read({ accountNumber: req.params.accountNumber }, (err, result) => {
      if (err) throw new Error('Cannot find account');
      if (result.length && (result[0].owneremail !== req.payload.email)) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized access',
        });
      }
      next();
    });
  }
}

export default UserController;
