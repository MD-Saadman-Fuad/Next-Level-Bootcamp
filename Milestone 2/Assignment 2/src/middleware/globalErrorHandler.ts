import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  
  // Format errors depending on type
  let errors = err.errors || null;
  if (!errors && err.stack && process.env.NODE_ENV !== 'production') {
    errors = err.stack;
  } else if (!errors && err.message) {
    errors = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export default globalErrorHandler;
