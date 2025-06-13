
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Play, Square, Download, Clock, Users } from 'lucide-react';
import { pdfService, ConversationEntry } from '@/services/pdfService';
import { useToast } from '@/hooks/use-toast';

interface MeetingRecorderProps {
  onAddMessage?: (speaker: 'user' | 'assistant', content: string) => void;
}

const MeetingRecorder = ({ onAddMessage }: MeetingRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

  // Update duration every second when recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording && startTime) {
      interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, startTime]);

  const startRecording = () => {
    const title = meetingTitle.trim() || `Meeting ${new Date().toLocaleDateString()}`;
    pdfService.startRecording(title);
    setIsRecording(true);
    setStartTime(new Date());
    setDuration(0);
    setConversation(pdfService.getConversation());
    
    toast({
      title: "Recording Started",
      description: `Meeting "${title}" is now being recorded`,
    });
  };

  const stopRecording = () => {
    pdfService.stopRecording();
    setIsRecording(false);
    setConversation(pdfService.getConversation());
    
    toast({
      title: "Recording Stopped",
      description: "Meeting recording has been saved",
    });
  };

  const downloadPDF = () => {
    try {
      pdfService.downloadPDF();
      toast({
        title: "PDF Downloaded",
        description: "Meeting transcript has been downloaded successfully",
      });
    } catch (error) {
      console.error('PDF download error:', error);
      toast({
        title: "Download Error",
        description: "Failed to download meeting transcript",
        variant: "destructive",
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Add demo messages when recording starts
  useEffect(() => {
    if (isRecording && onAddMessage) {
      const demoMessages = [
        { speaker: 'user' as const, content: 'Hello everyone, thanks for joining today\'s meeting.' },
        { speaker: 'assistant' as const, content: 'Good morning! I\'m here to assist with note-taking and action items for this meeting.' },
      ];

      setTimeout(() => {
        demoMessages.forEach((msg, index) => {
          setTimeout(() => {
            pdfService.addEntry(msg.speaker === 'assistant' ? 'ai' : msg.speaker, msg.content);
            setConversation(pdfService.getConversation());
            onAddMessage(msg.speaker, msg.content);
          }, index * 2000);
        });
      }, 1000);
    }
  }, [isRecording, onAddMessage]);

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Meeting Recorder</span>
            {isRecording && (
              <Badge variant="destructive" className="ml-auto">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1" />
                Recording
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Enter meeting title (optional)"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              disabled={isRecording}
              className="mb-4"
            />
          </div>

          <div className="flex items-center space-x-4">
            {!isRecording ? (
              <Button onClick={startRecording} className="bg-green-500 hover:bg-green-600">
                <Play className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="destructive">
                <Square className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            )}

            {conversation.length > 0 && (
              <Button onClick={downloadPDF} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            )}

            {isRecording && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {formatDuration(duration)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conversation Preview */}
      {conversation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Conversation Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {conversation.slice(-5).map((entry) => (
                <div key={entry.id} className="text-xs">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <span>{entry.timestamp.toLocaleTimeString()}</span>
                    <Badge variant="outline" className="text-xs">
                      {entry.speaker === 'user' ? 'Participant' : 
                       entry.speaker === 'ai' ? 'AI' : 'System'}
                    </Badge>
                  </div>
                  <p className="text-gray-800 mt-1">{entry.content}</p>
                  <Separator className="mt-2" />
                </div>
              ))}
              {conversation.length > 5 && (
                <p className="text-xs text-gray-500 text-center">
                  ... and {conversation.length - 5} more entries
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeetingRecorder;
