
import { configService } from './configService';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class OpenAiService {
  private async getApiKey(): Promise<string> {
    const config = configService.getOpenAiConfig();
    if (!config.apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    return config.apiKey;
  }

  async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      const apiKey = await this.getApiKey();
      
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: 'You are Kiaan, a helpful AI assistant. Provide clear, concise, and helpful responses.'
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API request failed');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  async sendMessageWithFiles(message: string, files: File[] = [], conversationHistory: ChatMessage[] = []): Promise<string> {
    // For now, we'll process files by describing them and include in the message
    let enhancedMessage = message;
    
    if (files.length > 0) {
      const fileDescriptions = files.map(file => 
        `[File: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(1)}KB)]`
      ).join(', ');
      
      enhancedMessage = `${message}\n\nAttached files: ${fileDescriptions}`;
    }

    return this.sendMessage(enhancedMessage, conversationHistory);
  }
}

export const openAiService = new OpenAiService();
