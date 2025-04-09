
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, Database, LogIn, Loader, FileText } from 'lucide-react';
import DragDropZone from './DragDropZone';
import { CSVData } from '../types';
import { toast } from 'sonner';

interface DataSourceSelectorProps {
  onCSVDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onClioConnect: (credentials: { email: string; apiKey: string }) => void;
  isLoading: boolean;
  error: string | null;
}

const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({
  onCSVDrop,
  onClioConnect,
  isLoading,
  error
}) => {
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [clioLoading, setClioLoading] = useState(false);
  
  // Handle demo data upload
  const handleDemoDataUpload = useCallback(() => {
    // Create a synthetic drag event with demo data
    const mockEvent = new Event('dragEvent', { bubbles: true }) as unknown as React.DragEvent<HTMLDivElement>;
    
    // Add the necessary properties for the drag event
    Object.defineProperty(mockEvent, 'dataTransfer', {
      value: {
        files: [
          new File(
            [
              'Client,Matter,Status,Hours,Revenue,Date\n' +
              'Acme Corp,Contract Review,Active,12,3600,2023-09-15\n' +
              'Globex LLC,IP Litigation,Active,28,9800,2023-09-18\n' +
              'Smith Family,Estate Planning,Completed,5,1250,2023-09-10\n' +
              'TechStart Inc,Incorporation,Completed,8,2000,2023-09-05\n' +
              'Johnson & Co,Employment Dispute,Active,18,5400,2023-09-20'
            ],
            'demo-data.csv',
            { type: 'text/csv' }
          )
        ]
      }
    });
    
    toast.info('Loading demo data...');
    
    // Trigger the CSV drop handler with our mock event
    setTimeout(() => onCSVDrop(mockEvent), 100);
  }, [onCSVDrop]);
  
  // Add file input reference and click handler
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast.error('Please upload a CSV file');
        return;
      }
      
      // Create a synthetic drag event with the selected file
      const mockEvent = new Event('dragEvent', { bubbles: true }) as unknown as React.DragEvent<HTMLDivElement>;
      
      // Add the dataTransfer property to the event
      Object.defineProperty(mockEvent, 'dataTransfer', {
        value: {
          files: [file]
        }
      });
      
      // Process the file
      onCSVDrop(mockEvent);
    }
  };
  
  // Optimized connection handler with useCallback
  const handleClioConnect = useCallback(() => {
    if (!email || !apiKey) {
      toast.error('Please provide both email and API key');
      return;
    }
    
    setClioLoading(true);
    
    // Connect to Clio with shorter delay
    setTimeout(() => {
      onClioConnect({ email, apiKey });
      setClioLoading(false);
    }, 300);
  }, [email, apiKey, onClioConnect]);
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="csv" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="csv" className="text-center py-3">
            <UploadCloud className="h-4 w-4 mr-2 inline-block" />
            CSV Upload
          </TabsTrigger>
          <TabsTrigger value="clio" className="text-center py-3">
            <Database className="h-4 w-4 mr-2 inline-block" />
            Real Time Data
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="csv" className="mt-0">
          <DragDropZone 
            onFileDrop={onCSVDrop}
            isLoading={isLoading}
            error={error}
          />
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".csv"
            onChange={handleFileInputChange}
          />
          
          {/* Demo data and upload buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={handleDemoDataUpload}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Load Demo Data
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="h-4 w-4" />
              )}
              Upload CSV File
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="clio" className="mt-0">
          <div className="min-h-[60vh] w-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Database className="h-8 w-8 text-primary" />
            </div>
            
            <h3 className="text-2xl font-medium mb-6">Connect to Clio</h3>
            <p className="text-center text-muted-foreground mb-8 max-w-md">
              Access your Clio practice management data directly for real-time analytics and visualization.
            </p>
            
            <div className="w-full max-w-md space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-4 py-2"
                  placeholder="Your Clio account email"
                />
              </div>
              
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium mb-1">API Key</label>
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-4 py-2"
                  placeholder="Your Clio API key"
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleClioConnect}
                disabled={clioLoading}
              >
                {clioLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Connect to Clio
                  </>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                Your credentials are securely processed and never stored on our servers.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataSourceSelector;
