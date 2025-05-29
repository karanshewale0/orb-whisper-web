
import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from './types';

interface VoiceModeProps {
  isRecording: boolean;
  messages: Message[];
  onToggleRecording: () => void;
}

export const VoiceMode: React.FC<VoiceModeProps> = ({
  isRecording,
  messages,
  onToggleRecording
}) => {
  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${isRecording ? 'from-red-400 to-red-600' : 'from-purple-400 to-blue-600'} flex items-center justify-center mb-4 ${isRecording ? 'animate-pulse' : ''}`}>
          {isRecording ? (
            <MicOff className="w-12 h-12 text-white" />
          ) : (
            <Mic className="w-12 h-12 text-white" />
          )}
        </div>
        <p className="text-gray-800 text-lg font-medium">
          {isRecording ? 'Listening...' : 'Tap to speak'}
        </p>
        <p className="text-gray-600 text-sm">
          {isRecording ? 'Say something or tap again to stop' : 'Start a voice conversation with AI'}
        </p>
      </div>
      
      <Button
        onClick={onToggleRecording}
        className={`w-full h-12 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'}`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
