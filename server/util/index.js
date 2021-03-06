/* eslint-disable no-restricted-properties */
/* eslint-disable radix */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator/check';

let unique = 10;

/**
 * Helper method to check if the required fieids are passed from the request body
 * @param {array} body - array of the keys passed in the server request.body
 * @param {array} fields - array of fields to check for
 */
export function checkReqFields(body, fields) {
  for (let i = 0; i < fields.length; i += 1) {
    if (!body.includes(fields[i])) return i;
  }
  return -1;
}

/**
 * Helper function to check if two password matches
 * @param {string} password - the first password
 * @param {string} confirmPassword - the other password
 */
export function passwordMatch(req, res, next) {
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: 400,
      error: 'Password and confirm password does not match',
    });
  }
  next();
}

/**
 * Helper function to hash a password
 * @param {string} password - password to hash
 */
export function hashPassword(password) {
  if (!arguments) {
    throw new Error('Password must be define');
  }
  const salt = bcrypt.genSaltSync(6);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

/**
 * Helper function to compare a hash function
 * @param {string} password - the string password
 * @param {string} hash - the hashed password
 */
export function comparePassword(password, hash) {
  return (
    bcrypt.compareSync(password, hash)
  );
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
    number = (`000000${number}`).slice(-length);
  }
  return number;
}

/**
 * Helper function to help generate account Number
 * @param {string} type - type of account cuurent/string
 */
export function generateAccountNumber() {
  const rand1 = getRandomNumber(1, 10);
  const rand2 = padNumberLength(getRandomNumber(0, 10000), 4);
  const id = parseInt(`100${rand1}${unique.toString()}${rand2}`);
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
export function validateToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const token = authorizationHeader.split(' ')[1] || authorizationHeader;
    const options = {
      expiresIn: '2h',
      issuer: 'monday.lundii',
    };
    let secret;
    if (req.body && req.body.tokenSecret) {
      secret = req.body.tokenSecret;
    } else {
      secret = process.env.JWT_SECRET || 'yougofindmesoteyyougotire';
    }
    jwt.verify(token, secret, options, (er, payload) => {
      if (er) {
        return res.status(401).json({
          status: 401,
          error: 'Unauthorized access',
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
      error: 'Unauthorized access',
    });
  }
}

export function firstLetterUppercase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * Middleware to handle express-validator errors
 * @param {object} req - the req object
 * @param {object} res - the res object 
 * @param {function} next - the next middleware method
 */
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errMessage = errors.array().reduce((err, current) => `${err} ${firstLetterUppercase(current.param)} ${current.msg} | `, '');
    return res.status(400).json({
      status: 400,
      error: errMessage,
    });
  }
  next();
}
