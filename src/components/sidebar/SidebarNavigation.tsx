
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Sparkles, Layers, BellRing, CalendarDays, Users, FileText } from 'lucide-react';

const SidebarNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-3">Main Navigation</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton 
            className="px-3 cursor-pointer"
            onClick={() => navigate('/ai-assistant')}
            isActive={isActive('/ai-assistant')}
            tooltip="AI Assistant"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            <span>AI Assistant</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            className="px-3 cursor-pointer"
            onClick={() => navigate('/dashboard')}
            isActive={isActive('/dashboard')}
            tooltip="Create Custom Reports"
          >
            <Layers className="h-4 w-4 mr-2" />
            <span>Create Custom Reports</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            className="px-3 cursor-pointer"
            onClick={() => navigate('/notifications-and-deadlines')}
            isActive={isActive('/notifications-and-deadlines')}
            tooltip="Notifications & Deadlines"
          >
            <BellRing className="h-4 w-4 mr-2" />
            <span>Notifications & Deadlines</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            className="px-3 cursor-pointer"
            onClick={() => navigate('/calendar')}
            isActive={isActive('/calendar')}
            tooltip="Calendar"
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            <span>Calendar</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            className="px-3 cursor-pointer"
            onClick={() => navigate('/client-manager')}
            isActive={isActive('/client-manager')}
            tooltip="Client Manager"
          >
            <Users className="h-4 w-4 mr-2" />
            <span>Client Manager</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton 
            className="px-3 cursor-pointer"
            onClick={() => navigate('/reports')}
            isActive={isActive('/reports')}
            tooltip="Reports Library"
          >
            <FileText className="h-4 w-4 mr-2" />
            <span>Reports Library</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SidebarNavigation;
