/* eslint-disable no-trailing-spaces */
import Controllers from '../controllers';
import { validateToken } from '../util';

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
    this.router.route('/:_id/accounts')
      .post(validateToken, this.userController.createAccount);
      
    return this.router;
  }
}
