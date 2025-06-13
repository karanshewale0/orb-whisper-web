
import { jsPDF } from 'jspdf';

export interface ConversationEntry {
  id: string;
  speaker: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

export class PDFService {
  private conversation: ConversationEntry[] = [];
  private meetingTitle: string = '';
  private startTime: Date | null = null;

  startRecording(title: string = 'Meeting Recording') {
    this.meetingTitle = title;
    this.startTime = new Date();
    this.conversation = [];
    
    // Add initial entry
    this.addEntry('system', `Meeting started: ${this.startTime.toLocaleString()}`);
  }

  addEntry(speaker: 'user' | 'ai' | 'system', content: string) {
    const entry: ConversationEntry = {
      id: Date.now().toString(),
      speaker,
      content,
      timestamp: new Date()
    };
    
    this.conversation.push(entry);
  }

  stopRecording() {
    if (this.startTime) {
      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - this.startTime.getTime()) / 1000 / 60);
      this.addEntry('system', `Meeting ended: ${endTime.toLocaleString()} (Duration: ${duration} minutes)`);
    }
  }

  generatePDF(): Blob {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 8;
    let currentY = margin;

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(this.meetingTitle, margin, currentY);
    currentY += lineHeight * 2;

    // Meeting info
    if (this.startTime) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${this.startTime.toLocaleDateString()}`, margin, currentY);
      currentY += lineHeight;
      doc.text(`Start Time: ${this.startTime.toLocaleTimeString()}`, margin, currentY);
      currentY += lineHeight * 2;
    }

    // Conversation
    doc.setFontSize(10);
    
    this.conversation.forEach((entry) => {
      // Check if we need a new page
      if (currentY > pageHeight - margin - 20) {
        doc.addPage();
        currentY = margin;
      }

      // Speaker label
      doc.setFont('helvetica', 'bold');
      const speakerLabel = entry.speaker === 'user' ? 'Participant' : 
                          entry.speaker === 'ai' ? 'AI Assistant' : 'System';
      const timeStr = entry.timestamp.toLocaleTimeString();
      doc.text(`[${timeStr}] ${speakerLabel}:`, margin, currentY);
      currentY += lineHeight;

      // Content
      doc.setFont('helvetica', 'normal');
      const splitContent = doc.splitTextToSize(entry.content, pageWidth - margin * 2 - 10);
      
      splitContent.forEach((line: string) => {
        if (currentY > pageHeight - margin - 10) {
          doc.addPage();
          currentY = margin;
        }
        doc.text(line, margin + 10, currentY);
        currentY += lineHeight;
      });
      
      currentY += lineHeight * 0.5; // Space between entries
    });

    return doc.output('blob');
  }

  downloadPDF() {
    const blob = this.generatePDF();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.meetingTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  getConversation() {
    return [...this.conversation];
  }

  clearConversation() {
    this.conversation = [];
    this.startTime = null;
  }
}

export const pdfService = new PDFService();
