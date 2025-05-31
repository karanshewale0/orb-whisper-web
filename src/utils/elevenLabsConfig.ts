
// ElevenLabs Agent Configuration
// In production, these should be stored securely via environment variables or configuration API

export const ELEVENLABS_AGENTS = {
  chat: import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID || 'demo-chat-agent',
  meeting: import.meta.env.VITE_ELEVENLABS_MEETING_AGENT_ID || 'demo-meeting-agent'
} as const;

export type AgentType = keyof typeof ELEVENLABS_AGENTS;

// Webhook configuration for text mode
export const TEXT_WEBHOOK_URL = import.meta.env.VITE_TEXT_WEBHOOK_URL || '/api/text-chat';

// Helper function to get agent ID
export const getAgentId = (type: AgentType): string => {
  return ELEVENLABS_AGENTS[type];
};

// Helper function to check if agent IDs are configured
export const isConfigured = (): boolean => {
  return Boolean(
    import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID && 
    import.meta.env.VITE_ELEVENLABS_MEETING_AGENT_ID
  );
};
