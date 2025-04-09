
import React, { useState } from 'react';
import { CRMProvider } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CRMIntegrationProps {
  onConnect: (provider: CRMProvider) => void;
}

const CRMIntegration: React.FC<CRMIntegrationProps> = ({ onConnect }) => {
  const [selectedProvider, setSelectedProvider] = useState<CRMProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  
  const handleConnect = () => {
    if (!selectedProvider) return;
    
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      onConnect(selectedProvider);
      setShowDialog(false);
      toast.success(`Successfully connected to ${selectedProvider}`);
    }, 1500);
  };
  
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="space-x-2">
          <Database className="h-4 w-4" />
          <span>Connect CRM</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Connect to Law Firm CRM</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect your dashboard directly to your practice management system for real-time insights.
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={() => setSelectedProvider('Clio')}
              className={`w-full flex items-center gap-2 border rounded-lg p-3 hover:bg-secondary/50 transition-colors ${
                selectedProvider === 'Clio' ? 'border-primary/50 bg-secondary/50' : ''
              }`}
            >
              <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <LogIn className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium">Clio</h3>
                <p className="text-xs text-muted-foreground">Practice management, client intake, and billing</p>
              </div>
              {selectedProvider === 'Clio' && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </button>
            
            <button 
              onClick={() => setSelectedProvider('Lawmatics')}
              className={`w-full flex items-center gap-2 border rounded-lg p-3 hover:bg-secondary/50 transition-colors ${
                selectedProvider === 'Lawmatics' ? 'border-primary/50 bg-secondary/50' : ''
              }`}
            >
              <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <LogIn className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium">Lawmatics</h3>
                <p className="text-xs text-muted-foreground">CRM and client intake automation</p>
              </div>
              {selectedProvider === 'Lawmatics' && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </button>
          </div>
          
          {selectedProvider && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Note:</p>
                <p>This is a mock integration. In a production environment, you would be redirected to authenticate with {selectedProvider}.</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleConnect} 
            disabled={!selectedProvider || isConnecting}
          >
            {isConnecting ? (
              <>
                <span className="mr-2">Connecting...</span>
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              </>
            ) : (
              'Connect'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CRMIntegration;
