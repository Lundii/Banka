/* eslint-disable no-trailing-spaces */
import { check, body } from 'express-validator/check';
import path from 'path';
import Controllers from '../controllers';
import { passwordMatch, validate, validateToken } from '../util';

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
    this.store = store;
    this.verifyUser = this.verifyUser.bind(this);
    this.setHeaderscookies = this.setHeaderscookies.bind(this);
    this.setHeadersparams = this.setHeadersparams.bind(this);
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
          body(['firstName', 'lastName', 'password', 'confirmPassword'], ' cannot be empty').isLength({ min: 1 }),
          body('confirmPassword', 'Confirm password does not match password').custom((value, { req }) => {
            if (value !== req.body.password) {
              return Promise.reject(new Error('Confirm password does not match password'));
            }
            return Promise.resolve(true);
          })],
        validate, 
        this.homeController.signup);
    
    this.router.route('/auth/signin')
      .post([body(['email', 'password'], 'field is required').exists(),
        body('email', 'is invalid').isEmail(),
        body(['email', 'password'], 'cannot be empty').isLength({ min: 1 })],
      validate, this.homeController.signin);

    this.router.route('/passwordreset')
      .get(this.homeController.getResetMail)
      .post([body('email', 'field is required').exists(),
        body('email', 'is invalid').isEmail(),
        body(['email'], 'cannot be empty').isLength({ min: 1 })],
      validate, this.verifyUser, this.homeController.sendResetLink);

    this.router.route('/passwordreset_form/:id/:token')
      .get(this.setHeadersparams, validateToken, this.homeController.sendResetForm);

    this.router.route('/passwordreset_form')
      .post(this.setHeaderscookies, validateToken, 
        [body(['password', 'confirmPassword'], 'field is required').exists(),
          body(['password', 'confirmPassword'], ' cannot be empty').isLength({ min: 1 }),
          body('confirmPassword', 'Confirm password does not match password').custom((value, { req }) => {
            if (value !== req.body.password) {
              return Promise.reject(new Error('Confirm password does not match password'));
            }
            return Promise.resolve(true);
          })], validate, this.homeController.resetPassword);
      
    return this.router;
  }

 /**
   * Middlware to check if a user exits in the database
   * @private
   * @param {object} req - the server request object
   * @param {object} res - the server response object
   * @param {function} next - express middleware next() function
   */
  verifyUser(req, res, next) {
    this.store.userStore.read({ email: req.body.email }, (err, result) => {
      if (result && !result.length) {
        res.status(400).sendFile(path.join(__dirname, '..', '/controllers/files/incorrectMail.html'));
      }
    });
    next();
  }

 /**
   * Middlware for setting token authorization form req.params
   * @private
   * @param {object} req - the server request object
   * @param {object} res - the server response object
   * @param {function} next - express middleware next() function
   */
  setHeadersparams(req, res, next) {
    req.headers.authorization = req.params.token;
    this.store.userStore.read({ id: req.params.id }, (err, result) => {
      if (result && result.length) {
        req.body.tokenSecret = result[0].password + result[0].email;
        next();
      } else {
        return res.status(400).json({
          status: 400,
          error: 'User does not exit',
        });
      }
    });
  }

 /**
   * Middlware for setting token authorization form req.cookies
   * @private
   * @param {object} req - the server request object
   * @param {object} res - the server response object
   * @param {function} next - express middleware next() function
   */
  setHeaderscookies(req, res, next) {
    req.headers.authorization = req.cookies.auth;
    this.store.userStore.read({ id: req.cookies.id }, (err, result) => {
      if (result && result.length) {
        req.body.tokenSecret = result[0].password + result[0].email;
        next();
      } else {
        return res.status(400).json({
          status: 400,
          error: 'User does not exit',
        });
      }
    });
  }
}
