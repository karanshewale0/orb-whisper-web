
export type Mode = 'voice' | 'text' | 'meeting' | null;

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface Position {
  x: number;
  y: number;
}

export interface VoiceOrbState {
  isOpen: boolean;
  mode: Mode;
  position: Position;
  isDragging: boolean;
  dragOffset: Position;
  hasDragged: boolean;
  isRecording: boolean;
  messages: Message[];
  textInput: string;
  isConnected: boolean;
}
