
import React from 'react';
import LLMSelection from '@/components/LLMSelection';
import { LLMProvider } from '@/types';

interface ChatHeaderProps {
  currentProvider: LLMProvider;
  onProviderChange: (provider: LLMProvider) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ currentProvider, onProviderChange }) => {
  return (
    <header className="border-b py-3 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <h1 className="text-xl font-semibold">Velora AI Assistant</h1>
        <LLMSelection 
          currentProvider={currentProvider} 
          onProviderChange={onProviderChange} 
        />
      </div>
    </header>
  );
};

export default ChatHeader;
