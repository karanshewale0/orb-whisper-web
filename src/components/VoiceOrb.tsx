import { useState, useRef, useEffect } from 'react';
import { Mic, X, MessageSquare, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { configService } from '@/services/configService';
import { openAiService, ChatMessage } from '@/services/openAiService';
import { useToast } from '@/hooks/use-toast';
import MeetingRecorder from '@/components/MeetingRecorder';

interface VoiceOrbProps {
  onOpenConfig?: () => void;
}

const VoiceOrb = ({ onOpenConfig }: VoiceOrbProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'voice' | 'text' | 'meeting'>('voice');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'speaking' | 'error'>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const { toast } = useToast();

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser does not support Speech Recognition. Please try a different browser.",
        variant: "destructive",
      });
    } else {
      recognitionRef.current = new window.webkitSpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setStatus('connected');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setMessages(prev => [...prev, { role: 'user', content: event.results[i][0].transcript }]);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        if (interimTranscript) {
          setStatus('speaking');
        } else {
          setStatus('connected');
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setStatus('error');
        toast({
          title: "Speech Recognition Error",
          description: `There was an error with speech recognition: ${event.error}`,
          variant: "destructive",
        });
        stopRecognition();
      };

      recognition.onend = () => {
        if (isConnected) {
          setStatus('idle');
          startRecognition();
        } else {
          setStatus('idle');
        }
      };
    }

    return () => {
      stopRecognition();
    };
  }, [isConnected, toast]);

  const startRecognition = () => {
    if (recognitionRef.current && status !== 'connected') {
      try {
        recognitionRef.current.start();
        setStatus('connecting');
      } catch (error) {
        console.error("Error starting recognition:", error);
        setStatus('error');
        toast({
          title: "Recognition Start Error",
          description: "Failed to start speech recognition. Please check your microphone and permissions.",
          variant: "destructive",
        });
      }
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current && (status === 'connected' || status === 'speaking' || status === 'connecting')) {
      recognitionRef.current.stop();
      setStatus('idle');
    }
  };

  const handleStart = async () => {
    setIsConnecting(true);
    try {
      const hasElevenLabsConfig = configService.hasValidElevenLabsConfig();
      if (!hasElevenLabsConfig) {
        toast({
          title: "Configuration Required",
          description: "Please configure ElevenLabs API key and Agent IDs in the admin panel.",
          variant: "destructive",
        });
        onOpenConfig?.();
        return;
      }

      setIsConnected(true);
      startRecognition();
      toast({
        title: "Voice Assistant Started",
        description: "You can now start speaking to the voice assistant.",
      });
    } catch (error) {
      console.error("Error starting voice assistant:", error);
      toast({
        title: "Start Failed",
        description: "Failed to start voice assistant. Please check your configuration and try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleStop = () => {
    setIsConnected(false);
    stopRecognition();
    toast({
      title: "Voice Assistant Stopped",
      description: "Voice assistant has been stopped.",
    });
  };

  const handleModeChange = (newMode: 'voice' | 'text' | 'meeting') => {
    setMode(newMode);
    setMessages([]);
    if (newMode !== 'voice') {
      stopRecognition();
      setIsConnected(false);
    } else if (isConnected) {
      startRecognition();
    }
  };

  const handleAddMessage = (speaker: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, { role: speaker, content }]);
  };

  const renderVoiceInterface = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Voice Chat</h3>
          <p className="text-gray-600">
            Click the button below and start speaking to interact with the AI voice assistant.
          </p>
          
          {!isConnected ? (
            <Button 
              onClick={handleStart}
              disabled={isConnecting}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
            >
              {isConnecting ? 'Connecting...' : 'Start Voice Chat'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">Voice Chat Active</span>
                </div>
                {status === 'speaking' && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-600 font-medium">AI Listening</span>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleStop}
                variant="destructive"
                className="px-8 py-3 text-lg"
              >
                End Voice Chat
              </Button>
            </div>
          )}
        </div>

        {messages.length > 0 && (
          <div className="mt-6 space-y-3 max-h-60 overflow-y-auto">
            <h4 className="font-medium text-gray-700">Conversation:</h4>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-50 border-l-4 border-blue-400' 
                    : 'bg-gray-50 border-l-4 border-gray-400'
                }`}
              >
                <div className="font-medium text-sm text-gray-600 mb-1">
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </div>
                <div className="text-gray-800">{message.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderMeetingInterface = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Meeting Mode</h3>
          <p className="text-gray-600">
            Start a meeting session with AI assistance for note-taking and conversation management.
          </p>
          
          <div className="space-y-4">
            {!isConnected ? (
              <Button 
                onClick={handleStart}
                disabled={isConnecting}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg"
              >
                {isConnecting ? 'Connecting...' : 'Start Meeting'}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-medium">Meeting Active</span>
                  </div>
                  {status === 'speaking' && (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-blue-600 font-medium">AI Speaking</span>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleStop}
                  variant="destructive"
                  className="px-8 py-3 text-lg"
                >
                  End Meeting
                </Button>
              </div>
            )}
          </div>
        </div>

        {messages.length > 0 && (
          <div className="mt-6 space-y-3 max-h-60 overflow-y-auto">
            <h4 className="font-medium text-gray-700">Conversation:</h4>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-50 border-l-4 border-blue-400' 
                    : 'bg-gray-50 border-l-4 border-gray-400'
                }`}
              >
                <div className="font-medium text-sm text-gray-600 mb-1">
                  {message.role === 'user' ? 'Participant' : 'AI Assistant'}
                </div>
                <div className="text-gray-800">{message.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t bg-gray-50 p-4">
        <MeetingRecorder onAddMessage={handleAddMessage} />
      </div>
    </div>
  );

  const renderTextInterface = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length > 0 && (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-50 border-l-4 border-blue-400' 
                    : 'bg-gray-50 border-l-4 border-gray-400'
                }`}
              >
                <div className="font-medium text-sm text-gray-600 mb-1">
                  {message.role === 'user' ? 'You' : 'AI Assistant'}
                </div>
                <div className="text-gray-800">{message.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-3">
          <Input
            type="text"
            placeholder="Type your message..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === 'Enter' && textInput.trim()) {
                const userMessage = textInput.trim();
                setTextInput('');
                setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
                
                try {
                  const aiResponse = await openAiService.sendMessage(userMessage, messages);
                  setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
                } catch (error: any) {
                  console.error("Error sending message:", error);
                  toast({
                    title: "Message Failed",
                    description: error.message || "Failed to send message. Please try again.",
                    variant: "destructive",
                  });
                }
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={async () => {
              if (textInput.trim()) {
                const userMessage = textInput.trim();
                setTextInput('');
                setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
                
                try {
                  const aiResponse = await openAiService.sendMessage(userMessage, messages);
                  setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
                } catch (error: any) {
                  console.error("Error sending message:", error);
                  toast({
                    title: "Message Failed",
                    description: error.message || "Failed to send message. Please try again.",
                    variant: "destructive",
                  });
                }
              }
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </Button>

        {isOpen && (
          <div className="absolute bottom-20 right-0 w-80 h-[450px] bg-white rounded-xl shadow-xl overflow-hidden border">
            <Tabs defaultValue={mode} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="voice" onClick={() => handleModeChange('voice')}>
                  <Mic className="w-4 h-4 mr-2" />
                  Voice
                </TabsTrigger>
                <TabsTrigger value="text" onClick={() => handleModeChange('text')}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Text
                </TabsTrigger>
                 <TabsTrigger value="meeting" onClick={() => handleModeChange('meeting')}>
                  <Users className="w-4 h-4 mr-2" />
                  Meeting
                </TabsTrigger>
              </TabsList>
              <TabsContent value="voice" className="h-full p-0">
                {renderVoiceInterface()}
              </TabsContent>
              <TabsContent value="text" className="h-full p-0">
                {renderTextInterface()}
              </TabsContent>
               <TabsContent value="meeting" className="h-full p-0">
                {renderMeetingInterface()}
              </TabsContent>
            </Tabs>

            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 left-2"
              onClick={onOpenConfig}
            >
              <Settings className="w-4 h-4 mr-2" />
              Config
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceOrb;
