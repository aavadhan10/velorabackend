
import React, { useRef, useEffect, useState } from 'react';
import { Message as MessageType, VisualizationType } from '@/types';
import Message from './Message';
import ProcessingIndicator from './ProcessingIndicator';

interface MessageListProps {
  messages: MessageType[];
  isProcessing: boolean;
  onActionSelect?: (messageId: string, action: string, visualizationType?: VisualizationType) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isProcessing, onActionSelect }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [processingTime, setProcessingTime] = useState(0);
  
  // Track the processing time when the AI is thinking
  useEffect(() => {
    let intervalId: number;
    
    if (isProcessing) {
      setProcessingTime(0);
      intervalId = window.setInterval(() => {
        setProcessingTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isProcessing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Small delay to allow animation to play before scrolling
    const scrollTimer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(scrollTimer);
  }, [messages, isProcessing]);

  return (
    <div className="flex-1 overflow-y-auto space-y-6 pb-6 pr-2">
      {messages.map((msg) => (
        <Message 
          key={msg.id} 
          {...msg}
          onActionSelect={onActionSelect}
        />
      ))}
      
      {isProcessing && (
        <div className="flex gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="h-5 w-5 bg-primary/30 rounded-full animate-pulse"></span>
          </div>
          <ProcessingIndicator processingTime={processingTime} />
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
