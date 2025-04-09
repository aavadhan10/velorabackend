
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarChart3, LineChart, PieChart, Table, Check } from 'lucide-react';
import { toast } from 'sonner';
import { CSVData, VisualizationType } from '../../types';

interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CSVData;
  onAddWidget: (title: string, type: VisualizationType, columns: string[], colorScheme: string) => void;
}

const COLOR_SCHEMES = [
  { name: 'Default', value: 'default', colors: ['#3182CE', '#805AD5', '#D53F8C', '#DD6B20', '#38A169'] },
  { name: 'Pastel', value: 'pastel', colors: ['#E5DEFF', '#FFDEE2', '#FDE1D3', '#F2FCE2', '#D3E4FD'] },
  { name: 'Vibrant', value: 'vibrant', colors: ['#8B5CF6', '#EC4899', '#F97316', '#10B981', '#0EA5E9'] },
  { name: 'Cool', value: 'cool', colors: ['#0EA5E9', '#06B6D4', '#14B8A6', '#10B981', '#047857'] },
  { name: 'Warm', value: 'warm', colors: ['#F97316', '#F59E0B', '#FBBF24', '#F43F5E', '#D946EF'] }
];

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({
  open,
  onOpenChange,
  data,
  onAddWidget
}) => {
  const [newWidgetTitle, setNewWidgetTitle] = useState('');
  const [selectedWidgetType, setSelectedWidgetType] = useState<VisualizationType>('bar');
  const [selectedDataColumns, setSelectedDataColumns] = useState<string[]>([]);
  const [selectedColorScheme, setSelectedColorScheme] = useState('default');
  
  const createCustomWidget = useCallback(() => {
    if (!newWidgetTitle || selectedDataColumns.length === 0) {
      toast.error('Please provide a title and select at least one column');
      return;
    }
    
    onAddWidget(newWidgetTitle, selectedWidgetType, selectedDataColumns, selectedColorScheme);
    onOpenChange(false);
    setNewWidgetTitle('');
    setSelectedDataColumns([]);
  }, [newWidgetTitle, selectedDataColumns, selectedWidgetType, selectedColorScheme, onAddWidget, onOpenChange]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background">
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Widget Title</label>
            <input 
              type="text" 
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="Enter widget title"
              value={newWidgetTitle}
              onChange={e => setNewWidgetTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Visualization Type</label>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={selectedWidgetType === 'bar' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setSelectedWidgetType('bar')}
                className="flex items-center gap-1"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Bar</span>
              </Button>
              <Button 
                variant={selectedWidgetType === 'line' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setSelectedWidgetType('line')}
                className="flex items-center gap-1"
              >
                <LineChart className="h-4 w-4" />
                <span>Line</span>
              </Button>
              <Button 
                variant={selectedWidgetType === 'pie' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setSelectedWidgetType('pie')}
                className="flex items-center gap-1"
              >
                <PieChart className="h-4 w-4" />
                <span>Pie</span>
              </Button>
              <Button 
                variant={selectedWidgetType === 'table' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setSelectedWidgetType('table')}
                className="flex items-center gap-1"
              >
                <Table className="h-4 w-4" />
                <span>Table</span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Color Scheme</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COLOR_SCHEMES.map((scheme) => (
                <Button
                  key={scheme.value}
                  variant={selectedColorScheme === scheme.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedColorScheme(scheme.value)}
                  className="flex justify-between items-center h-12"
                >
                  <span>{scheme.name}</span>
                  <div className="flex gap-1">
                    {scheme.colors.slice(0, 3).map((color, idx) => (
                      <div
                        key={idx}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    {selectedColorScheme === scheme.value && (
                      <Check className="h-3 w-3 ml-1" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Data Columns</label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
              {data.headers.map(column => (
                <Button
                  key={column}
                  variant={selectedDataColumns.includes(column) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (selectedDataColumns.includes(column)) {
                      setSelectedDataColumns(prev => prev.filter(c => c !== column));
                    } else {
                      setSelectedDataColumns(prev => [...prev, column]);
                    }
                  }}
                >
                  {column}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={createCustomWidget}>Create Widget</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
