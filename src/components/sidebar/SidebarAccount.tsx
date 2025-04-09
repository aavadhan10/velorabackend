
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { LogIn, LogOut } from 'lucide-react';

interface SidebarAccountProps {
  isAttorneyLoggedIn: boolean;
  isManagingPartnerLoggedIn: boolean;
  userType?: 'attorney' | 'managingPartner';
  onLogout?: () => void;
}

const SidebarAccount: React.FC<SidebarAccountProps> = ({
  isAttorneyLoggedIn,
  isManagingPartnerLoggedIn,
  userType,
  onLogout
}) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (isAttorneyLoggedIn) {
      navigate('/attorney-dashboard');
    } else if (isManagingPartnerLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/managing-partner-login');
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-3">Account</SidebarGroupLabel>
      <SidebarMenu>
        {(isAttorneyLoggedIn || isManagingPartnerLoggedIn) ? (
          <>
            {userType === 'managingPartner' && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="px-3 cursor-pointer"
                  onClick={() => navigate('/attorney-login')}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  <span>Attorney Portal</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {userType === 'attorney' && (
              <SidebarMenuItem>
                <SidebarMenuButton 
                  className="px-3 cursor-pointer"
                  onClick={() => navigate('/managing-partner-login')}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  <span>Managing Partner Portal</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton 
                className="px-3 cursor-pointer text-destructive"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        ) : (
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="px-3 cursor-pointer"
              onClick={handleLoginClick}
            >
              <LogIn className="h-4 w-4 mr-2" />
              <span>Log In</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarAccount;
