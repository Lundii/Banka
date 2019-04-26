/* eslint-disable import/no-cycle */
import Controllers from '../controllers';
import { validateToken, validate } from '../util';
import {
  verifyIsClient,
  createAccountValidator,
  setHeadersparams2,
} from '../util/middlewares';

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
      .post(validateToken, verifyIsClient, createAccountValidator,
        validate, this.userController.createAccount);

    this.router.route('/:id/accounts/:accountNumber/transactions')
      .get(validateToken, verifyIsClient, this.userController.accountHistory);

    this.router.route('/:id/transactions/:transId')
      .get(validateToken, verifyIsClient, this.userController.specificTranHist);

    this.router.route('/:id/accounts/:accountNumber')
      .get(validateToken, verifyIsClient, this.userController.specAcctDetails);
      
    this.router.route('/:id/confirmEmail/:token')
      .get(setHeadersparams2, validateToken, verifyIsClient, this.userController.confirmEmail);
    return this.router;
  }
}
