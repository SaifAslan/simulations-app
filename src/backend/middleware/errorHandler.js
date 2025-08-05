const errorHandler = (err, req, res, next) => {
  // Handle express-jwt UnauthorizedError
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid or missing token' });
  }

  // Log the error (could be enhanced with a logger like winston)
  console.error(err);

  // Set status code
  const statusCode = err.statusCode || 500;

  // In production, avoid leaking stack traces or internal details
  const response = {
    error: statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'An error occurred',
  };

  // Optionally include stack trace in development
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler; 