import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { debug } from 'debug';
import config from './config';
import routes from './routes';
import DB from './database/database';
import storeLib from './models';

const app = express();
dotenv.config();
const homeRouter = express.Router();
const userRouter = express.Router();
const staffRouter = express.Router();
const adminRouter = express.Router();

const database = new DB('bankaApp');
export const store = {
  bankAcctStore: new storeLib.BankAcctStore('Bank Accounts', database),
  userStore: new storeLib.UserStore('Users', database),
  transactionStore: new storeLib.TransactionStore('Transactions', database)
};

const StorageInfrastructure = new storeLib.StorageInfrastructure(store);

function Init() {
  StorageInfrastructure.init();
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const serverlog = debug('server:');
const homeRoute = new routes.HomeRoute(homeRouter, store);
const userRoute = new routes.UserRoute(userRouter, store);
const staffRoute = new routes.StaffRoute(staffRouter, store);
const adminRoute = new routes.AdminRoute(adminRouter, store);

app.use('/api/v1/', homeRoute.route());
app.use('/api/v1/user', userRoute.route());
app.use('/api/v1/staff', staffRoute.route());
app.use('/api/v1/admin', adminRoute.route());

const { port } = config.development;
app.listen(port, (er) => {
  if (er) throw new Error('something is preventing the app from starting');
  serverlog(`app started on port ${port}`);
  Init();
});

export default app;
