
import React from 'react';
import { Button } from '@/components/ui/button';
import { CustomFilter } from './FilterDialog';

interface ActiveFiltersProps {
  practiceAreaFilter: string;
  matterTypeFilter: string;
  attorneyFilter: string;
  customFilters: CustomFilter[];
  onEditFilters: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  practiceAreaFilter,
  matterTypeFilter,
  attorneyFilter,
  customFilters,
  onEditFilters
}) => {
  if (practiceAreaFilter === 'All Areas' && 
      matterTypeFilter === 'All Types' && 
      attorneyFilter === 'All Attorneys' && 
      customFilters.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <div className="text-sm text-muted-foreground mr-2">Active filters:</div>
      
      {practiceAreaFilter !== 'All Areas' && (
        <div className="bg-secondary/40 text-xs px-2 py-1 rounded-full flex items-center">
          <span>Practice: {practiceAreaFilter}</span>
        </div>
      )}
      
      {matterTypeFilter !== 'All Types' && (
        <div className="bg-secondary/40 text-xs px-2 py-1 rounded-full flex items-center">
          <span>Matter: {matterTypeFilter}</span>
        </div>
      )}
      
      {attorneyFilter !== 'All Attorneys' && (
        <div className="bg-secondary/40 text-xs px-2 py-1 rounded-full flex items-center">
          <span>Attorney: {attorneyFilter}</span>
        </div>
      )}
      
      {customFilters.map(filter => (
        <div key={filter.id} className="bg-primary/20 text-xs px-2 py-1 rounded-full flex items-center">
          <span>{filter.name}</span>
        </div>
      ))}
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-xs px-2 py-1 h-auto"
        onClick={onEditFilters}
      >
        Edit Filters
      </Button>
    </div>
  );
};

export default ActiveFilters;
