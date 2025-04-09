
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Database, X } from 'lucide-react';
import { CRMProvider } from '../../types';

interface DataActionsProps {
  showDataPreview: boolean;
  crmConnected: boolean;
  crmProvider: CRMProvider;
  onDataPreviewToggle: () => void;
  onRealTimeDataClick: () => void;
  onDisconnectFromCRM: () => void;
}

const DataActions: React.FC<DataActionsProps> = ({
  showDataPreview,
  crmConnected,
  crmProvider,
  onDataPreviewToggle,
  onRealTimeDataClick,
  onDisconnectFromCRM
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline"
        className="space-x-2"
        onClick={onDataPreviewToggle}
      >
        <FileText className="h-4 w-4" />
        <span>{showDataPreview ? 'Hide Preview' : 'Data Preview'}</span>
      </Button>
      
      {!crmConnected ? (
        <Button 
          variant="outline"
          className="space-x-2"
          onClick={onRealTimeDataClick}
        >
          <Database className="h-4 w-4" />
          <span>Real Time Data</span>
        </Button>
      ) : (
        <div className="flex items-center px-3 py-1 bg-secondary/50 rounded-md">
          <span className="text-xs mr-2">Connected to {crmProvider}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={onDisconnectFromCRM}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataActions;
