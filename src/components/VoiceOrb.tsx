
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FloatingOrb } from './voice-orb/FloatingOrb';
import { VoiceOrbPanel } from './voice-orb/VoiceOrbPanel';
import { Mode, Message, Position, VoiceOrbState } from './voice-orb/types';

const VoiceOrb = () => {
  const [state, setState] = useState<VoiceOrbState>({
    isOpen: false,
    mode: null,
    position: { x: 0, y: 0 },
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    hasDragged: false,
    isRecording: false,
    messages: [],
    textInput: '',
    isConnected: false,
  });

  const dragThreshold = 5;
  const orbSize = 64;
  const { toast } = useToast();

  // Initialize position
  useEffect(() => {
    const updatePosition = () => {
      if (!state.isDragging) {
        const defaultX = window.innerWidth - 80;
        const defaultY = window.innerHeight - 80;
        setState(prev => ({ ...prev, position: { x: defaultX, y: defaultY } }));
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [state.isDragging]);

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (state.isOpen) return;
    
    setState(prev => ({
      ...prev,
      isDragging: true,
      hasDragged: false,
      dragOffset: {
        x: e.clientX - prev.position.x,
        y: e.clientY - prev.position.y
      }
    }));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!state.isDragging) return;
    
    const dragDistance = Math.sqrt(
      Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2)
    );
    
    if (dragDistance > dragThreshold) {
      setState(prev => ({ ...prev, hasDragged: true }));
    }
    
    const maxX = window.innerWidth - orbSize;
    const maxY = window.innerHeight - orbSize;
    const newX = Math.max(0, Math.min(maxX, e.clientX - state.dragOffset.x));
    const newY = Math.max(0, Math.min(maxY, e.clientY - state.dragOffset.y));
    
    setState(prev => ({ ...prev, position: { x: newX, y: newY } }));
  };

  const handleMouseUp = () => {
    setState(prev => ({ ...prev, isDragging: false }));
  };

  useEffect(() => {
    if (state.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [state.isDragging, state.dragOffset]);

  const handleOrbClick = () => {
    if (!state.hasDragged) {
      setState(prev => ({ ...prev, isOpen: true }));
      document.body.style.overflow = 'hidden';
    }
  };

  const closeInterface = () => {
    setState(prev => ({
      ...prev,
      isOpen: false,
      mode: null,
      isRecording: false,
      messages: []
    }));
    document.body.style.overflow = '';
  };

  const selectMode = (selectedMode: Mode) => {
    setState(prev => ({ ...prev, mode: selectedMode }));
    if (selectedMode === 'voice' || selectedMode === 'meeting') {
      toast({
        title: "Voice Mode Selected",
        description: "Note: This is a demo. In production, this would connect to ElevenLabs API.",
      });
    }
  };

  const toggleRecording = () => {
    const newIsRecording = !state.isRecording;
    setState(prev => ({ ...prev, isRecording: newIsRecording }));
    
    if (newIsRecording) {
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
        
        setState(prev => ({ ...prev, messages: [userMessage, aiMessage] }));
      }, 1000);
    }
  };

  const sendTextMessage = () => {
    if (!state.textInput.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: state.textInput,
      timestamp: new Date()
    };
    
    setState(prev => ({ 
      ...prev, 
      messages: [...prev.messages, userMessage],
      textInput: ''
    }));
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Thank you for your message: "${userMessage.content}". This is a demo response. In production, this would be processed by advanced AI.`,
        timestamp: new Date()
      };
      
      setState(prev => ({ ...prev, messages: [...prev.messages, aiMessage] }));
    }, 1000);
  };

  const handleFileUpload = () => {
    toast({
      title: "File Upload",
      description: "File upload functionality would be implemented here",
    });
  };

  const handleTextInputChange = (value: string) => {
    setState(prev => ({ ...prev, textInput: value }));
  };

  const handleBackToModes = () => {
    setState(prev => ({ ...prev, mode: null }));
  };

  if (!state.isOpen) {
    return (
      <FloatingOrb
        position={state.position}
        isDragging={state.isDragging}
        onMouseDown={handleMouseDown}
        onClick={handleOrbClick}
      />
    );
  }

  return (
    <VoiceOrbPanel
      mode={state.mode}
      isConnected={state.isConnected}
      isRecording={state.isRecording}
      messages={state.messages}
      textInput={state.textInput}
      onClose={closeInterface}
      onSelectMode={selectMode}
      onBackToModes={handleBackToModes}
      onToggleRecording={toggleRecording}
      onTextInputChange={handleTextInputChange}
      onSendMessage={sendTextMessage}
      onFileUpload={handleFileUpload}
    />
  );
};

export default VoiceOrb;
