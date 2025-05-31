
// ElevenLabs Agent Configuration
// In production, these should be stored securely via environment variables or configuration API

export const ELEVENLABS_AGENTS = {
  chat: import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID || getStoredAgentId('chat') || 'demo-chat-agent',
  meeting: import.meta.env.VITE_ELEVENLABS_MEETING_AGENT_ID || getStoredAgentId('meeting') || 'demo-meeting-agent'
} as const;

export type AgentType = keyof typeof ELEVENLABS_AGENTS;

// Webhook configuration for text mode
export const TEXT_WEBHOOK_URL = import.meta.env.VITE_TEXT_WEBHOOK_URL || '/api/text-chat';

// Helper function to get stored agent ID from localStorage
function getStoredAgentId(type: AgentType): string | null {
  try {
    return localStorage.getItem(`elevenlabs_${type}_agent_id`);
  } catch {
    return null;
  }
}

// Helper function to store agent ID in localStorage
export const setAgentId = (type: AgentType, agentId: string): void => {
  try {
    localStorage.setItem(`elevenlabs_${type}_agent_id`, agentId);
  } catch (error) {
    console.error('Failed to store agent ID:', error);
  }
};

// Helper function to get agent ID (with dynamic lookup)
export const getAgentId = (type: AgentType): string => {
  return import.meta.env[`VITE_ELEVENLABS_${type.toUpperCase()}_AGENT_ID`] || 
         getStoredAgentId(type) || 
         ELEVENLABS_AGENTS[type];
};

// Helper function to check if agent IDs are configured
export const isConfigured = (): boolean => {
  const chatId = getAgentId('chat');
  const meetingId = getAgentId('meeting');
  return Boolean(chatId && chatId !== 'demo-chat-agent' && meetingId && meetingId !== 'demo-meeting-agent');
};

// Helper function to get all configuration status
export const getConfigStatus = () => {
  return {
    chat: {
      hasEnvVar: Boolean(import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID),
      hasStored: Boolean(getStoredAgentId('chat')),
      current: getAgentId('chat'),
      isDemo: getAgentId('chat') === 'demo-chat-agent'
    },
    meeting: {
      hasEnvVar: Boolean(import.meta.env.VITE_ELEVENLABS_MEETING_AGENT_ID),
      hasStored: Boolean(getStoredAgentId('meeting')),
      current: getAgentId('meeting'),
      isDemo: getAgentId('meeting') === 'demo-meeting-agent'
    }
  };
};
