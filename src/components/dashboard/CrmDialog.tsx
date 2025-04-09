
import React, { useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LogIn } from 'lucide-react';
import { CRMProvider } from '../../types';

interface CRMDialogProps {
  onConnect: (provider: CRMProvider) => void;
}

const CRMDialog: React.FC<CRMDialogProps> = ({ onConnect }) => {
  return (
    <Dialog>
      <DialogTrigger id="crm-dialog-trigger" className="hidden">Open</DialogTrigger>
      <DialogContent className="max-w-md bg-background">
        <DialogHeader>
          <DialogTitle>Connect to Law Firm CRM</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect your dashboard directly to your practice management system for real-time insights.
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={() => onConnect('Clio')}
              className="w-full flex items-center gap-2 border rounded-lg p-3 hover:bg-secondary transition-colors"
            >
              <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <LogIn className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium">Clio</h3>
                <p className="text-xs text-muted-foreground">Practice management, client intake, and billing</p>
              </div>
            </button>
            
            <button 
              onClick={() => onConnect('Lawmatics')}
              className="w-full flex items-center gap-2 border rounded-lg p-3 hover:bg-secondary transition-colors"
            >
              <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <LogIn className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium">Lawmatics</h3>
                <p className="text-xs text-muted-foreground">CRM and client intake automation</p>
              </div>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CRMDialog;
