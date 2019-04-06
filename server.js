import express from 'express';
import bodyParser from 'body-parser';
import { debug } from 'debug';
import config from './config';
import routes from './src/routes';

const app = express();
const homeRouter = express.Router();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const serverlog = debug('server:');
const homeRoute = new routes.HomeRoute(homeRouter);

app.use('/', homeRoute.route());

const { port } = config.development;
app.listen(port, (er) => {
  if (er) throw new Error('something is preventing the app from starting');
  serverlog(`app started on port ${port}`);
});
