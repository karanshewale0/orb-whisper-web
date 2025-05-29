
import { useState, useRef, useEffect } from 'react';
import { Mic, MessageCircle, Video, X, Settings, Send, Paperclip, MicOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

type Mode = 'voice' | 'text' | 'meeting' | null;

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const VoiceOrb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const orbRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return;
    
    setIsDragging(true);
    const rect = orbRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 80, e.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 80, e.clientY - dragOffset.y));
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Position the orb in bottom-right corner initially
  useEffect(() => {
    const updatePosition = () => {
      if (!isDragging) {
        setPosition({
          x: window.innerWidth - 100,
          y: window.innerHeight - 100
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isDragging]);

  const handleOrbClick = () => {
    if (!isDragging) {
      setIsOpen(true);
    }
  };

  const closeInterface = () => {
    setIsOpen(false);
    setMode(null);
    setIsRecording(false);
    setMessages([]);
  };

  const selectMode = (selectedMode: Mode) => {
    setMode(selectedMode);
    if (selectedMode === 'voice' || selectedMode === 'meeting') {
      toast({
        title: "Voice Mode Selected",
        description: "Note: This is a demo. In production, this would connect to ElevenLabs API.",
      });
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate starting recording
      toast({
        title: "Recording Started",
        description: "Speak now... (Demo mode)",
      });
    } else {
      // Simulate stopping recording and AI response
      toast({
        title: "Processing...",
        description: "Converting speech to text and generating response",
      });
      
      setTimeout(() => {
        const userMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: '[Demo] Voice input received',
          timestamp: new Date()
        };
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'Hello! This is a demo of the Kiaan Voice Orb. In production, this would be powered by ElevenLabs Conversational AI with natural voice responses.',
          timestamp: new Date()
        };
        
        setMessages([userMessage, aiMessage]);
      }, 1000);
    }
  };

  const sendTextMessage = () => {
    if (!textInput.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: textInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setTextInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Thank you for your message: "${userMessage.content}". This is a demo response. In production, this would be processed by advanced AI.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleFileUpload = () => {
    toast({
      title: "File Upload",
      description: "File upload functionality would be implemented here",
    });
  };

  if (!isOpen) {
    return (
      <div
        ref={orbRef}
        className="fixed z-50 cursor-pointer select-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
        onClick={handleOrbClick}
      >
        <div className="relative">
          {/* Pulsing rings */}
          <div className="absolute inset-0 animate-ping">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-20"></div>
          </div>
          <div className="absolute inset-0 animate-pulse delay-150">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-30"></div>
          </div>
          
          {/* Main orb */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-2xl backdrop-blur-lg border border-white/20 flex items-center justify-center hover:scale-110 transition-transform duration-300">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Mic className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <Card className="w-96 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl animate-scale-in">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">Kiaan Voice Orb</span>
              {isConnected && (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  Connected
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeInterface}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Mode Selection */}
          {!mode && (
            <div className="p-6 space-y-4">
              <h3 className="text-white text-lg font-medium text-center mb-6">
                Choose Interaction Mode
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={() => selectMode('voice')}
                  className="h-16 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-400/30 hover:from-purple-500/30 hover:to-purple-600/30 text-white justify-start"
                >
                  <Mic className="w-6 h-6 mr-3 text-purple-400" />
                  <div className="text-left">
                    <div className="font-medium">Voice Chat</div>
                    <div className="text-sm text-gray-300">Natural conversation with AI</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => selectMode('text')}
                  className="h-16 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 hover:from-blue-500/30 hover:to-blue-600/30 text-white justify-start"
                >
                  <MessageCircle className="w-6 h-6 mr-3 text-blue-400" />
                  <div className="text-left">
                    <div className="font-medium">Text Chat</div>
                    <div className="text-sm text-gray-300">Type messages and attach files</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => selectMode('meeting')}
                  className="h-16 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-400/30 hover:from-green-500/30 hover:to-green-600/30 text-white justify-start"
                >
                  <Video className="w-6 h-6 mr-3 text-green-400" />
                  <div className="text-left">
                    <div className="font-medium">Meeting Mode</div>
                    <div className="text-sm text-gray-300">AI assistant for meetings</div>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {/* Voice Mode */}
          {mode === 'voice' && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${isRecording ? 'from-red-400 to-red-600' : 'from-purple-400 to-blue-600'} flex items-center justify-center mb-4 ${isRecording ? 'animate-pulse' : ''}`}>
                  {isRecording ? (
                    <MicOff className="w-12 h-12 text-white" />
                  ) : (
                    <Mic className="w-12 h-12 text-white" />
                  )}
                </div>
                <p className="text-white text-lg font-medium">
                  {isRecording ? 'Listening...' : 'Tap to speak'}
                </p>
                <p className="text-gray-300 text-sm">
                  {isRecording ? 'Say something or tap again to stop' : 'Start a voice conversation with AI'}
                </p>
              </div>
              
              <Button
                onClick={toggleRecording}
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
                          ? 'bg-purple-500/30 ml-4 text-white'
                          : 'bg-blue-500/30 mr-4 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Text Mode */}
          {mode === 'text' && (
            <div className="p-6">
              <div className="space-y-4">
                {/* Messages */}
                <div className="h-48 overflow-y-auto space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-12">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Start typing to begin conversation</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-500/30 ml-4 text-white'
                            : 'bg-gray-500/30 mr-4 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-gray-300 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFileUpload}
                    className="text-gray-400 hover:text-white hover:bg-white/20"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
                    placeholder="Type your message..."
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                  <Button
                    onClick={sendTextMessage}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Meeting Mode */}
          {mode === 'meeting' && (
            <div className="p-6 text-center">
              <Video className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h3 className="text-white text-lg font-medium mb-2">Meeting Assistant</h3>
              <p className="text-gray-300 text-sm mb-6">
                AI-powered meeting assistant with transcription, summarization, and action item tracking.
              </p>
              
              <div className="space-y-3">
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  Start Meeting Recording
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                  Join Existing Meeting
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <p className="text-xs text-gray-400">
                  Demo Mode: In production, this would integrate with meeting platforms like Zoom, Teams, or Google Meet.
                </p>
              </div>
            </div>
          )}

          {/* Back button for modes */}
          {mode && (
            <div className="px-6 pb-4">
              <Button
                variant="ghost"
                onClick={() => setMode(null)}
                className="w-full text-gray-400 hover:text-white hover:bg-white/10"
              >
                ← Back to modes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceOrb;
