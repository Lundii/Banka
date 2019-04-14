/* eslint-disable no-trailing-spaces */
import { check, body } from 'express-validator/check';
import Controllers from '../controllers';
import { passwordMatch, validate } from '../util';

/**
 * Creates a router class for handling landing page APIs
 * @class
 */
export default class HomeRouter {
  /**
   * Constructor for creating the HomeRouter class
   * @constructor
   * @param {Router} router - express router class
   * @param {Store} store - Store classes used in the application
   */
  constructor(router, store) {
    this.router = router;
    this.bankAcctStore = store.bankAcctStore;
    this.homeController = new Controllers.HomeController(store);
  }
  
  /**
   * Method used for routing
   */
  route() {
    this.router.route('/')
      .get((req, res) => {
        res.status(200).json({
          status: 200,
          message: 'Welcome to Banka app',
        });
      });  

    this.router.route('/signup')
      .post(passwordMatch, 
        [body(['firstName', 'lastName', 'email', 'password', 'confirmPassword'], 'field is required').exists(),
          body('email', 'is invalid').isEmail(),
          body(['firstName', 'lastName', 'password', 'confirmPassword'], ' cannot be empty').isLength({ min: 1 })],
        validate, 
        this.homeController.signup);
    
    this.router.route('/auth/signin')
      .post([body(['email', 'password'], 'field is required').exists(),
        body('email', 'is invalid'),
        body(['email, password'], 'cannot be empty').isEmpty()],
      validate, this.homeController.signin);

    return this.router;
  }
}
