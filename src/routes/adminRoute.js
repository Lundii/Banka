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
   * Constructor for creating the AdminRouter class
   * @constructor
   * @param {Router} router - express router class
   * @param {Store} store - Store classes used in the application
   */
  constructor(router, store) {
    this.router = router;
    this.store = store;
    this.adminController = new Controllers.AdminController(store);
    this.staffController = new Controllers.StaffController(store);
    this._verifyIfAdmin = this._verifyIfAdmin.bind(this);
    this._verifyIfStaff = this._verifyIfStaff.bind(this);
  }
  
  /**
   * Method used for routing
   */
  route() {
    this.router.route('/:_id/account/:accountNumber')
      .patch(validateToken, this._verifyIfStaff, this.staffController.actDeactAccount);
      
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

  _verifyIfAdmin(req, res, next) {
    req.params._id = parseInt(req.params._id);
    this.store.userStore.read({ _id: req.params._id }, (err, result) => {
      if (result.length && result[0].isAdmin === false) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized access',
        });
      }
      next();
    });
  }
}
