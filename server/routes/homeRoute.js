/* eslint-disable import/no-cycle */
import Controllers from '../controllers';
import { passwordMatch, validate, validateToken } from '../util';
import {
  signupValidator,
  signinValidator,
  verifyUser,
  setHeadersparams,
  setHeaderscookies,
  sendResetLinkValidator,
  resetPasswordValidator,
} from '../util/middlewares';

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

    this.router.route('/auth/signup')
      .post(passwordMatch, signupValidator, validate, this.homeController.signup);

    this.router.route('/auth/signin')
      .post(signinValidator, validate, this.homeController.signin);

    this.router.route('/passwordreset')
      .get(this.homeController.getResetMail)
      .post(sendResetLinkValidator, validate, verifyUser, this.homeController.sendResetLink);

    this.router.route('/passwordreset_form/:id/:token')
      .get(setHeadersparams, validateToken, this.homeController.sendResetForm);

    this.router.route('/passwordreset_form')
      .post(setHeaderscookies, validateToken, resetPasswordValidator, validate, this.homeController.resetPassword);
      
    return this.router;
  }
}
