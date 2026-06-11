const Groq = require('groq-sdk');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');
require('dotenv').config();

class GroqService {  constructor() {
    if (!GroqService.instance) {
      if (!process.env.GROQ_API_KEY) {
        throw new AppError('GROQ_API_KEY environment variable is not set', 500);
      }
      
      this.client = new Groq({
        apiKey: process.env.GROQ_API_KEY 
      });
      this.conversationHistory = [];
      this.maxHistoryLength = 1000;
      GroqService.instance = this;
    }
    return GroqService.instance;
  }

  addToHistory(message) {
    this.conversationHistory.push(message);
    
    // Remove oldest messages if history exceeds maximum length
    if (this.conversationHistory.length > this.maxHistoryLength) {
      const itemsToRemove = this.conversationHistory.length - this.maxHistoryLength;
      this.conversationHistory.splice(0, itemsToRemove);
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
  async generateResponse(message, retryCount = 0) {
    const maxRetries = 3;
    const systemPrompt = `You are Sehpaathi, an AI study assistant customised as per your college, developed by a team of passionate developers. Remember to:

    - Structure responses with clear headings using # and ## for main points
    - Use **bold** for key concepts and *italic* for emphasis
    - Include relevant emojis to make explanations engaging
    - Format code examples with proper syntax highlighting using \`\`\`language
    - Use bullet points and numbered lists for step-by-step explanations
    - Add blockquotes for important notes or definitions
    - Keep explanations clear and concise with student-friendly language
    - Provide relatable examples from engineering contexts
    - End responses with encouraging messages or next steps

    Maintain a friendly, supportive tone while delivering accurate technical information.`;

    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory,
        { role: 'user', content: message }
      ];

      logger.info('Sending request to Groq API');
      logger.debug('Complete message history:', messages);

      const completion = await this.client.chat.completions.create({
        messages: messages,
        model: process.env.GROQ_MODEL || 'mixtral-8x7b-32768',
        temperature: 0.3,
        max_tokens: 1024
      });

      const responseMessage = completion.choices[0].message;

      this.addToHistory({ role: 'user', content: message });
      this.addToHistory({ role: 'assistant', content: responseMessage.content });

      return responseMessage;
    } catch (error) {
      logger.error('Groq API error:', error.message);
      logger.error('Error status:', error.status);
      logger.error('Error code:', error.code);

      // Log detailed error information
      if (error.response) {
        logger.error('API response status:', error.response.status);
        logger.error('API response data:', error.response.data);
      }
      if (error.request) {
        logger.error('Request failed - no response received');
      }

      // Handle specific error types
      if (error.message.includes('API key') || error.message.includes('Incorrect')) {
        throw new AppError('Invalid or missing GROQ API key. Please check your configuration.', 401);
      }

      if (error.message.includes('rate limit') || error.message.includes('Rate limit')) {
        throw new AppError('API rate limit exceeded. Please try again in a few moments.', 429);
      }

      if (error.message.includes('quota') || error.message.includes('Quota')) {
        throw new AppError('API quota exceeded. Please check your Groq account.', 403);
      }

      // Retry logic for transient errors (503, 502, 429)
      const statusCode = error.status || error.response?.status;
      if ((statusCode === 503 || statusCode === 502 || statusCode === 429) && retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        logger.info(`Retrying request (attempt ${retryCount + 1}/${maxRetries}) after ${delay}ms`);

        await new Promise(resolve => setTimeout(resolve, delay));
        return this.generateResponse(message, retryCount + 1);
      }

      // Provide user-friendly error messages
      if (statusCode === 503 || statusCode === 502) {
        throw new AppError('Groq service is temporarily unavailable. Please try again in a moment.', 503);
      }

      throw new AppError('Failed to generate response due to an API error. Please try again.', 503);
    }
  }
}

module.exports = new GroqService();