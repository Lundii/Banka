"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = require("./util");

var config = {
  development: {
    port: process.env.PORT || 3000,
    adminAccount: {
      firstName: 'Admin',
      lastName: 'SeniorMan',
      email: 'admin@vipmail.com',
      password: (0, _util.hashPassword)('vippassword'),
      type: 'staff',
      isAdmin: true
    },
    staffAccount: {
      firstName: 'Staff',
      lastName: 'BigMan',
      email: 'staff@vipmail.com',
      password: (0, _util.hashPassword)('vippassword'),
      type: 'staff',
      isAdmin: false
    }
  },
  jwt_options: {
    expiresIn: '2h',
    issuer: 'monday.lundii'
  }
};
var _default = config;
exports["default"] = _default;