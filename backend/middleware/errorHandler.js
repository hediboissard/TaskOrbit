const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Erreur :', err);
  }

  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.message || 'Erreur serveur',
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
