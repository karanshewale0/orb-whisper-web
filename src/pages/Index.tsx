
import { useState } from 'react';
import VoiceOrb from '../components/VoiceOrb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Download, Globe, Mic, MessageCircle, Video } from 'lucide-react';

const Index = () => {
  const [showOrb, setShowOrb] = useState(true);

  const embedCode = `<script src="https://your-domain.com/kiaan-voice-orb.js"></script>
<script>
  KiaanVoiceOrb.init({
    apiKey: 'your-elevenlabs-api-key',
    agentId: 'your-agent-id',
    position: 'bottom-right',
    theme: 'glassmorphism'
  });
</script>`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-blue-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-56 h-56 bg-indigo-500 rounded-full filter blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Kiaan Voice Orb
              </h1>
              <p className="text-gray-300 mt-2">Advanced Voice AI Widget for Modern Websites</p>
            </div>
            <Button 
              onClick={() => setShowOrb(!showOrb)}
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20"
            >
              {showOrb ? 'Hide Orb' : 'Show Orb'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Hero Section */}
          <section className="text-center py-12">
            <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Voice AI Made Simple
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Integrate powerful conversational AI into any website with just a few lines of code. 
              Features voice chat, text messaging, and meeting modes with stunning glassmorphism design.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2 text-lg border-purple-400 text-purple-300">
                <Mic className="w-4 h-4 mr-2" />
                Voice Chat
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg border-blue-400 text-blue-300">
                <MessageCircle className="w-4 h-4 mr-2" />
                Text Messaging
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg border-green-400 text-green-300">
                <Video className="w-4 h-4 mr-2" />
                Meeting Mode
              </Badge>
            </div>
          </section>

          {/* Features Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Globe className="w-6 h-6 mr-2 text-purple-400" />
                  Universal Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p>Works on any website with simple script tag integration. No complex setup required.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Mic className="w-6 h-6 mr-2 text-blue-400" />
                  ElevenLabs Powered
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p>Advanced voice AI with natural conversation capabilities and multiple voice options.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Download className="w-6 h-6 mr-2 text-green-400" />
                  Drag & Drop UI
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <p>Floating, draggable interface with smooth animations and glassmorphism effects.</p>
              </CardContent>
            </Card>
          </section>

          {/* Integration Code */}
          <section>
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Code className="w-6 h-6 mr-2 text-purple-400" />
                  Integration Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                  <code className="text-green-300 text-sm">{embedCode}</code>
                </pre>
                <p className="text-gray-400 mt-4 text-sm">
                  Simply add these script tags to your website and the voice orb will appear automatically.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Demo Instructions */}
          <section>
            <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400/30 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white text-center">
                  Try the Voice Orb Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold">1</span>
                    </div>
                    <p>Click the floating orb in the bottom-right corner</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold">2</span>
                    </div>
                    <p>Choose from Voice Chat, Text Chat, or Meeting modes</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-bold">3</span>
                    </div>
                    <p>Experience the AI conversation capabilities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Voice Orb Widget */}
      {showOrb && <VoiceOrb />}
    </div>
  );
};

export default Index;
