const groqService = require('./groq');
const logger = require('../utils/logger');

class ChatService {
  async generateResponse(message) {
    try {
      const response = await groqService.generateResponse(message);
      return response.content;
    } catch (error) {
      logger.error('Chat service error:', error);
      throw error;
    }
  }
}

module.exports = new ChatService();
