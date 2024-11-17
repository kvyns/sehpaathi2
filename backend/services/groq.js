const Groq = require('groq-sdk');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');
require('dotenv').config();

class GroqService {
  constructor() {
    if (!GroqService.instance) {
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

  async generateResponse(message) {
    const systemPrompt =`You are Sehpaathi, an AI study assistant at MITS Gwalior, developed by a team of developers at MITS. Remember to:

    - Structure responses with clear headings using # and ## for main points
    - Use **bold** for key concepts and *italic* for emphasis
    - Include relevant emojis to make explanations engaging
    - Format code examples with proper syntax highlighting using \`\`\`language
    - Use bullet points and numbered lists for step-by-step explanations
    - Add blockquotes for important notes or definitions
    - Keep explanations clear and concise with student-friendly language
    - Provide relatable examples from engineering contexts
    - End responses with encouraging messages or next steps
    
    Maintain a friendly, supportive tone while delivering accurate technical information.`;;

    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory,
        { role: 'user', content: message }
      ];

      // Log the request payload for debugging
      logger.info('Sending request to Groq API');
      logger.debug('Complete message history:', messages);

      const completion = await this.client.chat.completions.create({
        messages: messages,
        model: 'mixtral-8x7b-32768',
        temperature: 0.3,
        max_tokens: 1024
      });

      const responseMessage = completion.choices[0].message;
      
      this.addToHistory({ role: 'user', content: message });
      this.addToHistory({ role: 'assistant', content: responseMessage.content });

      return responseMessage;
    } catch (error) {
      logger.error('Groq API error:', error.message);
      if (error.response) {
        logger.error('Groq API response data:', error.response.data);
      }
      throw new AppError('Failed to generate response due to an API error', 503);
    }
  }
}

module.exports = new GroqService();