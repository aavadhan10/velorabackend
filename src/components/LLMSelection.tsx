
import React from 'react';
import { LLMProvider } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface LLMSelectionProps {
  currentProvider: LLMProvider;
  onProviderChange: (provider: LLMProvider) => void;
}

const LLMSelection: React.FC<LLMSelectionProps> = ({ currentProvider, onProviderChange }) => {
  const handleChange = (provider: LLMProvider) => {
    onProviderChange(provider);
    toast.success(`Switched to ${provider} for analysis`);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span>AI Engine:</span>
      </div>
      <Select value={currentProvider} onValueChange={handleChange}>
        <SelectTrigger className="w-[140px] h-9 bg-secondary/50">
          <SelectValue placeholder="Select LLM" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Velora AI (beta)">Velora AI (beta)</SelectItem>
          <SelectItem value="OpenAI">OpenAI</SelectItem>
          <SelectItem value="Claude">Claude</SelectItem>
          <SelectItem value="ChatGPT">ChatGPT</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LLMSelection;
