/* eslint-disable radix */
/* eslint-disable no-trailing-spaces */
import { body } from 'express-validator/check';
import Controllers from '../controllers';
import { validateToken, validate } from '../util';

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
    this.verifyIsAdmin = this.verifyIsAdmin.bind(this);
  }
  
  /**
   * Method used for routing
   */
  route() {
    this.router.route('/:id/account/:accountNumber')
      .patch(validateToken, this.verifyIsAdmin,
        [body('status', 'field is required').exists(),
          body('status', 'cannot be empty').isLength({ min: 1 }),
          body('status', 'Status can either be active or dormant').custom((value) => {
            if (value !== 'dormant' && value !== 'active') {
              return Promise.reject(new Error('Status can either be active or dormant'));
            }
            return Promise.resolve(true);
          })],
        validate,
        this.staffController.actDeactAccount);

    this.router.route('/:id/account/:accountNumber')
      .delete(validateToken, this.verifyIsAdmin, this.staffController.deleteAccount);

    this.router.route('/:id/accounts')
      .get(validateToken, this.verifyIsAdmin, this.staffController.viewAccountList);

    this.router.route('/:id/:email/accounts')
      .get(validateToken, this.verifyIsAdmin, this.staffController.viewSpecificAccount);
      
    return this.router;
  }

  /**
   * Private method used to check if user is an staff
   * @private
   * @param {object} req - the server request object
   * @param {object} res - the server response object
   * @param {function} next - express middleware next() function
   */
  verifyIsAdmin(req, res, next) {
    req.params.id = parseInt(req.params.id);
    this.store.userStore.read({ id: req.params.id }, (err, result) => {
      if ((result && !result.length) || (result[0].type !== 'staff' || result[0].isadmin === false)) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized access',
        });
      }
      next();
    });
  }
}
