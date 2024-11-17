const chatService = require('../services/chat');
const { AppError } = require('../utils/errors');

const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const response = await chatService.generateResponse(message);
    
    res.status(200).json({
      status: 'success',
      data: {
        message: {
          text: response,
          sender: 'ai'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage };