
import React from 'react';
import { Clock } from 'lucide-react';

interface ProcessingMessageProps {
  awaitingResponse?: boolean;
}

const ProcessingMessage: React.FC<ProcessingMessageProps> = ({ awaitingResponse }) => {
  if (!awaitingResponse) return null;
  
  return (
    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
      <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
      <span>Awaiting your response...</span>
    </div>
  );
};

export default ProcessingMessage;
