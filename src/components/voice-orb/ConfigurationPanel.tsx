
import React from 'react';
import { Settings, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getConfigStatus } from '@/utils/elevenLabsConfig';

interface ConfigurationPanelProps {
  onClose: () => void;
}

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ onClose }) => {
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
            This widget is configured with ElevenLabs agent IDs. To use your own agents, set environment variables or update the configuration in the code.
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-xs font-medium">Chat Agent Status</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={config.chat.isDefault ? "secondary" : "default"}>
                  {config.chat.isDefault ? 'Default Config' : 'Custom Agent'}
                </Badge>
                {config.chat.hasEnvVar && <Badge variant="outline">Env Var</Badge>}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {config.chat.isDefault ? 'Using default placeholder' : 'Using custom agent ID'}
              </p>
            </div>
            <div>
              <Label className="text-xs font-medium">Meeting Agent Status</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={config.meeting.isDefault ? "secondary" : "default"}>
                  {config.meeting.isDefault ? 'Default Config' : 'Custom Agent'}
                </Badge>
                {config.meeting.hasEnvVar && <Badge variant="outline">Env Var</Badge>}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {config.meeting.isDefault ? 'Using default placeholder' : 'Using custom agent ID'}
              </p>
            </div>
          </div>

          {/* Configuration Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>To configure your own agents:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                <li>Create agents in ElevenLabs Conversational AI</li>
                <li>Set environment variables:
                  <code className="bg-gray-100 px-1 rounded text-xs ml-1">
                    VITE_ELEVENLABS_CHAT_AGENT_ID
                  </code> and 
                  <code className="bg-gray-100 px-1 rounded text-xs ml-1">
                    VITE_ELEVENLABS_MEETING_AGENT_ID
                  </code>
                </li>
                <li>Or update the default values in <code className="bg-gray-100 px-1 rounded text-xs">src/utils/elevenLabsConfig.ts</code></li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* Environment Variables Guide */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-medium text-sm mb-2">Environment Variables (.env file):</p>
            <pre className="text-xs bg-gray-800 text-green-400 p-2 rounded overflow-x-auto">
{`VITE_ELEVENLABS_CHAT_AGENT_ID=your_chat_agent_id_here
VITE_ELEVENLABS_MEETING_AGENT_ID=your_meeting_agent_id_here`}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.open('https://elevenlabs.io/app/conversational-ai', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open ElevenLabs
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 mt-4 p-3 bg-blue-50 rounded">
            <p className="font-medium mb-1">How to get your Agent IDs:</p>
            <p>1. Visit ElevenLabs Conversational AI</p>
            <p>2. Create or select your agents</p>
            <p>3. Copy the Agent ID from the agent settings</p>
            <p>4. Add them to your environment variables or update the code</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Add missing Label component import
const Label: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <label className={className}>{children}</label>
);
