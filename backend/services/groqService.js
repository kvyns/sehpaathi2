const Groq = require('groq-sdk');
const config = require('../config');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

class GroqService {
  constructor() {
    if (!GroqService.instance) {
      this.client = new Groq({
        apiKey: config.groq.apiKey
      });
      GroqService.instance = this;
    }
    return GroqService.instance;
  }

  async generateResponse(message) {
    const systemPrompt = `You are Sehpaathi, an AI study assistant. Help students learn and understand their subjects better. 
    Be concise, clear, and encouraging in your responses. Focus on explaining concepts in a way that's easy to understand.`;

    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        model: config.groq.model,
        temperature: config.groq.temperature,
        max_tokens: config.groq.maxTokens
      });

      return completion.choices[0].message;
    } catch (error) {
      logger.error('Groq API error:', error);
      throw new AppError('Failed to generate response', 503);
    }
  }
}

module.exports = new GroqService();