
import React, { useEffect } from 'react';
import { Video, Users, Phone, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useElevenLabs } from '@/hooks/useElevenLabs';
import { getAgentId } from '@/utils/elevenLabsConfig';
import { Message } from './types';

interface MeetingModeProps {
  messages?: Message[];
  onMessagesUpdate?: (messages: Message[]) => void;
}

export const MeetingMode: React.FC<MeetingModeProps> = ({
  messages = [],
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
    agentId: getAgentId('meeting'),
    onMessage: (message) => {
      onMessagesUpdate?.([...messages, message]);
    }
  });

  // Sync ElevenLabs messages with parent component
  useEffect(() => {
    if (elevenLabsMessages.length > 0 && onMessagesUpdate) {
      onMessagesUpdate(elevenLabsMessages);
    }
  }, [elevenLabsMessages, onMessagesUpdate]);

  const handleToggleSession = async () => {
    if (status === 'connected') {
      await endSession();
    } else {
      await startSession();
    }
  };

  const isConnected = status === 'connected';

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${
          isConnected 
            ? 'from-green-400 to-green-600' 
            : 'from-green-100 to-green-200'
        } flex items-center justify-center mb-4`}>
          {isWaitingForMicPermission ? (
            <div className="w-6 h-6 border-2 border-white rounded-full animate-spin border-t-transparent" />
          ) : (
            <Video className={`w-8 h-8 ${isConnected ? 'text-white' : 'text-green-600'}`} />
          )}
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="text-gray-800 text-lg font-medium">Meeting Assistant</h3>
          {isConnected && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              Active
            </Badge>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4">
          {isConnected 
            ? 'AI meeting assistant is listening and ready to help'
            : 'AI-powered meeting assistant with transcription and action items'
          }
        </p>

        {isSpeaking && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex space-x-1">
              <div className="w-2 h-4 bg-green-500 rounded animate-pulse"></div>
              <div className="w-2 h-3 bg-green-500 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-5 bg-green-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-green-600">AI is speaking...</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={handleToggleSession}
          disabled={isWaitingForMicPermission}
          className={`w-full ${
            isConnected 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
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
              End Meeting Session
            </>
          ) : (
            <>
              <Phone className="w-4 h-4 mr-2" />
              Start Meeting Session
            </>
          )}
        </Button>
        
        {!isConnected && (
          <Button 
            variant="outline" 
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled
          >
            <Users className="w-4 h-4 mr-2" />
            Join Existing Meeting (Coming Soon)
          </Button>
        )}
      </div>
      
      {/* Meeting Features Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Meeting Features:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Real-time transcription</li>
          <li>• Automatic action item detection</li>
          <li>• Meeting summary generation</li>
          <li>• Speaker identification</li>
        </ul>
      </div>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="mt-6 space-y-3 max-h-32 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-800">Conversation:</h4>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-2 rounded text-xs ${
                message.type === 'user'
                  ? 'bg-green-100 ml-4 text-gray-800'
                  : 'bg-blue-100 mr-4 text-gray-800'
              }`}
            >
              <p>{message.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
