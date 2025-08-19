
export const cfg = {
  port: 3000,
  jwtSecret: 'dev-secret-change-me',
  jwtExpires: '1h',
  isProd: false,
  db: {
    host: 'localhost',
    port: 5432,
    user: 'user',
    password: 'pass',
    database: 'usersdb',
  },
};
