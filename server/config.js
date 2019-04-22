import { hashPassword } from './util';

const config = {
  development: {
    port: process.env.PORT || 3000,
    adminAccount: {
      firstName: 'Admin',
      lastName: 'SeniorMan',
      email: 'admin@vipmail.com',
      password: hashPassword('vippassword'),
      type: 'staff',
      isAdmin: true,
    },
  },
  jwt_options: {
    expiresIn: '2h',
    issuer: 'monday.lundii',
  },
};
export default config;
