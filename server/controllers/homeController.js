import jwt from 'jsonwebtoken';
import path from 'path';
import {
  hashPassword,
  comparePassword,
} from '../util';
import config from '../config';
import Email from '../util/emailServices';

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
    this.getResetMail = this.getResetMail.bind(this);
    this.sendResetLink = this.sendResetLink.bind(this);
    this.sendResetForm = this.sendResetForm.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  /**
   * Method for handling signup route(POST api/v1/signup)
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  signup(req, res) {
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
        firstName: req.body.firstName.trim().toUpperCase(),
        lastName: req.body.lastName.trim().toUpperCase(),
        email: req.body.email,
        password: req.body.password,
        type: 'client',
        isAdmin: false,
        emailConfirmed: false,
        createdanaccount: false,
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
        Email.sendConfirmationEmail(dataR[0]);
        const data1 = {
          id: dataR[0].id,
          firstName: dataR[0].firstname,
          lastName: dataR[0].lastname,
          email: dataR[0].email,
          type: dataR[0].type,
          isAdmin: dataR[0].isadmin,
          token: dataR[0].token,
          message: 'Please, click on the link sent to your email for confirmation before creating an account number',
        };
        const response = {
          status: 200,
          data: data1,
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

      const resData = {
        id: result[0].id,
        firstName: result[0].firstname,
        lastName: result[0].lastname,
        email: result[0].email,
        token: result[0].token,
        type: result[0].type,
        isadmin: result[0].isadmin,
        createdanaccount: result[0].createdanaccount,
      };

      const response = {
        status: 200,
        data: resData,
      };
      return res.status(200).json(response);
    });
  }

  /**
   * Method for sending to input email for password reset
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  getResetMail(req, res) {
    res.status(200).sendFile(path.join(__dirname, '/files/userEmail.html'));
  }

  /**
   * Method for sending email reset link for password reset
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  sendResetLink(req, res) {
    this.store.userStore.read({ email: req.body.email }, (err, result) => {
      const payload = {
        email: req.body.email,
        password: result[0].password,
      };
      const secret = result[0].password + req.body.email;
      const token = jwt.sign(payload, secret, config.jwt_options);
      result[0].token = token;
      Email.sendResetLink(result[0], (err1, result1) => {
        if (err1) {
          return res.status(500).json({
            status: 500,
            error: 'there was an error sending your reset link, make sure you are connected to the internet. Please re-enter your mail and resend',
          });
        }
        res.status(200).sendFile(path.join(__dirname, '..', '/controllers/files/emailLink.html'));
      });
    });
  }

  /**
   * Method for sending password reset form
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  sendResetForm(req, res) {
    res.cookie('auth', req.params.token, { expires: new Date(Date.now() + 900000) });
    res.cookie('id', req.params.id, { expires: new Date(Date.now() + 900000) });
    res.status(200).sendFile(path.join(__dirname, '..', '/controllers/files/passwordResetForm.html'));
  }

  /**
   * Method for reseting the password
   * @param {object} req - the request object
   * @param {object} res  - the response object
   */
  resetPassword(req, res) {
    const hashPass = hashPassword(req.body.password);
    this.store.userStore.update({ id: req.cookies.id }, { password: hashPass }, (err, result) => {
      res.status(200).json({
        status: 200,
        message: 'password successfully changed',
      });
    });
  }
}

export default HomeController;
