import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FloatingOrb } from './voice-orb/FloatingOrb';
import { VoiceOrbPanel } from './voice-orb/VoiceOrbPanel';
import { Mode, Message, Position, VoiceOrbState } from './voice-orb/types';
import { isConfigured } from '@/utils/elevenLabsConfig';

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

  // Check configuration on mount
  useEffect(() => {
    if (!isConfigured()) {
      console.warn('ElevenLabs agent IDs not configured. Voice features will use demo mode.');
    }
  }, []);

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
      if (!isConfigured()) {
        toast({
          title: "Demo Mode",
          description: "ElevenLabs agents not configured. Configure environment variables for production use.",
        });
      } else {
        toast({
          title: "Voice Mode Selected",
          description: "Connecting to ElevenLabs Conversational AI...",
        });
      }
    }
  };

  const toggleRecording = () => {
    setState(prev => ({ ...prev, isRecording: !prev.isRecording }));
  };

  const handleMessagesUpdate = (messages: Message[]) => {
    setState(prev => ({ ...prev, messages }));
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
  };

  const handleFileUpload = () => {
    toast({
      title: "File Upload",
      description: "File upload handled by TextMode component",
    });
  };

  const handleTextInputChange = (value: string) => {
    setState(prev => ({ ...prev, textInput: value }));
  };

  const handleBackToModes = () => {
    setState(prev => ({ ...prev, mode: null, messages: [] }));
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
      onMessagesUpdate={handleMessagesUpdate}
    />
  );
};

export default VoiceOrb;
