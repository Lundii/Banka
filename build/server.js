"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.store = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _debug = require("debug");

var _pg = require("pg");

var _config = _interopRequireDefault(require("./config"));

var _routes = _interopRequireDefault(require("./routes"));

var _models = _interopRequireDefault(require("./models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable import/no-cycle */
_dotenv["default"].config();

var app = (0, _express["default"])();
var serverlog = (0, _debug.debug)('server:');
var connectionString = process.env.CONNECTION_STRING;

var homeRouter = _express["default"].Router();

var userRouter = _express["default"].Router();

var staffRouter = _express["default"].Router();

var adminRouter = _express["default"].Router();

var pool = new _pg.Pool({
  connectionString: connectionString
});
var store = {
  userStore: new _models["default"].UserStore('users', pool),
  bankAcctStore: new _models["default"].BankAcctStore('bankAccounts', pool),
  transactionStore: new _models["default"].TransactionStore('transactions', pool)
};
exports.store = store;
var StorageInfrastructure = new _models["default"].StorageInfrastructure(store);

function Init() {
  StorageInfrastructure.init();
}

app.use((0, _cookieParser["default"])());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(_bodyParser["default"].json());
app.use(_express["default"]["static"]('public'));
var homeRoute = new _routes["default"].HomeRoute(homeRouter, store);
var userRoute = new _routes["default"].UserRoute(userRouter, store);
var staffRoute = new _routes["default"].StaffRoute(staffRouter, store);
var adminRoute = new _routes["default"].AdminRoute(adminRouter, store);
app.use('/api/v1/', homeRoute.route());
app.use('/api/v1/user', userRoute.route());
app.use('/api/v1/staff', staffRoute.route());
app.use('/api/v1/admin', adminRoute.route());
app.use(function (req, res) {
  res.status(404).json({
    status: 404,
    error: 'URL does not exit please check our your URL and try again'
  });
});
var port = _config["default"].development.port;
app.listen(port, function (er) {
  if (er) throw new Error('something is preventing the app from starting');
  serverlog("app started on port ".concat(port));
  Init();
});
var _default = app;
exports["default"] = _default;