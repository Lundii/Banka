import nodemailer from 'nodemailer';

class EmailServices {
  constructor() {
    this.transactionAlert = this.transactionAlert.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.getTransporter = this.getTransporter.bind(this);
  }

  createAccount(email) {
    const transporter = this.getTransporter();
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Account creation successful',
      html: `<div>
              <h3>Thank you for creatin an account an account with us</h3>
              <p>Your account number is 7898765678</p>
              <p>Your email is ${email}</p>
            </div>`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
      else console.log(`Email sent:${info.response}`);
    });
  }

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
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log(err);
      else console.log(`Email sent:${info.response}`);
    });
  }

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
}

const Email = new EmailServices();
export default Email;
