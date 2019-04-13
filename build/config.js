"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var config = {
  development: {
    port: process.env.PORT || 3000
  },
  jwt_options: {
    expiresIn: '2h',
    issuer: 'monday.lundii'
  }
};
var _default = config;
exports["default"] = _default;