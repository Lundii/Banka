/* eslint-disable import/no-cycle */
import Controllers from '../controllers';
import { validateToken, validate } from '../util';
import {
  verifyIsClient,
  createAccountValidator,
  setHeadersparams2,
  changePasswordValidator,
  transferFundValidator,
  airtimeValidator,
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
    this.staffController = new Controllers.StaffController(store);
  }

  /**
   * Method used for routing
   */
  route() {
    this.router.route('/:id/accounts')
      .get(validateToken, verifyIsClient, this.userController.getAccounts)
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

    this.router.route('/:id/changePassword')
      .patch(validateToken, verifyIsClient, changePasswordValidator, validate, this.userController.changePassword);

    this.router.route('/:id/transactions/:accountNumber/transfer')
      .post(validateToken, verifyIsClient, transferFundValidator, validate, this.userController.transferFunds);

    this.router.route('/:id/transactions/:accountNumber/airtime')
      .post(validateToken, verifyIsClient, airtimeValidator, validate,
        this.userController.buyAirtime, this.staffController.debitAccount);

    return this.router;
  }
}
