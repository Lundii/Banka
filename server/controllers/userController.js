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
}

export default UserController;
