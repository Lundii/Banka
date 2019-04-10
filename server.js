import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { debug } from 'debug';
import config from './config';
import routes from './src/routes';
import DB from './src/database/database';
import storeLib from './src/models';

const app = express();
dotenv.config();
const homeRouter = express.Router();

const database = new DB('bankaApp');
const store = {
  bankAcctStore: new storeLib.BankAcctStore('Bank Accounts', database),
  userStore: new storeLib.UserStore('Users', database),
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

app.use('/api/v1/', homeRoute.route());

const { port } = config.development;
app.listen(port, (er) => {
  if (er) throw new Error('something is preventing the app from starting');
  serverlog(`app started on port ${port}`);
  Init();
});

export default app;
