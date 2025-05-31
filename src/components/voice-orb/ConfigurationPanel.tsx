
import React, { useState, useEffect } from 'react';
import { Settings, Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { setAgentId, getConfigStatus } from '@/utils/elevenLabsConfig';

interface ConfigurationPanelProps {
  onClose: () => void;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ onClose }) => {
  const [chatAgentId, setChatAgentId] = useState('');
  const [meetingAgentId, setMeetingAgentId] = useState('');
  const [showIds, setShowIds] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const config = getConfigStatus();
    setChatAgentId(config.chat.current);
    setMeetingAgentId(config.meeting.current);
  }, []);

  const handleSave = () => {
    if (chatAgentId && chatAgentId !== 'demo-chat-agent') {
      setAgentId('chat', chatAgentId);
    }
    if (meetingAgentId && meetingAgentId !== 'demo-meeting-agent') {
      setAgentId('meeting', meetingAgentId);
    }

    toast({
      title: "Configuration Saved",
      description: "Agent IDs have been saved to local storage. Please refresh the page for changes to take effect.",
    });

    onClose();
  };

  const config = getConfigStatus();

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            ElevenLabs Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Configure your ElevenLabs Conversational AI agent IDs. These will be stored locally in your browser.
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-xs font-medium">Chat Agent Status</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={config.chat.isDemo ? "destructive" : "default"}>
                  {config.chat.isDemo ? 'Demo Mode' : 'Configured'}
                </Badge>
                {config.chat.hasEnvVar && <Badge variant="outline">Env Var</Badge>}
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium">Meeting Agent Status</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={config.meeting.isDemo ? "destructive" : "default"}>
                  {config.meeting.isDemo ? 'Demo Mode' : 'Configured'}
                </Badge>
                {config.meeting.hasEnvVar && <Badge variant="outline">Env Var</Badge>}
              </div>
            </div>
          </div>

          {/* Chat Agent ID */}
          <div>
            <Label htmlFor="chat-agent">Chat Agent ID</Label>
            <div className="flex gap-2">
              <Input
                id="chat-agent"
                type={showIds ? "text" : "password"}
                value={chatAgentId}
                onChange={(e) => setChatAgentId(e.target.value)}
                placeholder="Enter your ElevenLabs chat agent ID"
                className="flex-1"
              />
            </div>
          </div>

          {/* Meeting Agent ID */}
          <div>
            <Label htmlFor="meeting-agent">Meeting Agent ID</Label>
            <div className="flex gap-2">
              <Input
                id="meeting-agent"
                type={showIds ? "text" : "password"}
                value={meetingAgentId}
                onChange={(e) => setMeetingAgentId(e.target.value)}
                placeholder="Enter your ElevenLabs meeting agent ID"
                className="flex-1"
              />
            </div>
          </div>

          {/* Show/Hide Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowIds(!showIds)}
            className="w-full"
          >
            {showIds ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showIds ? 'Hide' : 'Show'} Agent IDs
          </Button>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 mt-4 p-3 bg-blue-50 rounded">
            <p className="font-medium mb-1">How to get your Agent IDs:</p>
            <p>1. Visit <a href="https://elevenlabs.io/app/conversational-ai" target="_blank" className="text-blue-600 hover:underline">ElevenLabs Conversational AI</a></p>
            <p>2. Create or select your agents</p>
            <p>3. Copy the Agent ID from the agent settings</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
