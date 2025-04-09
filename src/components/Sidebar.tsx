
import React from 'react';
import { 
  Sidebar as SidebarContainer, 
  SidebarContent, 
  SidebarHeader as UISidebarHeader, 
  SidebarTrigger
} from '@/components/ui/sidebar';

// Import the smaller components
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarNavigation from './sidebar/SidebarNavigation';
import SidebarDataSources from './sidebar/SidebarDataSources';
import SidebarTools from './sidebar/SidebarTools';
import SidebarAccount from './sidebar/SidebarAccount';

interface SidebarProps {
  fileName?: string;
  dataLoaded: boolean;
  onVisualizationSelect: (type: string) => void;
  onToolSelect: (tool: string) => void;
  onLogout?: () => void;
  userType?: 'attorney' | 'managingPartner';
}

const Sidebar: React.FC<SidebarProps> = ({ 
  fileName, 
  dataLoaded, 
  onVisualizationSelect,
  onLogout,
  userType,
  onToolSelect
}) => {
  const isAttorneyLoggedIn = localStorage.getItem('attorneyLoggedIn') === 'true';
  const isManagingPartnerLoggedIn = localStorage.getItem('managingPartnerLoggedIn') === 'true';
  
  return (
    <SidebarContainer>
      <UISidebarHeader className="px-2 py-4">
        <div className="flex items-center space-x-2 px-3">
          <div className="h-8 w-8 rounded-md flex items-center justify-center">
            {/* Simple Purple Scale of Justice */}
            <svg width="32" height="32" viewBox="0 0 48 48" className="velora-logo-small">
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
          </div>
          <div>
            <h3 className="font-medium tracking-tight">Velora AI</h3>
            <p className="text-xs text-muted-foreground">
              {userType === 'managingPartner' 
                ? 'Managing Partner Portal' 
                : userType === 'attorney' 
                  ? 'Attorney Portal' 
                  : 'Analytics Dashboard'}
            </p>
          </div>
        </div>
        <SidebarTrigger className="absolute right-2 top-4 h-8 w-8 border border-border rounded-md" />
      </UISidebarHeader>
      
      <SidebarContent>
        <SidebarHeader dataLoaded={dataLoaded} fileName={fileName} />
        <SidebarNavigation />
        <SidebarDataSources />
        <SidebarTools onToolSelect={onToolSelect} />
        <SidebarAccount 
          isAttorneyLoggedIn={isAttorneyLoggedIn}
          isManagingPartnerLoggedIn={isManagingPartnerLoggedIn}
          userType={userType}
          onLogout={onLogout}
        />
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;
