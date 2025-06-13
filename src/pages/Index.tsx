
import { useState } from 'react';
import VoiceOrb from "@/components/VoiceOrb";
import AdminConfig from "@/components/AdminConfig";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function Index() {
  const [showConfig, setShowConfig] = useState(false);

  if (showConfig) {
    return (
      <div className="relative">
        <AdminConfig />
        <Button
          onClick={() => setShowConfig(false)}
          className="fixed top-4 right-4 z-50"
          variant="outline"
        >
          Back to Widget
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Kiaan Voice Orb
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            An intelligent voice and text assistant that integrates seamlessly into any website.
            Click the floating orb to start interacting!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Easy Configuration</h3>
              <p className="text-gray-600 text-sm">
                Configure your API keys and agent IDs through our intuitive admin panel.
              </p>
            </div>
            
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Voice & Text Chat</h3>
              <p className="text-gray-600 text-sm">
                Supports both voice conversations via ElevenLabs and text chat via OpenAI or webhooks.
              </p>
            </div>
            
            <div className="p-6 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Draggable Interface</h3>
              <p className="text-gray-600 text-sm">
                Floating orb that can be positioned anywhere on the screen for optimal user experience.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Button 
              onClick={() => setShowConfig(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Open Configuration Panel
            </Button>
          </div>
        </div>
      </div>
      
      <VoiceOrb onOpenConfig={() => setShowConfig(true)} />
    </div>
  );
}
