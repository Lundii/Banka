const config = {
  development: {
    port: process.env.PORT || 3000,
  },
  jwt_options: {
    expiresIn: '2h',
    issuer: 'monday.lundii',
  },
};
export default config;
