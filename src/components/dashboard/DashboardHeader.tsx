import React, { useCallback, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter, BookOpen, Shield, FilePlus, Save, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole, LLMProvider } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

// Mock dashboards data
const mockDashboards = [
  { id: 'dashboard-1', name: 'Client Satisfaction Overview' },
  { id: 'dashboard-2', name: 'Litigation Performance' },
  { id: 'dashboard-3', name: 'Attorney Productivity' },
  { id: 'dashboard-4', name: 'Revenue Analytics' },
  { id: 'dashboard-5', name: 'Marketing Campaign Results' },
];

interface DashboardHeaderProps {
  userRole: UserRole;
  llmProvider: LLMProvider;
  selectedModel: string;
  onRoleChange: (role: UserRole) => void;
  onLlmProviderChange: (provider: LLMProvider) => void;
  onModelChange: (model: string) => void;
  onAddWidgetClick: () => void;
  onFiltersClick: () => void;
  onPermissionsClick?: () => void;
  llmModels: Record<LLMProvider, string[]>;
  onSaveToReports?: () => void;
  onShareReportsClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userRole,
  llmProvider,
  selectedModel,
  onRoleChange,
  onLlmProviderChange,
  onModelChange,
  onAddWidgetClick,
  onFiltersClick,
  onPermissionsClick,
  llmModels,
  onSaveToReports,
  onShareReportsClick
}) => {
  const navigate = useNavigate();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [reportName, setReportName] = useState(`Dashboard-${new Date().toISOString().slice(0, 10)}`);
  const [selectedDashboards, setSelectedDashboards] = useState<string[]>([]);
  const [recipientEmail, setRecipientEmail] = useState('');

  // Optimized role change handler
  const handleRoleChange = useCallback((val: UserRole) => {
    onRoleChange(val);
  }, [onRoleChange]);

  // Optimized LLM provider change handler
  const handleLlmProviderChange = useCallback((val: LLMProvider) => {
    onLlmProviderChange(val);
    toast.success(`Switched to ${val} for analysis`);
  }, [onLlmProviderChange]);

  // Optimized model change handler
  const handleModelChange = useCallback((val: string) => {
    onModelChange(val);
    toast.success(`Model updated to ${val}`);
  }, [onModelChange]);

  // Handle reports navigation
  const handleReportsClick = useCallback(() => {
    navigate('/reports');
    toast.success('Opening Reports Library');
  }, [navigate]);

  // Open save dialog
  const openSaveDialog = useCallback(() => {
    setSaveDialogOpen(true);
  }, []);

  // Open share dialog
  const openShareDialog = useCallback(() => {
    setShareDialogOpen(true);
  }, []);

  // Handle dashboard selection
  const toggleDashboardSelection = (dashboardId: string) => {
    setSelectedDashboards(prev => 
      prev.includes(dashboardId) 
        ? prev.filter(id => id !== dashboardId) 
        : [...prev, dashboardId]
    );
  };

  // Handle save to reports
  const handleSaveToReports = useCallback(() => {
    // Close the dialog
    setSaveDialogOpen(false);
    
    // Call the parent handler if provided
    if (onSaveToReports) {
      onSaveToReports();
    }
    
    // Show success message and navigate to reports
    toast.success(`Dashboard saved as "${reportName}"`, {
      description: 'Your dashboard has been added to the reports library'
    });
    
    // Navigate to reports page after a short delay to allow the toast to be seen
    setTimeout(() => {
      navigate('/reports');
    }, 1500);
  }, [onSaveToReports, reportName, navigate]);

  // Handle share reports
  const handleShareReports = useCallback(() => {
    // Close the dialog
    setShareDialogOpen(false);
    
    // Show success message
    if (selectedDashboards.length > 0 && recipientEmail) {
      const dashboardNames = selectedDashboards
        .map(id => mockDashboards.find(d => d.id === id)?.name)
        .filter(Boolean)
        .join(', ');
      
      toast.success(`Dashboards shared with ${recipientEmail}`, {
        description: `Shared: ${dashboardNames}`
      });
    } else {
      toast.error('Please select at least one dashboard and provide a recipient email');
    }
    
    // Reset form
    setSelectedDashboards([]);
    setRecipientEmail('');
    
    // Call the parent handler if provided
    if (onShareReportsClick) {
      onShareReportsClick();
    }
  }, [selectedDashboards, recipientEmail, onShareReportsClick]);

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 48 48" className="velora-logo">
            <g transform="translate(24, 24)">
              <rect x="-1.5" y="-20" width="3" height="40" fill="#9b87f5" />
              
              <rect x="-20" y="-8" width="40" height="2.5" fill="#9b87f5" rx="1" />
              
              <path d="M-20,-6 C-20,-6 -15,0 -10,0 C-5,0 0,-6 0,-6" 
                    stroke="#9b87f5" strokeWidth="2" fill="none" />
              <ellipse cx="-10" cy="0" rx="6" ry="2" fill="#9b87f5" opacity="0.7" />
              
              <path d="M0,-6 C0,-6 5,0 10,0 C15,0 20,-6 20,-6" 
                    stroke="#9b87f5" strokeWidth="2" fill="none" />
              <ellipse cx="10" cy="0" rx="6" ry="2" fill="#9b87f5" opacity="0.7" />
              
              <path d="M-6,20 L6,20 L4,15 L-4,15 Z" fill="#9b87f5" />
            </g>
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-primary">Velora AI Analytics</h2>
          <p className="text-muted-foreground">Data-driven insights for your law practice</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select value={userRole} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[180px] bg-background border border-input">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            <SelectItem value="Law Partner">Managing Partner</SelectItem>
            <SelectItem value="Operations Manager">Operations Manager</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={llmProvider} onValueChange={handleLlmProviderChange}>
          <SelectTrigger className="w-[180px] bg-background border border-input">
            <SelectValue placeholder="Select LLM" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            <SelectItem value="OpenAI">OpenAI</SelectItem>
            <SelectItem value="Claude">Claude</SelectItem>
            <SelectItem value="ChatGPT">ChatGPT</SelectItem>
            <SelectItem value="Velora">Velora (beta)</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={selectedModel} 
          onValueChange={handleModelChange}
        >
          <SelectTrigger className="w-[180px] bg-background border border-input">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            {llmModels[llmProvider].map(model => (
              <SelectItem key={model} value={model}>{model}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="secondary" className="space-x-2" onClick={openSaveDialog}>
          <Save className="h-4 w-4" />
          <span>Save to Reports</span>
        </Button>
        
        <Button variant="secondary" className="space-x-2" onClick={openShareDialog}>
          <Share2 className="h-4 w-4" />
          <span>Share Reports</span>
        </Button>
        
        <Button variant="outline" className="space-x-2" onClick={handleReportsClick}>
          <BookOpen className="h-4 w-4" />
          <span>Reports Library</span>
        </Button>
        
        <Button variant="outline" className="space-x-2" onClick={onAddWidgetClick}>
          <PlusCircle className="h-4 w-4" />
          <span>Add Widget</span>
        </Button>
        
        <Button variant="outline" className="space-x-2" onClick={onFiltersClick}>
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
        
        {onPermissionsClick && (
          <Button variant="outline" className="space-x-2" onClick={onPermissionsClick}>
            <Shield className="h-4 w-4" />
            <span>Permissions</span>
          </Button>
        )}
      </div>
      
      {/* Save to Reports Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Dashboard to Reports</DialogTitle>
            <DialogDescription>
              Enter a name for this dashboard report
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Report name"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveToReports} disabled={!reportName.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Save Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Share Reports Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Reports</DialogTitle>
            <DialogDescription>
              Select dashboards to share with colleagues
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Recipient Email</label>
              <Input
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="colleague@lawfirm.com"
                className="w-full mt-1"
                type="email"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Dashboards</label>
              <div className="border rounded-md p-3 max-h-56 overflow-y-auto space-y-2">
                {mockDashboards.map(dashboard => (
                  <div key={dashboard.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={dashboard.id}
                      checked={selectedDashboards.includes(dashboard.id)}
                      onCheckedChange={() => toggleDashboardSelection(dashboard.id)}
                    />
                    <label 
                      htmlFor={dashboard.id} 
                      className="text-sm cursor-pointer"
                    >
                      {dashboard.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleShareReports} 
              disabled={selectedDashboards.length === 0 || !recipientEmail.trim()}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Selected
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardHeader;
