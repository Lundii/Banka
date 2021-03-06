/* eslint-disable import/no-cycle */
import path from 'path';
import { body, query } from 'express-validator/check';
import { store } from '../server';

/**
   * Private method used to check if user is a staff
   * @private
   * @param {object} req - the server request object
   * @param {object} res - the server response object
   * @param {function} next - express middleware next() function
   */
export function verifyIsStaff(req, res, next) {
  req.params.id = parseInt(req.params.id, 10);
  store.userStore.read({ id: req.params.id }, (err, result) => {
    if ((result && !result.length) || (result[0].type !== 'staff' || result[0].isadmin === true) || result[0].email !== req.payload.email) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized access',
      });
    }
    next();
  });
}

/**
   * Private method used to check if user is an staff
   * @private
   * @param {object} req - the server request object
   * @param {object} res - the server response object
   * @param {function} next - express middleware next() function
   */
export function verifyIsAdmin(req, res, next) {
  req.params.id = parseInt(req.params.id, 10);
  store.userStore.read({ id: req.params.id }, (err, result) => {
    if ((result && !result.length) || (result[0].type !== 'staff' || result[0].isadmin === false) || result[0].email !== req.payload.email) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized access',
      });
    }
    next();
  });
}


/**
   * Middlware for setting token authorization form req.params
   * @private
   * @param {object} req - the server request object
   * @param {object} res - the server response object
   * @param {function} next - express middleware next() function
   */
export function setHeadersparams(req, res, next) {
  req.headers.authorization = req.params.token;
  store.userStore.read({ id: req.params.id }, (err, result) => {
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
export function setHeadersparams2(req, res, next) {
  req.headers.authorization = req.params.token;
  next();
}

/**
   * Middlware for setting token authorization form req.cookies
   * @private
   * @param {object} req - the server request object
   * @param {object} res - the server response object
   * @param {function} next - express middleware next() function
   */
export function setHeaderscookies(req, res, next) {
  req.headers.authorization = req.cookies.auth;
  store.userStore.read({ id: req.cookies.id }, (err, result) => {
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
   * Private method used to check if user is a client
   * @private
   * @param {object} req - the server request object
   * @param {object} res - the server response object
   * @param {function} next - express middleware next() function
   */
export function verifyIsClient(req, res, next) {
  req.params.id = parseInt(req.params.id, 10);
  store.userStore.read({ id: req.params.id }, (err, result) => {
    if ((result && !result.length) || (result[0].type !== 'client') || result[0].email !== req.payload.email) {
      return res.status(401).json({
        status: 401,
        error: 'Unauthorized access',
      });
    }
    next();
  });
}

/**
   * Middlware to check if a user exits in the database
   * @private
   * @param {object} req - the server request object
   * @param {object} res - the server response object
   * @param {function} next - express middleware next() function
   */
export function verifyUser(req, res, next) {
  store.userStore.read({ email: req.body.email }, (err, result) => {
    if (result && !result.length) {
      res.status(400).sendFile(path.join(__dirname, '..', '/controllers/files/incorrectMail.html'));
    }
  });
  next();
}

export const createAccountValidator = [
  body(['type'], 'field is required').exists(),
  body(['type'], ' cannot be empty').isLength({ min: 1 }),
  body('type', 'type can either be savings or current').custom((value) => {
    if (value !== 'savings' && value !== 'current') {
      return Promise.reject(new Error('Account type can either be savings or current'));
    }
    return Promise.resolve(true);
  }),
];

export const signupValidator = [
  body(['firstName', 'lastName', 'email', 'password', 'confirmPassword'], 'field is required').exists(),
  body('email', 'is invalid').isEmail(),
  body(['firstName', 'lastName', 'password', 'confirmPassword'], ' cannot be empty').isLength({ min: 1 }),
  body(['firstName', 'lastName'], ' should contain only letters').isAlpha(),
  body('confirmPassword', 'does not match password').custom((value, { req }) => {
    if (value !== req.body.password) {
      return Promise.reject(new Error('Confirm password does not match password'));
    }
    return Promise.resolve(true);
  }),
];

export const signinValidator = [
  body(['email', 'password'], 'field is required').exists(),
  body('email', 'is invalid').isEmail(),
  body(['email', 'password'], 'cannot be empty').isLength({ min: 1 }),
];

export const sendResetLinkValidator = [
  body('email', 'field is required').exists(),
  body('email', 'is invalid').isEmail(),
  body(['email'], 'cannot be empty').isLength({ min: 1 }),
];

export const resetPasswordValidator = [
  body(['password', 'confirmPassword'], 'field is required').exists(),
  body(['password', 'confirmPassword'], ' cannot be empty').isLength({ min: 1 }),
  body('confirmPassword', 'does not match password').custom((value, { req }) => {
    if (value !== req.body.password) {
      return Promise.reject(new Error('Confirm password does not match password'));
    }
    return Promise.resolve(true);
  }),
];

export const creditAccountValidator = [
  body('creditAmount', 'field is required').exists(),
  body('creditAmount', 'cannot be empty').isLength({ min: 1 }),
  body('creditAmount', 'must be a number').isInt(),
  body('creditAmount', 'must be greater than 0').custom((value, { req }) => {
    if (!(parseInt(value, 10) > 0)) {
      return Promise.reject(new Error('must be greater than zero(0)'));
    }
    return Promise.resolve(true);
  }),
];

export const debitAccountValidator = [
  body('debitAmount', 'field is required').exists(),
  body('debitAmount', 'cannot be empty').isLength({ min: 1 }),
  body('debitAmount', 'must be a number').isInt(),
  body('debitAmount', 'must be greater than 0').custom((value, { req }) => {
    if (!(parseInt(value, 10) > 0)) {
      return Promise.reject(new Error('must be greater than zero(0)'));
    }
    return Promise.resolve(true);
  }),
];

export const actDeactAccountValidator = [
  body('status', 'field is required').exists(),
  body('status', 'cannot be empty').isLength({ min: 1 }),
  body('status', 'can either be active or dormant').custom((value) => {
    if (value !== 'dormant' && value !== 'active') {
      return Promise.reject(new Error('Status can either be active or dormant'));
    }
    return Promise.resolve(true);
  }),
];

export const changePasswordValidator = [
  body(['oldPassword', 'newPassword', 'confirmPassword'], 'field is required').exists(),
  body(['oldPassword', 'newPassword', 'confirmPassword'], ' cannot be empty').isLength({ min: 1 }),
  body('confirmPassword', 'does not match password').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      return Promise.reject(new Error('does not match password'));
    }
    return Promise.resolve(true);
  }),
  body('newPassword', 'must be different from old password ').custom((value, { req }) => {
    if (value === req.body.oldPassword) {
      return Promise.reject(new Error('must be different from old password '));
    }
    return Promise.resolve(true);
  }),
];

export const createStaffValidator = [
  body(['firstName', 'lastName', 'email', 'isadmin'], 'field is required').exists(),
  body('email', 'is invalid').isEmail(),
  body(['firstName', 'lastName', 'isadmin'], ' cannot be empty').isLength({ min: 1 }),
  body(['firstName', 'lastName'], ' should contain only letters').isAlpha(),
  body('isadmin', 'field can either be true or false').custom((value, { req }) => {
    if (value !== true && value !== false) {
      return Promise.reject(new Error('isadmin field can either be true or false'));
    }
    return Promise.resolve(true);
  }),
];

export const deleteStaffValidator = [
  body('staffemail', 'field is required').exists(),
  body('staffemail', 'cannot be empty').isLength({ min: 1 }),
];

export const editClientValidator = [
  body('clientEmail', 'field is required').exists(),
  body('clientEmail', 'must be a valid email').isEmail(),
  body('clientEmail', 'cannot be empty').isLength({ min: 1 }),
];

export const editUserValidator = [
  body('userEmail', 'field is required').exists(),
  body('userEmail', 'must be a valid email').isEmail(),
  body('userEmail', 'cannot be empty').isLength({ min: 1 }),
];

export const transferFundValidator = [
  body(['receiverAcctNum', 'transferAmount'], 'field is required').exists(),
  body(['receiverAcctNum', 'transferAmount'], 'cannot be empty').isLength({ min: 1 }),
  body(['transferAmount', 'receiverAcctNum'], 'must be a number').isInt(),
  body('transferAmount', 'must be greater than 0').custom((value, { req }) => {
    if (!(parseInt(value, 10) > 0)) {
      return Promise.reject(new Error('must be greater than zero(0)'));
    }
    return Promise.resolve(true);
  }),
];

export const airtimeValidator = [
  body(['airtimeAmount', 'phoneNumber', 'network'], 'field is required').exists(),
  body(['airtimeAmount', 'network'], 'cannot be empty').isLength({ min: 1 }),
  body('phoneNumber', 'not valid').isLength({ min: 11, max: 11 }),
  body('airtimeAmount', 'must be a number').isInt(),
  body('airtimeAmount', 'must be greater than 0').custom((value, { req }) => {
    if (!(parseInt(value, 10) > 0)) {
      return Promise.reject(new Error('must be greater than zero(0)'));
    }
    return Promise.resolve(true);
  }),
  body('network', 'number is not valid').custom((value, { req }) => {
    switch (value.toLowerCase()) {
      case 'mtn':
        if (!(/^(0[789][01][364])/).test(req.body.phoneNumber)) {
          return Promise.reject(new Error('number is invalid'));
        }
        break;
      case '9mobile':
        if (!(/^(0[789][01][978])/).test(req.body.phoneNumber)) {
          return Promise.reject(new Error('number is invalid'));
        }
        break;
      case 'airtel':
        if (!(/^(0[789][01][8271])/).test(req.body.phoneNumber)) {
          return Promise.reject(new Error('number is invalid'));
        }
        break;
      case 'glo':
        if (!(/^(0[789][01][517])/).test(req.body.phoneNumber)) {
          return Promise.reject(new Error('number is invalid'));
        }
        break;
      default:
        return Promise.reject(new Error('is invalid'));
    }
    return Promise.resolve(true);
  }),
];

export const getAccountsValidator = [
  query(['status', 'email', 'accountNumber'], 'cannot be empty').optional().isLength({ min: 1 }),
  query('accountNumber', 'must be a number').optional().isInt(),
  query('email', 'must be a valid email').optional().isEmail(),
  query('status', 'must be active or dormant').optional().custom((value, { req }) => {
    if (value !== 'dormant' && value !== 'active') {
      return Promise.reject(new Error('must be active or dormant'));
    }
    return Promise.resolve(true);
  }),
];

export const getUsersValidator = [
  query(['type', 'email', 'id'], 'cannot be empty').optional().isLength({ min: 1 }),
  query('id', 'must be a number').optional().isInt(),
  query('email', 'must be a valid email').optional().isEmail(),
  query('type', 'must be staff or admin').optional().custom((value, { req }) => {
    if (value !== 'staff' && value !== 'admin') {
      return Promise.reject(new Error('must be staff or admin'));
    }
    return Promise.resolve(true);
  }),
];
