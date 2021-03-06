import Email from '../util/emailServices';
/**
 * Staff route controller class
 * @class
 */
class StaffController {
  /**
   * Constructor for staff route controller class
   * @constructor
   * @param {Store} store - the store class used for storing data
   */
  constructor(store) {
    this.store = store;
    this.actDeactAccount = this.actDeactAccount.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.creditAccount = this.creditAccount.bind(this);
    this.debitAccount = this.debitAccount.bind(this);
    this.viewAccountList = this.viewAccountList.bind(this);
    this.viewSpecificAccount = this.viewSpecificAccount.bind(this);
    this.getAccountDetails = this.getAccountDetails.bind(this);
  }

  /**
   * Method for handling activating or deactivating account route(PATCH api/v1/staff/<id>/account/<accountNumber>)
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  actDeactAccount(req, res) {
    req.params.accountNumber = parseInt(req.params.accountNumber, 10);
    this.store.bankAcctStore.read({ accountNumber: req.params.accountNumber }, (err, result) => {
      if (err) throw new Error('Cannot find account');
      if (!result.length) {
        return res.status(400).json({
          status: 400,
          error: 'Account number does not exit in the database',
        });
      }
      if (result[0].status === req.body.status) {
        return res.status(400).json({
          status: 400,
          error: `Account number is already ${req.body.status}`,
        });
      }
      this.store.bankAcctStore.update({ accountNumber: req.params.accountNumber }, req.body, (er, result2) => {
        if (er) throw new Error('Error searching for file');
        const message = result2[0].status === 'dormant' ? 'Account successfully deactivated' : 'Account successfully activated';
        const response = {
          status: 200,
          data: {
            accountNumber: result2[0].accountnumber,
            status: result2[0].status,
          },
          message,
        };
        res.status(200).json(response);
      });
    });
  }

  /**
   * Method for deleting an account route(DELETE api/v1/staff/<id>/account/<accountNumber>)
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  deleteAccount(req, res) {
    req.params.accountNumber = parseInt(req.params.accountNumber, 10);
    this.store.bankAcctStore.read({ accountNumber: req.params.accountNumber }, (err, result) => {
      if (err) throw new Error('Cannot find account');
      if (!result.length) {
        return res.status(400).json({
          status: 400,
          error: 'Account number does not exit in the database',
        });
      }
      this.store.bankAcctStore.remove({ accountNumber: req.params.accountNumber }, (er, result2) => {
        const response = {
          status: 200,
          message: 'Account successfully deleted',
        };
        res.status(200).json(response);
      });
    });
  }

  /**
   * Method for handling crediting account route(POST api/v1/staff/<id>/transactions/<accountNumber>/credit)
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  creditAccount(req, res) {
    req.params.accountNumber = parseInt(req.params.accountNumber, 10);
    this.store.bankAcctStore.read({ accountNumber: req.params.accountNumber }, (err, result) => {
      if (err) throw new Error('Cannot find account');
      if (!result.length) {
        return res.status(400).json({
          status: 400,
          error: 'Account number does not exit in the database',
        });
      }
      const data = {
        createdOn: new Date(),
        type: 'credit',
        accountNumber: req.params.accountNumber,
        cashier: parseFloat(req.params.id),
        amount: parseFloat(req.body.creditAmount),
        oldBalance: result[0].balance,
        newBalance: result[0].balance + parseFloat(req.body.creditAmount),
      };
      this.store.transactionStore.create(data, (err1, result1) => {
        if (err1) throw new Error('Error saving transaction');
        Email.transactionAlert(result[0].owneremail, result1[0]);
        this.store.bankAcctStore.update({ accountNumber: req.params.accountNumber },
          { balance: result1[0].newbalance }, (err2, result2) => {
            if (err2) throw new Error('Error updating transaction');
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
              message: 'Account successfully credited',
            };
            res.status(200).json(resp);
          });
      });
    });
  }

  /**
  * Method for handling deleting an account route(POST api/v1/staff/<id>/transactions/<accountNumber>/debit)
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  debitAccount(req, res) {
    req.params.accountNumber = parseInt(req.params.accountNumber, 10);
    this.store.bankAcctStore.read({ accountNumber: req.params.accountNumber }, (err, result) => {
      if (err) throw new Error('Cannot find account');
      if (!result.length) {
        return res.status(400).json({
          status: 400,
          error: 'Account number does not exit in the database',
        });
      }
      if (parseFloat(req.body.debitAmount || req.body.airtimeAmount) > result[0].balance) {
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
        amount: parseFloat(req.body.debitAmount || req.body.airtimeAmount),
        oldBalance: result[0].balance,
        newBalance: result[0].balance - parseFloat(req.body.debitAmount || req.body.airtimeAmount),
      };
      this.store.transactionStore.create(data, (err1, result1) => {
        if (err1) throw new Error('Error saving transaction');
        Email.transactionAlert(result[0].owneremail, result1[0]);
        this.store.bankAcctStore.update({ accountNumber: req.params.accountNumber },
          { balance: result1[0].newbalance }, (err2, result2) => {
            if (err2) throw new Error('Error updating transaction');
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
              message: `${req.body.debitAccount ? 'Account successfully debited' : 'Recharge succesful'}`,
            };
            res.status(200).json(resp);
          });
      });
    });
  }

  /**
  * Method for viewing all account list
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  viewAccountList(req, res) {
    if (Object.keys(req.query).length && ((Object.keys(req.query)[0] !== 'status')
    && (Object.keys(req.query)[0] !== 'email') && (Object.keys(req.query)[0] !== 'accountNumber'))) {
      return res.status(400).json({
        status: 400,
        error: 'Invalid query parameters',
      });
    }
    let query = `SELECT 
            users.firstname,
            users.lastname,
            bankaccounts.*
          FROM bankaccounts 
          INNER JOIN users ON users.email = bankaccounts.owneremail`;
    if (req.query.status) {
      query = query.concat(' \n', `AND bankaccounts.status = '${req.query.status}'`);
    }
    if (req.query.email) {
      query = query.concat(' \n', `AND bankaccounts.owneremail = '${req.query.email}'`);
    }
    if (req.query.accountNumber) {
      query = query.concat(' \n', `AND bankaccounts.accountNumber = '${req.query.accountNumber}'`);
    }
    this.store.userStore.compoundQuery(query, (err, result) => {
      if (err) throw new Error('Error reading bank accounts');
      if (result && !result.length) {
        return res.status(200).json({
          status: 200,
          data: result,
          message: 'No account found',
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
  * Method for viewing specific account
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  viewSpecificAccount(req, res) {
    this.store.userStore.read({ email: req.params.email }, (err, result) => {
      if (result && !result.length) {
        return res.status(400).json({
          status: 400,
          error: 'User does not exit in the database',
        });
      }
      this.store.bankAcctStore.read({ owneremail: req.params.email }, (err1, result1) => {
        if (result1 && !result1.length) {
          return res.status(200).json({
            status: 200,
            message: 'No account found for this user',
          });
        }
        const resp = {
          status: 200,
          data: result1,
        };
        res.status(200).json(resp);
      });
    });
  }

  getAccountDetails(req, res) {
    const query = `SELECT 
                    users.firstname,
                    users.lastname,
                    bankaccounts.*
                  FROM users 
                  INNER JOIN bankaccounts ON users.email = bankaccounts.owneremail
                  WHERE accountnumber = '${req.params.accountNumber}'
  `;
    this.store.userStore.compoundQuery(query, (err, result) => {
      if (result && !result.length) {
        return res.status(400).json({
          status: 400,
          error: 'Account does not exit',
        });
      }
      res.status(200).json({
        status: 200,
        data: result,
      });
    });
  }
}

export default StaffController;
