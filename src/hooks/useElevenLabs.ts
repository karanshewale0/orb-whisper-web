
import { useConversation } from '@11labs/react';
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/components/voice-orb/types';

interface UseElevenLabsProps {
  agentId?: string;
  onMessage?: (message: Message) => void;
}

export const useElevenLabs = ({ agentId, onMessage }: UseElevenLabsProps = {}) => {
  const [isWaitingForMicPermission, setIsWaitingForMicPermission] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const conversation = useConversation({
    onMessage: (message) => {
      console.log('Received message:', message);
      
      if (message.source === 'assistant' || message.source === 'ai') {
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: message.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        onMessage?.(aiMessage);
      } else if (message.source === 'user') {
        if (message.is_final) {
          const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: message.message,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, userMessage]);
          onMessage?.(userMessage);
        }
      }
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to ElevenLabs API. Please check your configuration.",
        variant: "destructive"
      });
    },
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      toast({
        title: "Connected",
        description: "Successfully connected to ElevenLabs Conversational AI",
      });
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
    }
  });

  const startSession = useCallback(async () => {
    if (!agentId) {
      toast({
        title: "Configuration Error",
        description: "Agent ID is required. Please configure your ElevenLabs agent.",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsWaitingForMicPermission(true);
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      // Start the ElevenLabs session with agent ID
      await conversation.startSession({ 
        agentId
      });
      
      setIsWaitingForMicPermission(false);
      return true;
    } catch (error) {
      console.error('Error starting conversation:', error);
      setIsWaitingForMicPermission(false);
      
      if (error instanceof Error && error.name === 'NotAllowedError') {
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to use voice features.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to start voice conversation. Please try again.",
          variant: "destructive"
        });
      }
      return false;
    }
  }, [agentId, conversation, toast]);

  const endSession = useCallback(async () => {
    try {
      await conversation.endSession();
      setMessages([]);
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  }, [conversation]);

  const setVolume = useCallback(async (volume: number) => {
    try {
      await conversation.setVolume({ volume });
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  }, [conversation]);

  return {
    conversation,
    messages,
    setMessages,
    startSession,
    endSession,
    setVolume,
    isWaitingForMicPermission,
    status: conversation.status,
    isSpeaking: conversation.isSpeaking
  };
};
