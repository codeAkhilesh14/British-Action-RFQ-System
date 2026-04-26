const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Mongoose duplicate error
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    err.message = message;
    err.statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = `Invalid token`;
    err.message = message;
    err.statusCode = 400;
  }

  if (err.name === "TokenExpiredError") {
    const message = `Token has expired`;
    err.message = message;
    err.statusCode = 400;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;
