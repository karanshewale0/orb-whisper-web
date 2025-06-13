
import React from 'react';
import { Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MeetingMode: React.FC = () => {
  return (
    <div className="p-6 text-center">
      <Video className="w-16 h-16 mx-auto mb-4 text-green-600" />
      <h3 className="text-gray-800 text-lg font-medium mb-2">Meeting Assistant</h3>
      <p className="text-gray-600 text-sm mb-6">
        AI-powered meeting assistant with transcription, summarization, and action item tracking.
      </p>
      
      <div className="space-y-3">
        <Button className="w-full bg-green-500 hover:bg-green-600">
          Start Meeting Recording
        </Button>
        <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
          Join Existing Meeting
        </Button>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500">
          Demo Mode: In production, this would integrate with meeting platforms like Zoom, Teams, or Google Meet.
        </p>
      </div>
    </div>
  );
};
