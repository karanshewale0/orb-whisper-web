
import React from 'react';
import { MessageCircle, Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message } from './types';

interface TextModeProps {
  messages: Message[];
  textInput: string;
  onTextInputChange: (value: string) => void;
  onSendMessage: () => void;
  onFileUpload: () => void;
}

export const TextMode: React.FC<TextModeProps> = ({
  messages,
  textInput,
  onTextInputChange,
  onSendMessage,
  onFileUpload
}) => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex-1 space-y-4">
        {/* Messages */}
        <div className="h-48 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-12">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Start typing to begin conversation</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-100 ml-4 text-gray-800'
                    : 'bg-gray-100 mr-4 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="flex items-center space-x-2 mt-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onFileUpload}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            value={textInput}
            onChange={(e) => onTextInputChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-white border-gray-300 text-gray-800 placeholder-gray-500"
          />
          <Button
            onClick={onSendMessage}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
