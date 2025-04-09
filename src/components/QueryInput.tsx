
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isProcessing: boolean;
  suggestions: string[];
}

const QueryInput: React.FC<QueryInputProps> = ({ onSubmit, isProcessing, suggestions }) => {
  const [query, setQuery] = useState('');
  const [processingTime, setProcessingTime] = useState(0);
  const [processingTimer, setProcessingTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Start or stop the processing timer
  useEffect(() => {
    if (isProcessing) {
      // Reset counter and start timer
      setProcessingTime(0);
      const timer = setInterval(() => {
        setProcessingTime(prev => prev + 1);
      }, 1000);
      setProcessingTimer(timer);
    } else if (processingTimer) {
      // Clear timer when processing stops
      clearInterval(processingTimer);
      setProcessingTimer(null);
    }
    
    // Cleanup timer on component unmount
    return () => {
      if (processingTimer) clearInterval(processingTimer);
    };
  }, [isProcessing]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isProcessing) {
      onSubmit(query);
    }
  };
  
  const handleSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    onSubmit(suggestion);
  };
  
  const formatProcessingTime = (seconds: number) => {
    return seconds < 60 
      ? `${seconds}s` 
      : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };
  
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <div className="relative flex-1">
          <Input
            placeholder="Ask a question about your data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 h-12 bg-background text-foreground border-border"
            disabled={isProcessing}
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
        </div>
        <Button 
          type="submit" 
          disabled={!query.trim() || isProcessing}
          className="h-12 transition-all duration-300 space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="h-5 w-5 rounded-full bg-primary-foreground/20 animate-pulse"></div>
              <span>Processing... {formatProcessingTime(processingTime)}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Analyze</span>
            </>
          )}
        </Button>
      </form>
      
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestion(suggestion)}
              disabled={isProcessing}
              className="text-sm px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueryInput;
