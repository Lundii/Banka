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
  }

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
            accountNumber: result2[0].accountNumber,
            status: result2[0].status,
            message,
          },
        };
        res.status(200).json(response);
      });
    });
  }

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
}

export default StaffController;
