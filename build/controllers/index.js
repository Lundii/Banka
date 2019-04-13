"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _homeController = _interopRequireDefault(require("./homeController"));

var _userController = _interopRequireDefault(require("./userController"));

var _staffController = _interopRequireDefault(require("./staffController"));

var _adminController = _interopRequireDefault(require("./adminController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  HomeController: _homeController["default"],
  UserController: _userController["default"],
  StaffController: _staffController["default"],
  AdminController: _adminController["default"]
};
exports["default"] = _default;