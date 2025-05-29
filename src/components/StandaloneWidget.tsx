
// This component demonstrates how the widget would be implemented as a standalone JavaScript file
// that can be embedded in any website

export const createKiaanVoiceOrb = (config: {
  apiKey?: string;
  agentId?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'glassmorphism' | 'dark' | 'light';
  primaryColor?: string;
}) => {
  
  // Widget configuration with defaults
  const widgetConfig = {
    apiKey: config.apiKey || '',
    agentId: config.agentId || '',
    position: config.position || 'bottom-right',
    theme: config.theme || 'glassmorphism',
    primaryColor: config.primaryColor || '#8B5CF6'
  };

  // Widget state
  let isOpen = false;
  let currentMode: 'voice' | 'text' | 'meeting' | null = null;
  let isRecording = false;
  let messages: Array<{id: string, type: 'user' | 'ai', content: string, timestamp: Date}> = [];

  // Create widget container
  const createWidgetHTML = () => {
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'kiaan-voice-orb';
    widgetContainer.style.cssText = `
      position: fixed;
      z-index: 9999;
      ${getPositionStyles(widgetConfig.position)}
    `;

    // Initial orb HTML
    widgetContainer.innerHTML = `
      <div class="voice-orb-container">
        <style>
          .voice-orb-container {
            position: relative;
          }
          
          .voice-orb {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #8B5CF6, #3B82F6);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s ease;
          }
          
          .voice-orb:hover {
            transform: scale(1.1);
          }
          
          .voice-orb-icon {
            width: 32px;
            height: 32px;
            fill: white;
          }
          
          .pulse-ring {
            position: absolute;
            border: 3px solid rgba(139, 92, 246, 0.3);
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            100% {
              transform: scale(2.4);
              opacity: 0;
            }
          }
          
          .widget-interface {
            position: absolute;
            bottom: 90px;
            right: 0;
            width: 384px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: none;
            animation: slideIn 0.3s ease;
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          .widget-header {
            padding: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .widget-content {
            padding: 24px;
          }
          
          .mode-button {
            width: 100%;
            padding: 16px;
            margin: 8px 0;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: white;
            cursor: pointer;
            transition: background 0.3s ease;
            display: flex;
            align-items: center;
            text-align: left;
          }
          
          .mode-button:hover {
            background: rgba(255, 255, 255, 0.2);
          }
          
          .recording-indicator {
            width: 96px;
            height: 96px;
            margin: 0 auto 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #EF4444, #DC2626);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 1s infinite;
          }
          
          .message-container {
            max-height: 200px;
            overflow-y: auto;
            margin: 16px 0;
          }
          
          .message {
            padding: 12px;
            margin: 8px 0;
            border-radius: 8px;
            font-size: 14px;
          }
          
          .user-message {
            background: rgba(59, 130, 246, 0.3);
            margin-left: 16px;
          }
          
          .ai-message {
            background: rgba(107, 114, 128, 0.3);
            margin-right: 16px;
          }
          
          .input-group {
            display: flex;
            gap: 8px;
            margin-top: 16px;
          }
          
          .text-input {
            flex: 1;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: white;
            outline: none;
          }
          
          .text-input::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }
          
          .send-button {
            padding: 12px 16px;
            background: #3B82F6;
            border: none;
            border-radius: 8px;
            color: white;
            cursor: pointer;
          }
          
          .close-button {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 20px;
          }
        </style>
        
        <div class="pulse-ring"></div>
        <div class="voice-orb" onclick="toggleWidget()">
          <svg class="voice-orb-icon" viewBox="0 0 24 24">
            <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
            <path d="M12 18v4"/>
            <path d="M8 22h8"/>
          </svg>
        </div>
        
        <div class="widget-interface" id="widget-interface">
          <div class="widget-header">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #8B5CF6, #3B82F6); display: flex; align-items: center; justify-content: center;">
                <svg style="width: 16px; height: 16px; fill: white;" viewBox="0 0 24 24">
                  <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
                  <path d="M12 18v4"/>
                  <path d="M8 22h8"/>
                </svg>
              </div>
              <span style="font-weight: 500;">Kiaan Voice Orb</span>
            </div>
            <button class="close-button" onclick="closeWidget()">×</button>
          </div>
          <div class="widget-content" id="widget-content">
            <!-- Content will be dynamically populated -->
          </div>
        </div>
      </div>
    `;

    return widgetContainer;
  };

  // Get position styles based on configuration
  const getPositionStyles = (position: string) => {
    switch (position) {
      case 'bottom-left':
        return 'bottom: 20px; left: 20px;';
      case 'top-right':
        return 'top: 20px; right: 20px;';
      case 'top-left':
        return 'top: 20px; left: 20px;';
      default:
        return 'bottom: 20px; right: 20px;';
    }
  };

  // Widget functionality
  const toggleWidget = () => {
    isOpen = !isOpen;
    const widgetInterface = document.getElementById('widget-interface');
    if (widgetInterface) {
      widgetInterface.style.display = isOpen ? 'block' : 'none';
      if (isOpen) {
        showModeSelection();
      }
    }
  };

  const closeWidget = () => {
    isOpen = false;
    currentMode = null;
    const widgetInterface = document.getElementById('widget-interface');
    if (widgetInterface) {
      widgetInterface.style.display = 'none';
    }
  };

  const showModeSelection = () => {
    const content = document.getElementById('widget-content');
    if (content) {
      content.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 24px; font-size: 18px; font-weight: 500;">
          Choose Interaction Mode
        </h3>
        
        <button class="mode-button" onclick="selectMode('voice')">
          <svg style="width: 24px; height: 24px; margin-right: 12px; fill: #8B5CF6;" viewBox="0 0 24 24">
            <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
            <path d="M12 18v4"/>
            <path d="M8 22h8"/>
          </svg>
          <div>
            <div style="font-weight: 500;">Voice Chat</div>
            <div style="font-size: 12px; color: rgba(255,255,255,0.7);">Natural conversation with AI</div>
          </div>
        </button>
        
        <button class="mode-button" onclick="selectMode('text')">
          <svg style="width: 24px; height: 24px; margin-right: 12px; fill: #3B82F6;" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <div>
            <div style="font-weight: 500;">Text Chat</div>
            <div style="font-size: 12px; color: rgba(255,255,255,0.7);">Type messages and attach files</div>
          </div>
        </button>
        
        <button class="mode-button" onclick="selectMode('meeting')">
          <svg style="width: 24px; height: 24px; margin-right: 12px; fill: #10B981;" viewBox="0 0 24 24">
            <path d="M23 7l-7 5 7 5V7z"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          <div>
            <div style="font-weight: 500;">Meeting Mode</div>
            <div style="font-size: 12px; color: rgba(255,255,255,0.7);">AI assistant for meetings</div>
          </div>
        </button>
      `;
    }
  };

  const selectMode = (mode: 'voice' | 'text' | 'meeting') => {
    currentMode = mode;
    
    switch (mode) {
      case 'voice':
        showVoiceInterface();
        break;
      case 'text':
        showTextInterface();
        break;
      case 'meeting':
        showMeetingInterface();
        break;
    }
  };

  const showVoiceInterface = () => {
    const content = document.getElementById('widget-content');
    if (content) {
      content.innerHTML = `
        <div style="text-align: center;">
          <div class="recording-indicator" id="recording-indicator">
            <svg style="width: 48px; height: 48px; fill: white;" viewBox="0 0 24 24">
              <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
              <path d="M12 18v4"/>
              <path d="M8 22h8"/>
            </svg>
          </div>
          
          <p style="font-size: 18px; font-weight: 500; margin-bottom: 8px;">
            ${isRecording ? 'Listening...' : 'Tap to speak'}
          </p>
          <p style="font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 24px;">
            ${isRecording ? 'Say something or tap again to stop' : 'Start a voice conversation with AI'}
          </p>
          
          <button 
            style="width: 100%; padding: 12px; background: ${isRecording ? '#EF4444' : 'linear-gradient(135deg, #8B5CF6, #3B82F6)'}; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: 500;"
            onclick="toggleRecording()"
          >
            ${isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          
          <div class="message-container" id="voice-messages"></div>
          
          <button 
            style="width: 100%; margin-top: 16px; padding: 8px; background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer;"
            onclick="showModeSelection()"
          >
            ← Back to modes
          </button>
        </div>
      `;
    }
  };

  const toggleRecording = () => {
    isRecording = !isRecording;
    showVoiceInterface();
    
    if (isRecording) {
      // Simulate recording start
      console.log('Recording started...');
    } else {
      // Simulate recording stop and AI response
      setTimeout(() => {
        addMessage('user', '[Demo] Voice input received');
        addMessage('ai', 'Hello! This is a demo response from the Kiaan Voice Orb. In production, this would be powered by ElevenLabs.');
        updateVoiceMessages();
      }, 1000);
    }
  };

  const showTextInterface = () => {
    const content = document.getElementById('widget-content');
    if (content) {
      content.innerHTML = `
        <div class="message-container" id="text-messages">
          ${messages.length === 0 ? `
            <div style="text-align: center; margin-top: 48px; color: rgba(255,255,255,0.5);">
              <svg style="width: 48px; height: 48px; margin: 0 auto 16px; opacity: 0.5;" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <p>Start typing to begin conversation</p>
            </div>
          ` : ''}
        </div>
        
        <div class="input-group">
          <button style="padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; cursor: pointer;" onclick="attachFile()">
            📎
          </button>
          <input 
            type="text" 
            class="text-input" 
            id="text-input" 
            placeholder="Type your message..."
            onkeypress="if(event.key==='Enter') sendTextMessage()"
          />
          <button class="send-button" onclick="sendTextMessage()">Send</button>
        </div>
        
        <button 
          style="width: 100%; margin-top: 16px; padding: 8px; background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer;"
          onclick="showModeSelection()"
        >
          ← Back to modes
        </button>
      `;
      updateTextMessages();
    }
  };

  const sendTextMessage = () => {
    const input = document.getElementById('text-input') as HTMLInputElement;
    if (input && input.value.trim()) {
      addMessage('user', input.value);
      const userMessage = input.value;
      input.value = '';
      
      // Simulate AI response
      setTimeout(() => {
        addMessage('ai', `Thank you for your message: "${userMessage}". This is a demo response.`);
        updateTextMessages();
      }, 1000);
      
      updateTextMessages();
    }
  };

  const showMeetingInterface = () => {
    const content = document.getElementById('widget-content');
    if (content) {
      content.innerHTML = `
        <div style="text-align: center;">
          <svg style="width: 64px; height: 64px; margin: 0 auto 16px; fill: #10B981;" viewBox="0 0 24 24">
            <path d="M23 7l-7 5 7 5V7z"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          
          <h3 style="font-size: 18px; font-weight: 500; margin-bottom: 8px;">Meeting Assistant</h3>
          <p style="font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 24px;">
            AI-powered meeting assistant with transcription, summarization, and action item tracking.
          </p>
          
          <button style="width: 100%; padding: 12px; margin-bottom: 12px; background: #10B981; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: 500;">
            Start Meeting Recording
          </button>
          
          <button style="width: 100%; padding: 12px; margin-bottom: 24px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; cursor: pointer;">
            Join Existing Meeting
          </button>
          
          <div style="padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 16px;">
            <p style="font-size: 12px; color: rgba(255,255,255,0.6);">
              Demo Mode: In production, this would integrate with meeting platforms like Zoom, Teams, or Google Meet.
            </p>
          </div>
          
          <button 
            style="width: 100%; padding: 8px; background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer;"
            onclick="showModeSelection()"
          >
            ← Back to modes
          </button>
        </div>
      `;
    }
  };

  const addMessage = (type: 'user' | 'ai', content: string) => {
    messages.push({
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    });
  };

  const updateTextMessages = () => {
    const container = document.getElementById('text-messages');
    if (container) {
      container.innerHTML = messages.map(message => `
        <div class="message ${message.type}-message">
          <p>${message.content}</p>
          <p style="font-size: 10px; color: rgba(255,255,255,0.5); margin-top: 4px;">
            ${message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      `).join('');
      container.scrollTop = container.scrollHeight;
    }
  };

  const updateVoiceMessages = () => {
    const container = document.getElementById('voice-messages');
    if (container) {
      container.innerHTML = messages.map(message => `
        <div class="message ${message.type}-message">
          <p>${message.content}</p>
        </div>
      `).join('');
    }
  };

  const attachFile = () => {
    alert('File upload functionality would be implemented here');
  };

  // Make functions globally available
  (window as any).toggleWidget = toggleWidget;
  (window as any).closeWidget = closeWidget;
  (window as any).showModeSelection = showModeSelection;
  (window as any).selectMode = selectMode;
  (window as any).toggleRecording = toggleRecording;
  (window as any).sendTextMessage = sendTextMessage;
  (window as any).attachFile = attachFile;

  // Initialize widget
  const widget = createWidgetHTML();
  document.body.appendChild(widget);

  // Return API for external control
  return {
    open: () => toggleWidget(),
    close: () => closeWidget(),
    destroy: () => {
      const element = document.getElementById('kiaan-voice-orb');
      if (element) {
        element.remove();
      }
    },
    updateConfig: (newConfig: Partial<typeof widgetConfig>) => {
      Object.assign(widgetConfig, newConfig);
    }
  };
};

// Global initialization function for script tag usage
(window as any).KiaanVoiceOrb = {
  init: createKiaanVoiceOrb
};

export default createKiaanVoiceOrb;
