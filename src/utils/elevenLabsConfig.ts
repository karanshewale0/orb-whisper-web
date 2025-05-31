
// ElevenLabs Agent Configuration
// These agent IDs should be set via environment variables in production
// For development, you can set them in your .env file as:
// VITE_ELEVENLABS_CHAT_AGENT_ID=your_chat_agent_id_here
// VITE_ELEVENLABS_MEETING_AGENT_ID=your_meeting_agent_id_here

// Default agent IDs - replace these with your actual ElevenLabs agent IDs
const DEFAULT_CHAT_AGENT_ID = 'agent_01jwdyky9pe9erp7thp0qrt30v';
const DEFAULT_MEETING_AGENT_ID = 'agent_01jwdyky9pe9erp7thp0qrt30v';

export const ELEVENLABS_AGENTS = {
  chat: import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID || DEFAULT_CHAT_AGENT_ID,
  meeting: import.meta.env.VITE_ELEVENLABS_MEETING_AGENT_ID || DEFAULT_MEETING_AGENT_ID
} as const;

export type AgentType = 'chat' | 'meeting';

// Webhook configuration for text mode
export const TEXT_WEBHOOK_URL = import.meta.env.VITE_TEXT_WEBHOOK_URL || '/api/text-chat';

// Helper function to get agent ID
export const getAgentId = (agentType: AgentType): string => {
  return ELEVENLABS_AGENTS[agentType];
};

// Helper function to check if agent IDs are configured (not using defaults)
export const isConfigured = (): boolean => {
  const chatId = ELEVENLABS_AGENTS.chat;
  const meetingId = ELEVENLABS_AGENTS.meeting;
  return chatId !== DEFAULT_CHAT_AGENT_ID && meetingId !== DEFAULT_MEETING_AGENT_ID;
};

// Helper function to get configuration status
export const getConfigStatus = () => {
  return {
    chat: {
      hasEnvVar: Boolean(import.meta.env.VITE_ELEVENLABS_CHAT_AGENT_ID),
      current: ELEVENLABS_AGENTS.chat,
      isDefault: ELEVENLABS_AGENTS.chat === DEFAULT_CHAT_AGENT_ID
    },
    meeting: {
      hasEnvVar: Boolean(import.meta.env.VITE_ELEVENLABS_MEETING_AGENT_ID),
      current: ELEVENLABS_AGENTS.meeting,
      isDefault: ELEVENLABS_AGENTS.meeting === DEFAULT_MEETING_AGENT_ID
    }
  };
};
