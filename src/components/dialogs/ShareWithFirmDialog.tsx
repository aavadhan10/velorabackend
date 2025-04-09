
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Share2 } from "lucide-react";

interface Dashboard {
  id: string;
  name: string;
}

// Mock dashboards data
const mockDashboards: Dashboard[] = [
  { id: 'dashboard-1', name: 'Client Satisfaction Overview' },
  { id: 'dashboard-2', name: 'Litigation Performance' },
  { id: 'dashboard-3', name: 'Attorney Productivity' },
  { id: 'dashboard-4', name: 'Revenue Analytics' },
  { id: 'dashboard-5', name: 'Marketing Campaign Results' },
];

interface ShareWithFirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShareWithFirmDialog = ({ open, onOpenChange }: ShareWithFirmDialogProps) => {
  const [selectedDashboards, setSelectedDashboards] = useState<string[]>([]);
  const [shareWithAll, setShareWithAll] = useState(false);
  const [message, setMessage] = useState('');
  
  const toggleDashboardSelection = (dashboardId: string) => {
    setSelectedDashboards(prev => 
      prev.includes(dashboardId) 
        ? prev.filter(id => id !== dashboardId) 
        : [...prev, dashboardId]
    );
  };
  
  const handleShareWithFirm = () => {
    const dashboardNames = selectedDashboards
      .map(id => mockDashboards.find(d => d.id === id)?.name)
      .filter(Boolean)
      .join(', ');
    
    const recipients = shareWithAll ? "all firm members" : "selected team members";
    
    if (selectedDashboards.length > 0) {
      toast.success(`Dashboards shared with ${recipients}`, {
        description: `Shared: ${dashboardNames}`
      });
      
      // Reset form and close dialog
      setSelectedDashboards([]);
      setShareWithAll(false);
      setMessage('');
      onOpenChange(false);
    } else {
      toast.error('Please select at least one dashboard to share');
    }
  };
  
  const handleSelectAll = () => {
    if (selectedDashboards.length === mockDashboards.length) {
      setSelectedDashboards([]);
    } else {
      setSelectedDashboards(mockDashboards.map(d => d.id));
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share with Firm</DialogTitle>
          <DialogDescription>
            Select dashboards to share with your colleagues
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Select Dashboards</label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSelectAll}
                className="text-xs h-8"
              >
                {selectedDashboards.length === mockDashboards.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
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
          
          <div>
            <label className="text-sm font-medium">Add a Message (Optional)</label>
            <Input
              className="mt-1"
              placeholder="Enter a message to accompany your shared dashboards"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="share-with-all"
              checked={shareWithAll}
              onCheckedChange={(checked) => setShareWithAll(checked as boolean)}
            />
            <label htmlFor="share-with-all" className="text-sm cursor-pointer">
              Share with all firm members
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleShareWithFirm} 
            disabled={selectedDashboards.length === 0}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share with Firm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareWithFirmDialog;
