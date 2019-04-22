/* eslint-disable no-trailing-spaces */
import { body } from 'express-validator/check';
import Controllers from '../controllers';
import { validateToken, validate } from '../util';

/**
 * Creates a router class for using page APIs
 * @class
 */
export default class UserRouter {
  /**
   * Constructor for creating the UserRouter class
   * @constructor
   * @param {Router} router - express router class
   * @param {Store} store - Store classes used in the application
   */
  constructor(router, store) {
    this.router = router;
    this.store = store;
    this.userController = new Controllers.UserController(store);
    this.verifyIsClient = this.verifyIsClient.bind(this);
  }
  
  /**
   * Method used for routing
   */
  route() {
    this.router.route('/:id/accounts')
      .post(validateToken, 
        [body(['firstName', 'lastName', 'email', 'type'], 'field is required').exists(),
          body(['firstName', 'lastName', 'type'], ' cannot be empty').isLength({ min: 1 }),
          body('type', 'Account type can either be savings or current').custom((value) => {
            if (value !== 'savings' && value !== 'current') {
              return Promise.reject(new Error('Account type can either be savings or current'));
            }
            return Promise.resolve(true);
          })],
        validate, this.userController.createAccount);

    this.router.route('/:id/:accountnumber/transactions')
      .get(validateToken, this.verifyIsClient, this.userController.accountHistory);
      
    return this.router;
  }

  
  /**
   * Private method used to check if user is a client
   * @private
   * @param {object} req - the server request object
   * @param {object} res - the server response object
   * @param {function} next - express middleware next() function
   */  
  verifyIsClient(req, res, next) {
    req.params.id = parseInt(req.params.id, 10);
    this.store.userStore.read({ id: req.params.id }, (err, result) => {
      if ((result && !result.length) || (result[0].type !== 'client')) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized access',
        });
      }
      next();
    });
  }
}
