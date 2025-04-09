
import React from 'react';
import { Bot, Clock, User } from 'lucide-react';
import { Message as MessageType, VisualizationType } from '@/types';
import MessageHeader from './MessageHeader';
import MessageActionButtons from './MessageActionButtons';
import MessageVisualization from './MessageVisualization';
import ProcessingMessage from './ProcessingMessage';

interface MessageProps extends MessageType {
  onActionSelect?: (messageId: string, action: string, visualizationType?: VisualizationType) => void;
}

const Message: React.FC<MessageProps> = ({ 
  id, 
  content, 
  role, 
  timestamp, 
  provider, 
  actions, 
  awaitingResponse,
  visualization,
  isFollowUp,
  onActionSelect 
}) => {
  const handleAction = (action: string, visualizationType?: VisualizationType) => {
    if (onActionSelect) {
      onActionSelect(id, action, visualizationType);
    }
  };

  const messageAnimation = role === 'assistant' 
    ? "animate-slide-in-left opacity-0" 
    : "animate-slide-in-right opacity-0";

  return (
    <div 
      key={id} 
      className={`flex gap-4 ${role === 'assistant' ? '' : 'justify-end'} animate-fade-in`}
    >
      {role === 'assistant' && (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      )}
      <div className={`max-w-3xl ${role === 'assistant' ? 'bg-card border border-border shadow-sm' : 'bg-primary text-primary-foreground'} p-4 rounded-lg ${messageAnimation}`}
           style={{ animationDelay: '0.1s', animationDuration: '0.4s', animationFillMode: 'forwards' }}>
        <MessageHeader role={role} provider={provider} />
        
        <div className="whitespace-pre-wrap">
          {content}
        </div>
        
        {role === 'assistant' && (
          <>
            <MessageActionButtons 
              actions={actions} 
              isFollowUp={isFollowUp} 
              onActionSelect={handleAction} 
            />
            
            {visualization && (
              <MessageVisualization visualization={visualization} />
            )}
            
            <ProcessingMessage awaitingResponse={awaitingResponse} />
          </>
        )}
        
        <div className="text-xs mt-2 opacity-70 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {timestamp.toLocaleTimeString()}
        </div>
      </div>
      {role === 'user' && (
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <User className="h-5 w-5 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};

export default Message;
