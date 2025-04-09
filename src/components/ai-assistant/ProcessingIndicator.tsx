
import React from 'react';

interface ProcessingIndicatorProps {
  processingTime: number;
}

const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ processingTime }) => {
  return (
    <div className="flex items-center gap-3 text-muted-foreground animate-fade-in">
      <div className="flex items-center justify-center bg-primary/20 px-3 py-1 rounded-full">
        <span className="text-sm font-medium">Processing... {processingTime}s</span>
      </div>
    </div>
  );
};

export default ProcessingIndicator;
