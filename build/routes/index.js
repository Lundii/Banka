"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _homeRoute = _interopRequireDefault(require("./homeRoute"));

var _userRoute = _interopRequireDefault(require("./userRoute"));

var _staffRoute = _interopRequireDefault(require("./staffRoute"));

var _adminRoute = _interopRequireDefault(require("./adminRoute"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  HomeRoute: _homeRoute["default"],
  UserRoute: _userRoute["default"],
  StaffRoute: _staffRoute["default"],
  AdminRoute: _adminRoute["default"]
};
exports["default"] = _default;