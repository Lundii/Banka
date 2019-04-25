import nodemailer from 'nodemailer';

/**
 * Class for creating email services
 * @class
 */
class EmailServices {
  /**
   * Constructor for creating a new class
   * @constructor
   */
  constructor() {
    this.transactionAlert = this.transactionAlert.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.getTransporter = this.getTransporter.bind(this);
    this.sendMail = this.sendMail.bind(this);
  }

  /**
   * Method for sending mail on account creation
   * @param {object} email - the user's email
   */
  createAccount(user) {
    const transporter = this.getTransporter();
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Account creation successful',
      html: ` <style>
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                th {
                  background-color: rgb(18, 18, 107);
                  color: white;
                }
                td, th {
                  text-align: center;
                  padding: 8px;
                }
                .even {
                  background-color: rgb(222, 222, 233);;
                }
             </style>
              <div>
               <table>
                  <tr>
                    <th colspan="2">ACCOUNT DETAILS</th>
                  </tr>
                 <tr class="even">
                   <td>FirstName:</td>
                   <td>${user.firstName}</td>
                 </tr>
                 <tr>
                   <td>LastName:</td>
                   <td>${user.lastName}</td>
                 </tr>
                 <tr class="even">
                   <td>AccountNumber</td>
                   <td>${user.accountnumber}</td>
                 </tr>
                 <tr>
                  <td>Email:</td>
                  <td>${user.email}</td>
                 </tr>
               </table>
             </div>`,
    };
    this.sendMail(transporter, mailOptions);
  }

  /**
   * Method for sending credit or debit alert
   * @param {string} email - the recepient email
   * @param {object} transaction - the transaction object
   */
  transactionAlert(email, transaction) {
    const transporter = this.getTransporter();
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `Banka Alert on your account [${transaction.type.toUpperCase()}]`,
      html: ` <style>
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                th {
                  background-color: rgb(18, 18, 107);
                  color: white;
                }
                td, th {
                  text-align: center;
                  padding: 8px;
                }
                .even {
                  background-color: rgb(222, 222, 233);;
                }
             </style>
              <div>
               <table>
                  <tr>
                    <th colspan="2">TRANSACTION DETAILS</th>
                  </tr>
                 <tr class="even">
                   <td>Account Number:</td>
                   <td>${transaction.accountnumber}</td>
                 </tr>
                 <tr>
                   <td>Amount:</td>
                   <td>&#x20A6 ${transaction.amount}</td>
                 </tr>
                 <tr class="even">
                   <td>Transaction type:</td>
                   <td>${transaction.type.toUpperCase()}</td>
                 </tr>
                 <tr>
                  <td>Transaction date:</td>
                  <td>${transaction.createdon}</td>
                 </tr>
                 <tr class="even">
                  <td>Previous Balance:</td>
                  <td>&#x20A6 ${transaction.oldbalance}</td>
                </tr>
                 <tr>
                  <td>New Balance:</td>
                  <td>&#x20A6 ${transaction.newbalance}</td>
                </tr>
               </table>
            </div>`,
    };
    this.sendMail(transporter, mailOptions);
  }

  /**
   * Method for sending password reset link to the user
   * @param {object} user - the user object
   * @param {function} callback - the callback function
   * @returns - the callback function
   */
  sendResetLink(user, callback) {
    const transporter = this.getTransporter();
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Password Reset Link',
      html: `<div>
              <h3>Please, click on the link below to reset your password</h3>
              <a href="https://mighty-retreat-71326.herokuapp.com/api/v1/passwordreset_form/${user.id}/${user.token}">password reset link</a>
            </div>`,
    };
    this.sendMail(transporter, mailOptions, callback);
  }

  /**
   * For geeting nodemailer transporter object
   * @private
   * @returns - the transporter object
   */
  getTransporter() {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    return transporter;
  }

  /**
   * private method for sending email
   * @private
   * @param {object} transporter - the transporter object
   * @param {object} mailOptions - the nodemail mailOptions object
   * @param {function} callback - a callback function
   */
  sendMail(transporter, mailOptions, callback) {
    if (callback) {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) callback(err);
        else callback(null, `Email sent:${info.response}`);
      });
    } else {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err);
        else console.log(`Email sent:${info.response}`);
      });
    }
  }
}

const Email = new EmailServices();
export default Email;
