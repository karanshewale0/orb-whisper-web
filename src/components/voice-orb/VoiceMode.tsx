
import React, { useEffect } from 'react';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useElevenLabs } from '@/hooks/useElevenLabs';
import { getAgentId } from '@/utils/elevenLabsConfig';
import { Message } from './types';

interface VoiceModeProps {
  isRecording: boolean;
  messages: Message[];
  onToggleRecording: () => void;
  onMessagesUpdate: (messages: Message[]) => void;
}

export const VoiceMode: React.FC<VoiceModeProps> = ({
  isRecording,
  messages,
  onToggleRecording,
  onMessagesUpdate
}) => {
  const {
    startSession,
    endSession,
    status,
    isSpeaking,
    isWaitingForMicPermission,
    messages: elevenLabsMessages
  } = useElevenLabs({
    agentId: getAgentId('chat'),
    onMessage: (message) => {
      onMessagesUpdate([...messages, message]);
    }
  });

  // Sync ElevenLabs messages with parent component
  useEffect(() => {
    if (elevenLabsMessages.length > 0) {
      onMessagesUpdate(elevenLabsMessages);
    }
  }, [elevenLabsMessages, onMessagesUpdate]);

  const handleToggleSession = async () => {
    if (status === 'connected') {
      await endSession();
    } else {
      await startSession();
    }
    onToggleRecording();
  };

  const isConnected = status === 'connected';

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${
          isConnected 
            ? isSpeaking 
              ? 'from-green-400 to-green-600 animate-pulse' 
              : 'from-blue-400 to-blue-600'
            : 'from-gray-400 to-gray-600'
        } flex items-center justify-center mb-4`}>
          {isWaitingForMicPermission ? (
            <div className="w-6 h-6 border-2 border-white rounded-full animate-spin border-t-transparent" />
          ) : isConnected ? (
            isSpeaking ? (
              <div className="flex space-x-1">
                <div className="w-2 h-8 bg-white rounded animate-pulse"></div>
                <div className="w-2 h-6 bg-white rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-10 bg-white rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )
          ) : (
            <MicOff className="w-12 h-12 text-white" />
          )}
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <p className="text-gray-800 text-lg font-medium">
            {isWaitingForMicPermission 
              ? 'Requesting microphone access...'
              : isConnected 
                ? isSpeaking 
                  ? 'AI is speaking...' 
                  : 'Ready to listen'
                : 'Tap to start conversation'
            }
          </p>
          {isConnected && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              Connected
            </Badge>
          )}
        </div>
        
        <p className="text-gray-600 text-sm">
          {isConnected 
            ? 'Powered by ElevenLabs Conversational AI'
            : 'Connect to start a natural voice conversation'
          }
        </p>
      </div>
      
      <Button
        onClick={handleToggleSession}
        disabled={isWaitingForMicPermission}
        className={`w-full h-12 ${
          isConnected 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
        }`}
      >
        {isWaitingForMicPermission ? (
          <>
            <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent mr-2" />
            Connecting...
          </>
        ) : isConnected ? (
          <>
            <PhoneOff className="w-4 h-4 mr-2" />
            End Conversation
          </>
        ) : (
          <>
            <Phone className="w-4 h-4 mr-2" />
            Start Conversation
          </>
        )}
      </Button>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="mt-6 space-y-3 max-h-40 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-purple-100 ml-4 text-gray-800'
                  : 'bg-blue-100 mr-4 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
