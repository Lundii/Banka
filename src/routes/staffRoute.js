/* eslint-disable no-trailing-spaces */
import Controllers from '../controllers';
import { validateToken } from '../util';

/**
 * Creates a router class for staff page APIs
 * @class
 */
export default class StaffRouter {
  /**
   * Constructor for creating the UserRouter class
   * @constructor
   * @param {Router} router - express router class
   * @param {Store} store - Store classes used in the application
   */
  constructor(router, store) {
    this.router = router;
    this.staffController = new Controllers.StaffController(store);
  }
  
  /**
   * Method used for routing
   */
  route() {
    this.router.route('/accounts')
      .post(this.userController.createAccount);
      
    return this.router;
  }
}
