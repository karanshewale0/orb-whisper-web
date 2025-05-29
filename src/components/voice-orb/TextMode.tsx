
import React, { useState } from 'react';
import { MessageCircle, Send, Paperclip, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { TEXT_WEBHOOK_URL } from '@/utils/elevenLabsConfig';
import { Message } from './types';

interface TextModeProps {
  messages: Message[];
  textInput: string;
  onTextInputChange: (value: string) => void;
  onSendMessage: () => void;
  onFileUpload: () => void;
  onMessagesUpdate?: (messages: Message[]) => void;
}

export const TextMode: React.FC<TextModeProps> = ({
  messages,
  textInput,
  onTextInputChange,
  onSendMessage,
  onFileUpload,
  onMessagesUpdate
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const sendWebhookMessage = async (message: string, files: File[] = []) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('message', message);
      
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
      
      const response = await fetch(TEXT_WEBHOOK_URL, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Create AI response message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: result.message || result.response || 'Response received from webhook',
        timestamp: new Date()
      };
      
      // Update messages
      const updatedMessages = [...messages, aiMessage];
      onMessagesUpdate?.(updatedMessages);
      
      return result;
    } catch (error) {
      console.error('Webhook error:', error);
      
      // Fallback to demo response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Demo response: Thank you for your message "${message}". ${files.length > 0 ? `Received ${files.length} file(s). ` : ''}In production, this would be processed by your configured webhook.`,
        timestamp: new Date()
      };
      
      const updatedMessages = [...messages, aiMessage];
      onMessagesUpdate?.(updatedMessages);
      
      toast({
        title: "Using Demo Mode",
        description: "Webhook not configured. Using demo response.",
      });
    } finally {
      setIsLoading(false);
      setAttachedFiles([]);
    }
  };

  const handleSendMessage = async () => {
    if (!textInput.trim() && attachedFiles.length === 0) return;
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: textInput || '[File attachment]',
      timestamp: new Date()
    };
    
    // Update messages immediately
    const updatedMessages = [...messages, userMessage];
    onMessagesUpdate?.(updatedMessages);
    
    // Send to webhook
    await sendWebhookMessage(textInput, attachedFiles);
    
    // Clear input
    onTextInputChange('');
    onSendMessage();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
    
    toast({
      title: "Files Attached",
      description: `${files.length} file(s) ready to send`,
    });
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex-1 space-y-4">
        {/* Messages */}
        <div className="h-48 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-12">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Start typing to begin conversation</p>
              <p className="text-xs mt-1">Supports file attachments</p>
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
            <div className="bg-gray-100 mr-4 p-3 rounded-lg text-gray-800">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-400 rounded-full animate-spin border-t-transparent"></div>
                <p className="text-sm">Processing...</p>
              </div>
            </div>
          )}
        </div>

        {/* File attachments */}
        {attachedFiles.length > 0 && (
          <div className="border-t pt-2">
            <p className="text-xs text-gray-600 mb-2">Attached files:</p>
            <div className="space-y-1">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                  <span className="truncate">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-auto p-1 text-gray-400 hover:text-red-500"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex items-center space-x-2 mt-auto">
          <input
            type="file"
            multiple
            accept=".pdf,.csv,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title="Attach files"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            value={textInput}
            onChange={(e) => onTextInputChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            disabled={isLoading || (!textInput.trim() && attachedFiles.length === 0)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
