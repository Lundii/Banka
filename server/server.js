/* eslint-disable import/no-cycle */
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { debug } from 'debug';
import { Pool } from 'pg';
import config from './config';
import routes from './routes';
import storeLib from './models';

dotenv.config();
const app = express();
const serverlog = debug('server:');
const connectionString = process.env.CONNECTION_STRING;

const homeRouter = express.Router();
const userRouter = express.Router();
const staffRouter = express.Router();
const adminRouter = express.Router();


const pool = new Pool({
  connectionString,
});

export const store = {
  userStore: new storeLib.UserStore('users', pool),
  bankAcctStore: new storeLib.BankAcctStore('bankAccounts', pool),
  transactionStore: new storeLib.TransactionStore('transactions', pool),
};

function Init() {
  store.userStore.read({ email: config.development.adminAccount.email }, (err, result) => {
    if (result && !result.length) {
      store.userStore.create(config.development.adminAccount, (er, res) => {
        serverlog('adminCreated');
      });
    }
  });
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const homeRoute = new routes.HomeRoute(homeRouter, store);
const userRoute = new routes.UserRoute(userRouter, store);
const staffRoute = new routes.StaffRoute(staffRouter, store);
const adminRoute = new routes.AdminRoute(adminRouter, store);

app.use('/api/v1/', homeRoute.route());
app.use('/api/v1/user', userRoute.route());
app.use('/api/v1/staff', staffRoute.route());
app.use('/api/v1/admin', adminRoute.route());

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: 'The page you are looking for does not exit please check our your URL and try again',
  });
});

const { port } = config.development;
app.listen(port, (er) => {
  if (er) throw new Error('something is preventing the app from starting');
  serverlog(`app started on port ${port}`);
  Init();
});

export default app;
