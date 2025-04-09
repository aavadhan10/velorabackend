
import React, { useState, useCallback } from 'react';
import { UploadCloud, FileSpreadsheet, AlertCircle } from 'lucide-react';

interface DragDropZoneProps {
  onFileDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  isLoading: boolean;
  error: string | null;
}

const DragDropZone: React.FC<DragDropZoneProps> = ({ onFileDrop, isLoading, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    onFileDrop(event);
  }, [onFileDrop]);
  
  return (
    <div
      className={`min-h-[50vh] w-full flex flex-col items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
        isDragging ? 'bg-primary/10 border-primary border-2 scale-[1.01]' : 'border-dashed border-2 border-border'
      } ${error ? 'border-destructive/50' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center max-w-md">
        {error ? (
          <>
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-xl font-medium">Upload Error</h3>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">Drag and drop a CSV file to try again.</p>
          </>
        ) : isLoading ? (
          <>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-medium">Processing File</h3>
            <p className="text-muted-foreground">Analyzing your CSV data...</p>
          </>
        ) : (
          <>
            <div className={`w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
              {isDragging ? (
                <FileSpreadsheet className="h-8 w-8 text-primary" />
              ) : (
                <UploadCloud className="h-8 w-8 text-primary" />
              )}
            </div>
            <h3 className="text-xl font-medium">Drop your CSV file here</h3>
            <p className="text-muted-foreground">
              Drag and drop a CSV file to generate interactive dashboards and insights
            </p>
            <div className="text-sm text-muted-foreground mt-6 border border-border p-2 rounded-lg">
              <p>For legal professionals: we handle your data securely and analyze it locally in your browser.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(DragDropZone);
