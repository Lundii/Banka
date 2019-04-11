import { generateAccountNumber } from '../util'
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
  }

  createAccount(req, res) {
    const accountNumber = generateAccountNumber(req.body.type);
    const data = {
      id: 3456433455,
      accountNumber,
      createdOn: new Date().getTime,
      balance: 0.00,
      type: req.body.type,
    };
    this.store.bankAcctStore.create(data, (err, result) => {
      if (err) throw new Error('Error saving account Number');
      const response = {
        status: 200,
        data: {
          id: result[0].id,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          accountNumber: result[0].id,
          email: req.body.email,
          type: result[0].type,
          openingBalance: result[0].balance,
        },
      };
      res.status(200).json(response);
    });
  }
}

export default UserController;
