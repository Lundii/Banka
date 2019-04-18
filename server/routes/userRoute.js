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
    this.userController = new Controllers.UserController(store);
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
      
    return this.router;
  }
}
