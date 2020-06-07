import path from 'path';

module.exports = {
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : '',
    database : 'next_level_app'
  },
  migrations: {
    directory: path.resolve(__dirname,'src', 'database', 'migrations')
  },
  seeds: {
    directory: path.resolve(__dirname,'src', 'database', 'seeds')
  }
};