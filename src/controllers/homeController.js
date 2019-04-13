import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator/check';
import {
  checkReqFields,
  hashPassword,
  comparePassword,
} from '../util';
import config from '../config';

/**
 * Home route controller class
 * @class
 */
class HomeController {
  /**
   * Constructor for home route controller class
   * @constructor
   * @param {Store} store - the store class used for storing data
   */
  constructor(store) {
    this.store = store;
    this.signup = this.signup.bind(this);
    this.signin = this.signin.bind(this);
  }

  /**
   * Method for handling signup route(POST api/v1/signup)
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  signup(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        error: 'Please enter a valid email address',
      });
    }
    const reqFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
    const required = checkReqFields(Object.keys(req.body), reqFields);
    if (required >= 0) {
      return res.status(400).json({
        status: 400,
        error: `${reqFields[required]} is required`,
      });
    }
    const emailField = { email: req.body.email };
    this.store.userStore.read(emailField, (err, result) => {
      if (err) throw new Error('Error reading data');
      if (result && result.length) {
        return res.status(400).json({
          status: 400,
          error: 'Email already exits',
        });
      }
      const hashPass = hashPassword(req.body.password);
      req.body.password = hashPass;
      const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        type: 'client',
        isAdmin: 'false',
      };
      this.store.userStore.create(data, (er, dataR) => {
        if (er) throw new Error('Error creating file');
        const payload = {
          firstName: req.body.firstName,
          email: req.body.email,
        };
        const secret = process.env.JWT_SECRET || 'yougofindmesoteyyougotire';
        const token = jwt.sign(payload, secret, config.jwt_options);
        dataR[0].token = token;
        const response = {
          status: 200,
          data: dataR[0],
        };
        return res.status(200).json(response);
      });
    });
  }

  /**
   * Method for handling signin route(POST api/v1/auth/signin)
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  signin(req, res) {
    const reqFields = ['email', 'password'];
    const required = checkReqFields(Object.keys(req.body), reqFields);
    if (required >= 0) {
      return res.status(400).json({
        status: 400,
        error: `${reqFields[required]} is required`,
      });
    }
    const emailField = { email: req.body.email };
    this.store.userStore.read(emailField, (err, result) => {
      if (err) throw new Error('Error reading data');
      if (result && !result.length) {
        return res.status(403).json({
          status: 403,
          error: 'username or password is incorrect',
        });
      }
      const verifypassword = comparePassword(req.body.password, result[0].password);
      if (!verifypassword) {
        return res.status(403).json({
          status: 403,
          error: 'username or password is incorrect',
        });
      }
      const payload = {
        firstName: result[0].firstName,
        email: result[0].email,
      };
      const secret = process.env.JWT_SECRET || 'yougofindmesoteyyougotire';
      const token = jwt.sign(payload, secret, config.jwt_options);
      result[0].token = token;
      const response = {
        status: 200,
        data: result[0],
      };
      return res.status(200).json(response);
    });
  }
}

export default HomeController;
