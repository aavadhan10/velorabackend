
import React from 'react';
import { Sparkles } from 'lucide-react';
import { LLMProvider } from '@/types';

interface MessageHeaderProps {
  role: 'user' | 'assistant' | 'system';
  provider?: LLMProvider;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ role, provider }) => {
  return (
    <>
      {role === 'assistant' && provider && (
        <div className="text-xs text-muted-foreground mb-1 flex items-center">
          <Sparkles className="h-3 w-3 mr-1" />
          Powered by {provider}
        </div>
      )}
      <div className="text-sm mb-2 font-medium">
        {role === 'assistant' ? 'Velora AI' : 'You'}
      </div>
    </>
  );
};

export default MessageHeader;
