const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      status: err.status || 'error',
      message: err.message,
      stack: err.stack,
    });
  }

  return res.status(statusCode).json({
    status: err.status || 'error',
    message: err.isOperational ? err.message : 'Something went wrong',
  });
};

module.exports = errorHandler;
