"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkReqFields = checkReqFields;
exports.passwordMatch = passwordMatch;
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.generateAccountNumber = generateAccountNumber;
exports.validateToken = validateToken;
exports.validate = validate;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _check = require("express-validator/check");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-restricted-properties */

/* eslint-disable radix */
var unique = 10;
/**
 * Helper method to check if the required fieids are passed from the request body
 * @param {array} body - array of the keys passed in the server request.body
 * @param {array} fields - array of fields to check for
 */

function checkReqFields(body, fields) {
  for (var i = 0; i < fields.length; i += 1) {
    if (!body.includes(fields[i])) return i;
  }

  return -1;
}
/**
 * Helper function to check if two password matches
 * @param {string} password - the first password
 * @param {string} confirmPassword - the other password
 */


function passwordMatch(req, res, next) {
  var _req$body = req.body,
      password = _req$body.password,
      confirmPassword = _req$body.confirmPassword;

  if (password !== confirmPassword) {
    return res.status(400).json({
      status: 400,
      error: 'Password and confirm password does not match'
    });
  }

  next();
}
/**
 * Helper function to hash a password
 * @param {string} password - password to hash
 */


function hashPassword(password) {
  if (!arguments) {
    throw new Error('Password must be define');
  }

  var salt = _bcryptjs["default"].genSaltSync(6);

  var hash = _bcryptjs["default"].hashSync(password, salt);

  return hash;
}
/**
 * Helper function to compare a hash function
 * @param {string} password - the string password
 * @param {string} hash - the hashed password
 */


function comparePassword(password, hash) {
  return _bcryptjs["default"].compareSync(password, hash);
}
/**
   * Helper to generate random number between two values
   * @private
   * @param {number} min - minimum number included in the  generation (inclusive)
   * @param {number} max - maximnum number to be generated (exclusive)
   */


function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
/**
   * Helper function to pad numbers
   * @private
   * @param {number} number - the number to pad with leading zeros
   * @param {numer} length  - the length of padded number
   */


function padNumberLength(number, length) {
  if (number <= Math.pow(10, length)) {
    number = "000000".concat(number).slice(-length);
  }

  return number;
}
/**
 * Helper function to help generate account Number
 * @param {string} type - type of account cuurent/string
 */


function generateAccountNumber() {
  var rand1 = getRandomNumber(1, 10);
  var rand2 = padNumberLength(getRandomNumber(0, 10000), 4);
  var id = parseInt("100".concat(rand1).concat(unique.toString()).concat(rand2));
  unique += 1;
  return id;
}
/**
 * Helper function to validate a JWT token
 * @private
 * @param {object} req - the server request object
 * @param {object} res - the server response object
 * @param {function} next - express middleware next() function
 */


function validateToken(req, res, next) {
  var authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    var token = authorizationHeader.split(' ')[1] || authorizationHeader;
    var options = {
      expiresIn: '2h',
      issuer: 'monday.lundii'
    };
    var secret;

    if (req.body && req.body.tokenSecret) {
      secret = req.body.tokenSecret;
    } else {
      secret = process.env.JWT_SECRET || 'yougofindmesoteyyougotire';
    }

    _jsonwebtoken["default"].verify(token, secret, options, function (er, payload) {
      if (er) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized access'
        });
      }

      if (payload) {
        req.payload = payload;
        next();
      }
    });
  } else {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized access'
    });
  }
}
/**
 * Middleware to handle express-validator errors
 * @param {object} req - the req object
 * @param {object} res - the res object 
 * @param {function} next - the next middleware method
 */


function validate(req, res, next) {
  var errors = (0, _check.validationResult)(req);

  if (!errors.isEmpty()) {
    var errMessage = errors.array().reduce(function (err, current) {
      return "".concat(err, " ").concat(current.param, " ").concat(current.msg, " | ");
    }, '');
    return res.status(400).json({
      status: 400,
      error: errMessage
    });
  }

  next();
}