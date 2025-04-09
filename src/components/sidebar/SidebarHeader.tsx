
import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';

interface SidebarHeaderProps {
  dataLoaded: boolean;
  fileName?: string;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ dataLoaded, fileName }) => {
  if (!dataLoaded) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="px-3">Data Source</SidebarGroupLabel>
        <div className="px-3 py-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            {/* Simple Purple Scale of Justice */}
            <svg width="16" height="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <g transform="translate(24, 24)">
                {/* Center post */}
                <rect x="-1.5" y="-20" width="3" height="40" fill="#9b87f5" />
                
                {/* Balance beam */}
                <rect x="-20" y="-8" width="40" height="2.5" fill="#9b87f5" rx="1" />
                
                {/* Left scale dish */}
                <path d="M-20,-6 C-20,-6 -15,0 -10,0 C-5,0 0,-6 0,-6" 
                      stroke="#9b87f5" strokeWidth="2" fill="none" />
                <ellipse cx="-10" cy="0" rx="6" ry="2" fill="#9b87f5" opacity="0.7" />
                
                {/* Right scale dish */}
                <path d="M0,-6 C0,-6 5,0 10,0 C15,0 20,-6 20,-6" 
                      stroke="#9b87f5" strokeWidth="2" fill="none" />
                <ellipse cx="10" cy="0" rx="6" ry="2" fill="#9b87f5" opacity="0.7" />
                
                {/* Base */}
                <path d="M-6,20 L6,20 L4,15 L-4,15 Z" fill="#9b87f5" />
              </g>
            </svg>
            <span>No data loaded</span>
          </div>
        </div>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-3">Data Source</SidebarGroupLabel>
      <div className="px-3 py-2 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="h-4 w-4" />
          <span className="truncate">{fileName || 'Uploaded CSV'}</span>
        </div>
      </div>
    </SidebarGroup>
  );
};

export default SidebarHeader;
