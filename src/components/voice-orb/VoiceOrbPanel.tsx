
import React from 'react';
import { Mic, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModeSelection } from './ModeSelection';
import { VoiceMode } from './VoiceMode';
import { TextMode } from './TextMode';
import { MeetingMode } from './MeetingMode';
import { panelStyles } from './styles';
import { Mode, Message } from './types';

interface VoiceOrbPanelProps {
  mode: Mode;
  isConnected: boolean;
  isRecording: boolean;
  messages: Message[];
  textInput: string;
  onClose: () => void;
  onSelectMode: (mode: Mode) => void;
  onBackToModes: () => void;
  onToggleRecording: () => void;
  onTextInputChange: (value: string) => void;
  onSendMessage: () => void;
  onFileUpload: () => void;
}

export const VoiceOrbPanel: React.FC<VoiceOrbPanelProps> = ({
  mode,
  isConnected,
  isRecording,
  messages,
  textInput,
  onClose,
  onSelectMode,
  onBackToModes,
  onToggleRecording,
  onTextInputChange,
  onSendMessage,
  onFileUpload
}) => {
  return (
    <>
      <style>{panelStyles}</style>
      
      {/* Dark overlay with blur */}
      <div 
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />
      
      {/* Main panel */}
      <div
        className="kiaan-panel fixed z-50"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vh',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Card className="w-full h-full bg-transparent border-none shadow-none">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  <Mic className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-800 font-medium">Kiaan Voice Orb</span>
                {isConnected && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Connected
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-auto">
              {!mode && (
                <ModeSelection onSelectMode={onSelectMode} />
              )}

              {mode === 'voice' && (
                <VoiceMode
                  isRecording={isRecording}
                  messages={messages}
                  onToggleRecording={onToggleRecording}
                />
              )}

              {mode === 'text' && (
                <TextMode
                  messages={messages}
                  textInput={textInput}
                  onTextInputChange={onTextInputChange}
                  onSendMessage={onSendMessage}
                  onFileUpload={onFileUpload}
                />
              )}

              {mode === 'meeting' && <MeetingMode />}
            </div>

            {/* Back button for modes */}
            {mode && (
              <div className="px-6 pb-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={onBackToModes}
                  className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 mt-4"
                >
                  ← Back to modes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};
