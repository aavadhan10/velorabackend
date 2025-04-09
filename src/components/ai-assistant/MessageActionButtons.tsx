
import React from 'react';
import { BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisualizationType } from '@/types';

interface MessageActionButtonsProps {
  actions?: Array<{
    type: string;
    label: string;
    visualizationType?: VisualizationType;
  }>;
  isFollowUp?: boolean;
  onActionSelect: (action: string, visualizationType?: VisualizationType) => void;
}

const MessageActionButtons: React.FC<MessageActionButtonsProps> = ({ 
  actions,
  isFollowUp,
  onActionSelect
}) => {
  if (isFollowUp) {
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onActionSelect('visualize', 'bar')}
          className="flex items-center gap-1"
        >
          <BarChart className="h-4 w-4" />
          Yes, create a visual chart
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onActionSelect('decline')}
          className="flex items-center gap-1"
        >
          No thanks
        </Button>
      </div>
    );
  }

  if (actions && actions.length > 0) {
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {actions.map((action, index) => (
          <Button 
            key={index}
            variant="outline" 
            size="sm" 
            onClick={() => onActionSelect(action.type, action.visualizationType)}
            className="flex items-center gap-1"
          >
            {action.type === 'visualize' && <BarChart className="h-4 w-4" />}
            {action.label}
          </Button>
        ))}
      </div>
    );
  }

  return null;
};

export default MessageActionButtons;
