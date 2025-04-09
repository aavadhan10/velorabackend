
import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { DataSummary } from '../../types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DataInsightsProps {
  dataSummary: DataSummary;
}

const DataInsights: React.FC<DataInsightsProps> = ({ dataSummary }) => {
  // Set isOpen to true by default so insights are visible when data is loaded
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <Alert className="bg-secondary/50 border border-border">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            <AlertTitle>Data Insights</AlertTitle>
          </div>
          <CollapsibleTrigger asChild>
            <button className="hover:bg-secondary p-1 rounded-full">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mt-2">
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              {dataSummary.suggestedInsights.map((insight, index) => (
                <li key={index} className="text-sm">{insight}</li>
              ))}
            </ul>
          </AlertDescription>
        </CollapsibleContent>
      </Alert>
    </Collapsible>
  );
};

export default DataInsights;
