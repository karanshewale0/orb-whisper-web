
export interface AppConfig {
  elevenLabsApiKey: string;
  chatAgentId: string;
  meetingAgentId: string;
  openAiApiKey: string;
  webhookUrl: string;
}

const CONFIG_KEY = 'kiaan-admin-config';

export const configService = {
  getConfig(): AppConfig | null {
    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading config:', error);
      return null;
    }
  },

  saveConfig(config: AppConfig): boolean {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  },

  getElevenLabsConfig() {
    const config = this.getConfig();
    return {
      apiKey: config?.elevenLabsApiKey || '',
      chatAgentId: config?.chatAgentId || 'agent_01jwdyky9pe9erp7thp0qrt30v',
      meetingAgentId: config?.meetingAgentId || 'agent_01jwdyky9pe9erp7thp0qrt30v'
    };
  },

  getOpenAiConfig() {
    const config = this.getConfig();
    return {
      apiKey: config?.openAiApiKey || '',
      webhookUrl: config?.webhookUrl || ''
    };
  },

  hasValidElevenLabsConfig(): boolean {
    const config = this.getElevenLabsConfig();
    return !!(config.apiKey && config.chatAgentId && config.meetingAgentId);
  },

  hasValidOpenAiConfig(): boolean {
    const config = this.getOpenAiConfig();
    return !!(config.apiKey || config.webhookUrl);
  }
};
