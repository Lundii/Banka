"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.store = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _debug = require("debug");

var _config = _interopRequireDefault(require("./config"));

var _routes = _interopRequireDefault(require("./routes"));

var _database = _interopRequireDefault(require("./database/database"));

var _models = _interopRequireDefault(require("./models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();

_dotenv["default"].config();

var homeRouter = _express["default"].Router();

var userRouter = _express["default"].Router();

var staffRouter = _express["default"].Router();

var adminRouter = _express["default"].Router();

var database = new _database["default"]('bankaApp');
var store = {
  bankAcctStore: new _models["default"].BankAcctStore('Bank Accounts', database),
  userStore: new _models["default"].UserStore('Users', database),
  transactionStore: new _models["default"].TransactionStore('Transactions', database)
};
exports.store = store;
var StorageInfrastructure = new _models["default"].StorageInfrastructure(store);

function Init() {
  StorageInfrastructure.init();
}

app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(_bodyParser["default"].json());
app.use(_express["default"]["static"]('public'));
var serverlog = (0, _debug.debug)('server:');
var homeRoute = new _routes["default"].HomeRoute(homeRouter, store);
var userRoute = new _routes["default"].UserRoute(userRouter, store);
var staffRoute = new _routes["default"].StaffRoute(staffRouter, store);
var adminRoute = new _routes["default"].AdminRoute(adminRouter, store);
app.use('/api/v1/', homeRoute.route());
app.use('/api/v1/user', userRoute.route());
app.use('/api/v1/staff', staffRoute.route());
app.use('/api/v1/admin', adminRoute.route());
var port = _config["default"].development.port;
app.listen(port, function (er) {
  if (er) throw new Error('something is preventing the app from starting');
  serverlog("app started on port ".concat(port));
  Init();
});
var _default = app;
exports["default"] = _default;