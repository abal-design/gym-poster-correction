const dotenv = require('dotenv');

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};

if (!env.MONGO_URI) {
  throw new Error('MONGO_URI is required in environment variables.');
}

if (!env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required in environment variables.');
}

module.exports = env;
