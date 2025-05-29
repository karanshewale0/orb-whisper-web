
import React from 'react';
import { Mic, MessageCircle, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Mode } from './types';

interface ModeSelectionProps {
  onSelectMode: (mode: Mode) => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode }) => {
  return (
    <div className="p-6 space-y-4">
      <h3 className="text-gray-800 text-lg font-medium text-center mb-6">
        Choose Interaction Mode
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        <Button
          onClick={() => onSelectMode('voice')}
          className="h-16 bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-300 hover:from-purple-200 hover:to-purple-300 text-gray-800 justify-start"
        >
          <Mic className="w-6 h-6 mr-3 text-purple-600" />
          <div className="text-left">
            <div className="font-medium">Voice Chat</div>
            <div className="text-sm text-gray-600">Natural conversation with AI</div>
          </div>
        </Button>
        
        <Button
          onClick={() => onSelectMode('text')}
          className="h-16 bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 hover:from-blue-200 hover:to-blue-300 text-gray-800 justify-start"
        >
          <MessageCircle className="w-6 h-6 mr-3 text-blue-600" />
          <div className="text-left">
            <div className="font-medium">Text Chat</div>
            <div className="text-sm text-gray-600">Type messages and attach files</div>
          </div>
        </Button>
        
        <Button
          onClick={() => onSelectMode('meeting')}
          className="h-16 bg-gradient-to-r from-green-100 to-green-200 border border-green-300 hover:from-green-200 hover:to-green-300 text-gray-800 justify-start"
        >
          <Video className="w-6 h-6 mr-3 text-green-600" />
          <div className="text-left">
            <div className="font-medium">Meeting Mode</div>
            <div className="text-sm text-gray-600">AI assistant for meetings</div>
          </div>
        </Button>
      </div>
    </div>
  );
};
