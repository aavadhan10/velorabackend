
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Loader, Save, Plus, ArrowUpDown, ArrowDownUp } from 'lucide-react';
import { toast } from 'sonner';
import { CSVData } from '../../types';

export interface CustomFilter {
  id: string;
  name: string;
  column: string;
  operator: 'equals' | 'contains' | 'greater' | 'less';
  value: string;
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CSVData;
  timeFilter: string;
  practiceAreaFilter: string;
  matterTypeFilter: string;
  attorneyFilter: string;
  minRevenueFilter: string;
  maxRevenueFilter: string;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  customFilters: CustomFilter[];
  practiceAreas: string[];
  matterTypes: string[];
  attorneys: string[];
  onTimeFilterChange: (value: string) => void;
  onPracticeAreaFilterChange: (value: string) => void;
  onMatterTypeFilterChange: (value: string) => void;
  onAttorneyFilterChange: (value: string) => void;
  onMinRevenueFilterChange: (value: string) => void;
  onMaxRevenueFilterChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onSortDirectionChange: (value: 'asc' | 'desc') => void;
  onCustomFiltersChange: (filters: CustomFilter[]) => void;
  onApplyFilters: () => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  data,
  timeFilter,
  practiceAreaFilter,
  matterTypeFilter,
  attorneyFilter,
  minRevenueFilter,
  maxRevenueFilter,
  sortBy,
  sortDirection,
  customFilters,
  practiceAreas,
  matterTypes,
  attorneys,
  onTimeFilterChange,
  onPracticeAreaFilterChange,
  onMatterTypeFilterChange,
  onAttorneyFilterChange,
  onMinRevenueFilterChange,
  onMaxRevenueFilterChange,
  onSortByChange,
  onSortDirectionChange,
  onCustomFiltersChange,
  onApplyFilters
}) => {
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');
  const [newFilterColumn, setNewFilterColumn] = useState('');
  const [newFilterOperator, setNewFilterOperator] = useState<'equals' | 'contains' | 'greater' | 'less'>('equals');
  const [newFilterValue, setNewFilterValue] = useState('');
  
  // Add a new custom filter
  const addCustomFilter = useCallback(() => {
    if (!newFilterName || !newFilterColumn || !newFilterValue) {
      toast.error('Please provide name, column and value for the custom filter');
      return;
    }
    
    const newFilter: CustomFilter = {
      id: `filter-${Date.now()}`,
      name: newFilterName,
      column: newFilterColumn,
      operator: newFilterOperator,
      value: newFilterValue
    };
    
    onCustomFiltersChange([...customFilters, newFilter]);
    setNewFilterName('');
    setNewFilterColumn('');
    setNewFilterValue('');
    toast.success('Custom filter added');
  }, [newFilterName, newFilterColumn, newFilterOperator, newFilterValue, customFilters, onCustomFiltersChange]);
  
  // Remove a custom filter
  const removeCustomFilter = useCallback((id: string) => {
    onCustomFiltersChange(customFilters.filter(f => f.id !== id));
    toast.success('Custom filter removed');
  }, [customFilters, onCustomFiltersChange]);
  
  // Handle filter application with optimized loading state
  const handleApplyFilters = useCallback(() => {
    setIsApplyingFilters(true);
    
    // Simulate filter application with short delay to prevent UI blocking
    setTimeout(() => {
      onApplyFilters();
      setIsApplyingFilters(false);
      onOpenChange(false);
    }, 300);
  }, [onApplyFilters, onOpenChange]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-auto bg-background">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>
            Filter your data for more focused analysis
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="standard">
          <TabsList className="mb-4">
            <TabsTrigger value="standard">Standard Filters</TabsTrigger>
            <TabsTrigger value="custom">Custom Filters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard" className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeFilter} onValueChange={onTimeFilterChange}>
                <SelectTrigger className="bg-background border border-input">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  <SelectItem value="Last Month">Last Month</SelectItem>
                  <SelectItem value="Last Quarter">Last Quarter</SelectItem>
                  <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
                  <SelectItem value="Year to Date">Year to Date</SelectItem>
                  <SelectItem value="Last Year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Practice Area</label>
              <Select value={practiceAreaFilter} onValueChange={onPracticeAreaFilterChange}>
                <SelectTrigger className="bg-background border border-input">
                  <SelectValue placeholder="Select practice area" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {practiceAreas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Matter Type</label>
              <Select value={matterTypeFilter} onValueChange={onMatterTypeFilterChange}>
                <SelectTrigger className="bg-background border border-input">
                  <SelectValue placeholder="Select matter type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {matterTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Attorney</label>
              <Select value={attorneyFilter} onValueChange={onAttorneyFilterChange}>
                <SelectTrigger className="bg-background border border-input">
                  <SelectValue placeholder="Select attorney" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {attorneys.map(attorney => (
                    <SelectItem key={attorney} value={attorney}>{attorney}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Revenue</label>
                <input
                  type="number"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="0"
                  value={minRevenueFilter}
                  onChange={e => onMinRevenueFilterChange(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Revenue</label>
                <input
                  type="number"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="No limit"
                  value={maxRevenueFilter}
                  onChange={e => onMaxRevenueFilterChange(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <div className="flex items-center space-x-2">
                <Select value={sortBy} onValueChange={onSortByChange}>
                  <SelectTrigger className="w-full bg-background border border-input">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="hours">Billable Hours</SelectItem>
                    <SelectItem value="clients">Client Count</SelectItem>
                    <SelectItem value="matters">Matter Count</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="flex-shrink-0"
                >
                  {sortDirection === 'asc' ? (
                    <ArrowUpDown className="h-4 w-4" />
                  ) : (
                    <ArrowDownUp className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4 py-2">
            <div className="border rounded-lg p-4 bg-secondary/10">
              <h3 className="text-sm font-medium mb-3">Add Custom Filter</h3>
              
              <div className="grid gap-3 mb-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Filter Name</label>
                    <Input
                      placeholder="High Value Clients"
                      value={newFilterName}
                      onChange={e => setNewFilterName(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium mb-1 block">Column</label>
                    <Select value={newFilterColumn} onValueChange={setNewFilterColumn}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.headers.map(header => (
                          <SelectItem key={header} value={header}>{header}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Operator</label>
                    <Select 
                      value={newFilterOperator} 
                      onValueChange={(val: 'equals' | 'contains' | 'greater' | 'less') => setNewFilterOperator(val)}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="greater">Greater than</SelectItem>
                        <SelectItem value="less">Less than</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium mb-1 block">Value</label>
                    <Input
                      placeholder="Filter value"
                      value={newFilterValue}
                      onChange={e => setNewFilterValue(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={addCustomFilter} 
                className="w-full h-8 text-sm"
                size="sm"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Filter
              </Button>
            </div>
            
            {customFilters.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-secondary/20 py-2 px-3 font-medium text-sm">Custom Filters</div>
                <div className="divide-y divide-border">
                  {customFilters.map(filter => (
                    <div key={filter.id} className="px-3 py-2 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{filter.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {filter.column} {filter.operator} "{filter.value}"
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeCustomFilter(filter.id)}
                        className="h-7 w-7 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm bg-secondary/10 rounded-lg">
                <p>No custom filters added yet</p>
                <p className="text-xs mt-1">Create a filter above</p>
              </div>
            )}
            
            {customFilters.length > 0 && (
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    onCustomFiltersChange([]);
                    toast.success('All custom filters cleared');
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleApplyFilters} disabled={isApplyingFilters}>
            {isApplyingFilters ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Applying...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Apply Filters
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
