import { useState, useRef, useEffect } from 'react';
import { Mic, MessageCircle, Video, X, Send, Paperclip, MicOff, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { configService } from '@/services/configService';
import { openAiService, ChatMessage } from '@/services/openAiService';

type Mode = 'voice' | 'text' | 'meeting' | null;

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface VoiceOrbProps {
  onOpenConfig?: () => void;
}

const VoiceOrb = ({ onOpenConfig }: VoiceOrbProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragThreshold, setDragThreshold] = useState(5);
  const [hasDragged, setHasDragged] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const orbRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const orbSize = 64;

  // Neural network SVG icon
  const NeuralNetworkIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      {/* Nodes */}
      <circle cx="8" cy="8" r="2" fill="white" />
      <circle cx="24" cy="8" r="2" fill="white" />
      <circle cx="8" cy="24" r="2" fill="white" />
      <circle cx="24" cy="24" r="2" fill="white" />
      <circle cx="16" cy="16" r="3" fill="white" />
      
      {/* Connections */}
      <line x1="8" y1="8" x2="16" y2="16" stroke="white" strokeWidth="1.5" opacity="0.8" />
      <line x1="24" y1="8" x2="16" y2="16" stroke="white" strokeWidth="1.5" opacity="0.8" />
      <line x1="8" y1="24" x2="16" y2="16" stroke="white" strokeWidth="1.5" opacity="0.8" />
      <line x1="24" y1="24" x2="16" y2="16" stroke="white" strokeWidth="1.5" opacity="0.8" />
    </svg>
  );

  // Initialize position
  useEffect(() => {
    const updatePosition = () => {
      if (!isDragging) {
        const defaultX = window.innerWidth - 80;
        const defaultY = window.innerHeight - 80;
        setPosition({ x: defaultX, y: defaultY });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isDragging]);

  // Dragging functionality with threshold
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return;
    
    setIsDragging(true);
    setHasDragged(false);
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
    
    const dragDistance = Math.sqrt(
      Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2)
    );
    
    if (dragDistance > dragThreshold) {
      setHasDragged(true);
    }
    
    const maxX = window.innerWidth - orbSize;
    const maxY = window.innerHeight - orbSize;
    const newX = Math.max(0, Math.min(maxX, e.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(maxY, e.clientY - dragOffset.y));
    
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

  const handleOrbClick = () => {
    if (!hasDragged) {
      setIsOpen(true);
      // Prevent page scrolling when panel is open
      document.body.style.overflow = 'hidden';
    }
  };

  const closeInterface = () => {
    setIsOpen(false);
    setMode(null);
    setIsRecording(false);
    setMessages([]);
    setConversationHistory([]);
    // Restore page scrolling
    document.body.style.overflow = '';
  };

  const selectMode = (selectedMode: Mode) => {
    setMode(selectedMode);
    if (selectedMode === 'voice' || selectedMode === 'meeting') {
      const hasValidConfig = configService.hasValidElevenLabsConfig();
      if (!hasValidConfig) {
        toast({
          title: "Configuration Required",
          description: "Please configure your ElevenLabs API key and agent IDs first.",
          action: onOpenConfig ? (
            <Button variant="outline" size="sm" onClick={onOpenConfig}>
              Configure
            </Button>
          ) : undefined,
        });
        return;
      }
      toast({
        title: "Voice Mode Selected",
        description: "Note: This is a demo. In production, this would connect to ElevenLabs API.",
      });
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Recording Started",
        description: "Speak now... (Demo mode)",
      });
    } else {
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

  const sendTextMessage = async () => {
    if (!textInput.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: textInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setTextInput('');
    setIsLoading(true);
    
    try {
      const config = configService.getOpenAiConfig();
      let aiResponse: string;
      
      if (config.webhookUrl) {
        // Use webhook if configured
        const response = await fetch(config.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage.content,
            timestamp: userMessage.timestamp.toISOString()
          })
        });
        
        if (!response.ok) {
          throw new Error('Webhook request failed');
        }
        
        const result = await response.json();
        aiResponse = result.message || result.response || 'No response from webhook';
      } else {
        // Use OpenAI API
        aiResponse = await openAiService.sendMessage(userMessage.content, conversationHistory);
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage.content },
        { role: 'assistant', content: aiResponse }
      ]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error processing your message. Please check your configuration and try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    try {
      setIsLoading(true);
      
      const config = configService.getOpenAiConfig();
      let aiResponse: string;
      
      if (config.webhookUrl) {
        const formData = new FormData();
        formData.append('message', textInput || 'Files uploaded');
        files.forEach((file, index) => {
          formData.append(`file_${index}`, file);
        });
        
        const response = await fetch(config.webhookUrl, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Webhook file upload failed');
        }
        
        const result = await response.json();
        aiResponse = result.message || result.response || 'Files processed successfully';
      } else {
        // Use OpenAI with file descriptions
        aiResponse = await openAiService.sendMessageWithFiles(
          textInput || 'Please help me with these files',
          files,
          conversationHistory
        );
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `${textInput || 'Uploaded files:'} ${files.map(f => f.name).join(', ')}`,
        timestamp: new Date()
      };

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
      setTextInput('');
      
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "Upload Error",
        description: "Failed to process files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  if (!isOpen) {
    return (
      <>
        <style>{`
          @keyframes pulse-ring {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(2.4);
              opacity: 0;
            }
          }
          
          .pulse-ring {
            animation: pulse-ring 3s infinite;
          }
          
          .orb-hover:hover {
            transform: scale(1.05);
          }
        `}</style>
        
        <div
          ref={orbRef}
          className="fixed z-50 cursor-pointer select-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${orbSize}px`,
            height: `${orbSize}px`,
          }}
          onMouseDown={handleMouseDown}
          onClick={handleOrbClick}
        >
          <div className="relative">
            {/* Pulsing ring */}
            <div className="absolute inset-0 pulse-ring">
              <div 
                className="w-16 h-16 rounded-full border-2 border-blue-400 opacity-30"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              ></div>
            </div>
            
            {/* Main orb */}
            <div 
              className="relative w-16 h-16 rounded-full orb-hover transition-transform duration-200 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 0 20px rgba(102, 126, 234, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15)',
                transform: isDragging ? 'none' : undefined,
              }}
            >
              <NeuralNetworkIcon />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes panel-enter {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        .kiaan-panel {
          animation: panel-enter 0.3s ease-out;
        }
        
        @media (max-width: 768px) {
          .kiaan-panel {
            width: 95vw !important;
            height: 95vh !important;
          }
        }
      `}</style>
      
      {/* Dark overlay with blur */}
      <div 
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={closeInterface}
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
              <div className="flex items-center space-x-2">
                {onOpenConfig && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onOpenConfig}
                    className="text-gray-600 hover:bg-gray-100"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeInterface}
                  className="text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-auto">
              {/* Mode Selection */}
              {!mode && (
                <div className="p-6 space-y-4">
                  <h3 className="text-gray-800 text-lg font-medium text-center mb-6">
                    Choose Interaction Mode
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      onClick={() => selectMode('voice')}
                      className="h-16 bg-gradient-to-r from-purple-100 to-purple-200 border border-purple-300 hover:from-purple-200 hover:to-purple-300 text-gray-800 justify-start"
                    >
                      <Mic className="w-6 h-6 mr-3 text-purple-600" />
                      <div className="text-left">
                        <div className="font-medium">Voice Chat</div>
                        <div className="text-sm text-gray-600">Natural conversation with AI</div>
                      </div>
                    </Button>
                    
                    <Button
                      onClick={() => selectMode('text')}
                      className="h-16 bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 hover:from-blue-200 hover:to-blue-300 text-gray-800 justify-start"
                    >
                      <MessageCircle className="w-6 h-6 mr-3 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium">Text Chat</div>
                        <div className="text-sm text-gray-600">Type messages and attach files</div>
                      </div>
                    </Button>
                    
                    <Button
                      onClick={() => selectMode('meeting')}
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
                    <p className="text-gray-800 text-lg font-medium">
                      {isRecording ? 'Listening...' : 'Tap to speak'}
                    </p>
                    <p className="text-gray-600 text-sm">
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
              )}

              {/* Text Mode */}
              {mode === 'text' && (
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
                      {isLoading && (
                        <div className="bg-gray-100 mr-4 p-3 rounded-lg">
                          <p className="text-sm text-gray-600">AI is thinking...</p>
                        </div>
                      )}
                    </div>

                    {/* Input */}
                    <div className="flex items-center space-x-2 mt-auto">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.csv,.txt,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleFileUpload}
                        disabled={isLoading}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Input
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendTextMessage()}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1 bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                      />
                      <Button
                        onClick={sendTextMessage}
                        size="sm"
                        disabled={isLoading || !textInput.trim()}
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
                  <Video className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <h3 className="text-gray-800 text-lg font-medium mb-2">Meeting Assistant</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    AI-powered meeting assistant with transcription, summarization, and action item tracking.
                  </p>
                  
                  <div className="space-y-3">
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      Start Meeting Recording
                    </Button>
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                      Join Existing Meeting
                    </Button>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">
                      Demo Mode: In production, this would integrate with meeting platforms like Zoom, Teams, or Google Meet.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Back button for modes */}
            {mode && (
              <div className="px-6 pb-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMode(null);
                    setMessages([]);
                    setConversationHistory([]);
                  }}
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

export default VoiceOrb;
