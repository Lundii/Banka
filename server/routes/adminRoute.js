/* eslint-disable import/no-cycle */
import Controllers from '../controllers';
import { validateToken, validate } from '../util';
import {
  verifyIsAdmin,
  actDeactAccountValidator,
  changePasswordValidator,
  createStaffValidator,
  deleteStaffValidator,
  editUserValidator,
  getAccountsValidator,
  getUsersValidator,
} from '../util/middlewares';

/**
 * Creates a router class for staff page APIs
 * @class
 */
export default class AdminRouter {
  /**
   * Constructor for creating the AdminRouter class
   * @constructor
   * @param {Router} router - express router class
   * @param {Store} store - Store classes used in the application
   */
  constructor(router, store) {
    this.router = router;
    this.adminController = new Controllers.AdminController(store);
    this.staffController = new Controllers.StaffController(store);
    this.userController = new Controllers.UserController(store);
  }

  /**
   * Method used for routing
   */
  route() {
    this.router.route('/:id/account/:accountNumber')
      .patch(validateToken, verifyIsAdmin, actDeactAccountValidator,
        validate,
        this.staffController.actDeactAccount);

    this.router.route('/:id/accounts/:accountNumber')
      .delete(validateToken, verifyIsAdmin, this.staffController.deleteAccount);

    this.router.route('/:id/accounts')
      .get(validateToken, verifyIsAdmin, getAccountsValidator, validate, this.staffController.viewAccountList);

    this.router.route('/:id/:email/accounts')
      .get(validateToken, verifyIsAdmin, this.staffController.viewSpecificAccount);

    this.router.route('/:id/accounts/:accountNumber/transactions')
      .get(validateToken, verifyIsAdmin, this.userController.accountHistory);

    this.router.route('/:id/users')
      .get(validateToken, verifyIsAdmin, getUsersValidator, validate, this.adminController.getStaffs)
      .post(validateToken, verifyIsAdmin, createStaffValidator, validate, this.adminController.createStaff)
      .delete(validateToken, verifyIsAdmin, deleteStaffValidator, validate, this.adminController.deleteStaff)
      .patch(validateToken, verifyIsAdmin, editUserValidator, validate, this.adminController.editClient);

    this.router.route('/:id/changePassword')
      .patch(validateToken, verifyIsAdmin, changePasswordValidator, validate, this.userController.changePassword);

    return this.router;
  }
}
