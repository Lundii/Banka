/* eslint-disable import/no-cycle */
/* eslint-disable no-trailing-spaces */
import Controllers from '../controllers';
import { validateToken, validate } from '../util';
import { 
  verifyIsStaff, 
  creditAccountValidator, 
  debitAccountValidator,
  actDeactAccountValidator,
  changePasswordValidator,
  editClientValidator,
  getAccountsValidator,
} from '../util/middlewares';

/**
 * Creates a router class for staff page APIs
 * @class
 */
export default class StaffRouter {
  /**
   * Constructor for creating the StaffRouter class
   * @constructor
   * @param {Router} router - express router class
   * @param {Store} store - Store classes used in the application
   */
  constructor(router, store) {
    this.router = router;
    this.staffController = new Controllers.StaffController(store);
    this.userController = new Controllers.UserController(store);
    this.adminController = new Controllers.AdminController(store);
  }
  
  /**
   * Method used for routing
   */
  route() {
    this.router.route('/:id/account/:accountNumber')
      .patch(validateToken, verifyIsStaff, actDeactAccountValidator,
        validate,
        this.staffController.actDeactAccount);

    this.router.route('/:id/accounts/:accountNumber')
      .get(validateToken, verifyIsStaff, this.staffController.getAccountDetails)
      .delete(validateToken, verifyIsStaff, this.staffController.deleteAccount);

    this.router.route('/:id/transactions/:accountNumber/credit')
      .post(validateToken, verifyIsStaff, creditAccountValidator, validate,
        this.staffController.creditAccount);

    this.router.route('/:id/transactions/:accountNumber/debit')
      .post(validateToken, verifyIsStaff, debitAccountValidator, validate,
        this.staffController.debitAccount);
    
    this.router.route('/:id/accounts')
      .get(validateToken, verifyIsStaff, getAccountsValidator, validate, this.staffController.viewAccountList);

    this.router.route('/:id/:email/accounts')
      .get(validateToken, verifyIsStaff, this.staffController.viewSpecificAccount);
      
    this.router.route('/:id/accounts/:accountNumber/transactions')
      .get(validateToken, verifyIsStaff, this.userController.accountHistory);

    this.router.route('/:id/changePassword')
      .patch(validateToken, verifyIsStaff, changePasswordValidator, validate, this.userController.changePassword);

    this.router.route('/:id/users')
      .patch(validateToken, verifyIsStaff, editClientValidator, validate, this.adminController.editClient);

    return this.router;
  }
}
