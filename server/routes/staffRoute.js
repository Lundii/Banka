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
   * Constructor for creating the StaffRouter class
   * @constructor
   * @param {Router} router - express router class
   * @param {Store} store - Store classes used in the application
   */
  constructor(router, store) {
    this.router = router;
    this.store = store;
    this.staffController = new Controllers.StaffController(store);
    this.verifyIfStaff = this.verifyIfStaff.bind(this);
    this.verifyIsNotAdmin = this.verifyIsNotAdmin.bind(this);
  }
  
  /**
   * Method used for routing
   */
  route() {
    this.router.route('/:id/account/:accountNumber')
      .patch(validateToken, this.verifyIfStaff,
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
      .delete(validateToken, this.verifyIfStaff, this.staffController.deleteAccount);

    this.router.route('/:id/transactions/:accountNumber/credit')
      .post(validateToken, this.verifyIfStaff,
        this.verifyIsNotAdmin, 
        [body('creditAmount', 'field is required').exists(),
          body('creditAmount', 'cannot be empty').isLength({ min: 1 }),
          body('creditAmount', 'must be a number').isInt()], validate,
        this.staffController.creditAccount);

    this.router.route('/:id/transactions/:accountNumber/debit')
      .post(validateToken, this.verifyIfStaff,
        this.verifyIsNotAdmin,
        [body('debitAmount', 'field is required').exists(),
          body('debitAmount', 'cannot be empty').isLength({ min: 1 }),
          body('debitAmount', 'must be a number').isInt()], validate,
        this.staffController.debitAccount);
    
    return this.router;
  }

  /**
   * Private method used to check if user is a staff
   * @private
   * @param {object} req - the server request object
   * @param {object} res - the server response object
   * @param {function} next - express middleware next() function
   */  
  verifyIfStaff(req, res, next) {
    req.params.id = parseInt(req.params.id);
    this.store.userStore.read({ id: req.params.id }, (err, result) => {
      if (result.length && result[0].type !== 'staff') {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized access',
        });
      }
      next();
    });
  }

  /**
   * Private method used to check if user is not an admin
   * @private
   * @param {object} req - the server request object
   * @param {object} res - the server response object
   * @param {function} next - express middleware next() function
   */
  verifyIsNotAdmin(req, res, next) {
    req.params.id = parseInt(req.params.id);
    this.store.userStore.read({ id: req.params.id }, (err, result) => {
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