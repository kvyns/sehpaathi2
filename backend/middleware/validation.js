const { AppError } = require('../utils/errors');

const validateMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return next(new AppError('Invalid message format', 400));
  }

  if (message.length > 1000) {
    return next(new AppError('Message exceeds maximum length of 1000 characters', 400));
  }

  req.body.message = message.trim();
  next();
};

module.exports = { validateMessage };
