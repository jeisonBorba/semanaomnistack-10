const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.PORT,
    databaseUrl: process.env.MONGO_DATABASE_URL,
    databaseUser: process.env.MONGO_DATABASE_USER,
    databaseKey: process.env.MONGO_DATABASE_PASSWORD
  };