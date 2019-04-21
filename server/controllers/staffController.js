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
            message,
          },
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
        this.store.bankAcctStore.update({ accountNumber: req.params.accountNumber },
          { balance: result1[0].newbalance }, (err2, result2) => {
            console.log(err2);
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
      if (parseFloat(req.body.debitAmount) > result[0].balance) {
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
        amount: parseFloat(req.body.debitAmount),
        oldBalance: result[0].balance,
        newBalance: result[0].balance - parseFloat(req.body.debitAmount),
      };
      this.store.transactionStore.create(data, (err1, result1) => {
        if (err1) throw new Error('Error saving transaction');
        this.store.bankAcctStore.update({ accountNumber: req.params.accountNumber },
          { balance: result1[0].newbalance }, (err2, result2) => {
            console.log(err2);
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
            };
            res.status(200).json(resp);
          });
      });
    });
  }
}

export default StaffController;
