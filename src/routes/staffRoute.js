/* eslint-disable radix */
/* eslint-disable no-trailing-spaces */
import Controllers from '../controllers';
import { validateToken } from '../util';

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
    this.store = store;
    this.staffController = new Controllers.StaffController(store);
    this._verifyIfStaff = this._verifyIfStaff.bind(this);
  }
  
  /**
   * Method used for routing
   */
  route() {
    this.router.route('/:_id/account/:accountNumber')
      .patch(validateToken, this._verifyIfStaff, this.staffController.actDeactAccount);

    this.router.route('/:_id/account/:accountNumber')
      .delete(validateToken, this._verifyIfStaff, this.staffController.deleteAccount);

    this.router.route('/_id/transactions/:accountNumber/credit')
      .post(validateToken, this._verifyIfStaff, this._verifyIsNotAdmin, this.staffController.creditAccount);
    
    return this.router;
  }
  
  _verifyIfStaff(req, res, next) {
    req.params._id = parseInt(req.params._id);
    this.store.userStore.read({ _id: req.params._id }, (err, result) => {
      if (result.length && result[0].type !== 'staff') {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized access',
        });
      }
      next();
    });
  }

  _verifyIsNotAdmin(req, res, next) {
    req.params._id = parseInt(req.params._id);
    this.store.userStore.read({ _id: req.params._id }, (err, result) => {
      if (result.length && result[0].isAdmin === true) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized access',
        });
      }
      next();
    });
  }
}
