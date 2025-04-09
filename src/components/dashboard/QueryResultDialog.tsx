
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';
import { CSVData, NLQueryResult, VisualizationConfig } from '../../types';
import VisualizationCard from '../VisualizationCard';

interface QueryResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queryResults: NLQueryResult | null;
  data: CSVData;
  onAddVisualization: (config: VisualizationConfig) => void;
}

const QueryResultDialog: React.FC<QueryResultDialogProps> = ({
  open,
  onOpenChange,
  queryResults,
  data,
  onAddVisualization
}) => {
  if (!queryResults) return null;

  // Get the appropriate visualizations array
  const visualizations = queryResults.visualizations || 
    (queryResults.visualization ? [queryResults.visualization] : []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto bg-background">
        <DialogHeader>
          <DialogTitle>Analysis Results</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 rounded-full p-1 hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        <div className="space-y-6 p-1">
          <div>
            <h3 className="text-lg font-medium mb-2">Query</h3>
            <p className="text-muted-foreground italic">"{queryResults.queryText || queryResults.query}"</p>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Analyzed using {queryResults.llmProvider || 'AI'} {queryResults.llmModel && `(${queryResults.llmModel})`}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Answer</h3>
            <div className="whitespace-pre-line">{queryResults.answer || queryResults.result}</div>
          </div>
          
          {visualizations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">Suggested Visualizations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visualizations.map((config) => (
                  <div key={config.id} className="border rounded-lg p-4 space-y-4">
                    <div>
                      <h4 className="font-medium">{config.title}</h4>
                      <p className="text-sm text-muted-foreground">{config.description}</p>
                    </div>
                    <div className="h-64 overflow-hidden">
                      <VisualizationCard
                        config={config}
                        data={data}
                        onRemove={() => {}}
                      />
                    </div>
                    <Button 
                      onClick={() => onAddVisualization(config)}
                      className="w-full"
                    >
                      Add to Dashboard
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QueryResultDialog;
