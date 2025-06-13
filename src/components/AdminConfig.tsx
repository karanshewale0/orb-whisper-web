
import { useState, useEffect } from 'react';
import { Settings, Save, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface ConfigData {
  elevenLabsApiKey: string;
  chatAgentId: string;
  meetingAgentId: string;
  openAiApiKey: string;
  webhookUrl: string;
}

const AdminConfig = () => {
  const [config, setConfig] = useState<ConfigData>({
    elevenLabsApiKey: '',
    chatAgentId: '',
    meetingAgentId: '',
    openAiApiKey: '',
    webhookUrl: ''
  });
  const [showKeys, setShowKeys] = useState({
    elevenLabs: false,
    openAi: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved configuration from localStorage
    const savedConfig = localStorage.getItem('kiaan-admin-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
      } catch (error) {
        console.error('Error loading saved config:', error);
      }
    }
  }, []);

  const handleInputChange = (field: keyof ConfigData, value: string) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('kiaan-admin-config', JSON.stringify(config));
      
      toast({
        title: "Configuration Saved",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleKeyVisibility = (key: 'elevenLabs' | 'openAi') => {
    setShowKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const maskKey = (key: string, visible: boolean) => {
    if (!key) return '';
    if (visible) return key;
    return key.length > 8 ? `${key.substring(0, 4)}${'*'.repeat(key.length - 8)}${key.substring(key.length - 4)}` : '*'.repeat(key.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Kiaan Voice Orb Configuration</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <p className="text-sm text-gray-600">
              Configure your API keys and agent IDs to enable voice and text features.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ElevenLabs Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">ElevenLabs Configuration</h3>
              
              <div className="space-y-2">
                <Label htmlFor="elevenlabs-api-key">ElevenLabs API Key</Label>
                <div className="relative">
                  <Input
                    id="elevenlabs-api-key"
                    type={showKeys.elevenLabs ? 'text' : 'password'}
                    value={showKeys.elevenLabs ? config.elevenLabsApiKey : maskKey(config.elevenLabsApiKey, false)}
                    onChange={(e) => handleInputChange('elevenLabsApiKey', e.target.value)}
                    placeholder="sk-..."
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleKeyVisibility('elevenLabs')}
                  >
                    {showKeys.elevenLabs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chat-agent-id">Chat Agent ID</Label>
                  <Input
                    id="chat-agent-id"
                    value={config.chatAgentId}
                    onChange={(e) => handleInputChange('chatAgentId', e.target.value)}
                    placeholder="agent_..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meeting-agent-id">Meeting Agent ID</Label>
                  <Input
                    id="meeting-agent-id"
                    value={config.meetingAgentId}
                    onChange={(e) => handleInputChange('meetingAgentId', e.target.value)}
                    placeholder="agent_..."
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* OpenAI Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">OpenAI Configuration</h3>
              
              <div className="space-y-2">
                <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                <div className="relative">
                  <Input
                    id="openai-api-key"
                    type={showKeys.openAi ? 'text' : 'password'}
                    value={showKeys.openAi ? config.openAiApiKey : maskKey(config.openAiApiKey, false)}
                    onChange={(e) => handleInputChange('openAiApiKey', e.target.value)}
                    placeholder="sk-..."
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => toggleKeyVisibility('openAi')}
                  >
                    {showKeys.openAi ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Used for text chat responses when webhook is not configured
                </p>
              </div>
            </div>

            <Separator />

            {/* Webhook Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Webhook Configuration (Optional)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  value={config.webhookUrl}
                  onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                  placeholder="https://your-webhook-url.com/endpoint"
                />
                <p className="text-xs text-gray-500">
                  Leave empty to use OpenAI API for text responses
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Security Notice</h4>
          <p className="text-sm text-blue-700">
            API keys are stored locally in your browser. For production use, consider implementing 
            server-side configuration management for enhanced security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminConfig;
