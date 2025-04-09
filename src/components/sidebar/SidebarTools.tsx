
import { Bell, Settings, HelpCircle, Download, Share2, Shield } from 'lucide-react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

interface SidebarToolsProps {
  onToolSelect: (tool: string) => void;
}

const SidebarTools: React.FC<SidebarToolsProps> = ({ onToolSelect }) => {
  const handleDownloadReports = () => {
    onToolSelect('downloadReports');
  };

  const handleShareWithFirm = () => {
    onToolSelect('shareWithFirm');
  };

  const handleManagePermissions = () => {
    onToolSelect('permissions');
  };

  const handleSettings = () => {
    onToolSelect('settings');
  };

  const handleHelpAndSupport = () => {
    onToolSelect('help');
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Tools</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleDownloadReports}
              tooltip="Download Reports"
            >
              <Download className="mr-2" />
              <span>Download Reports</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleShareWithFirm}
              tooltip="Share with Firm"
            >
              <Share2 className="mr-2" />
              <span>Share with Firm</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleManagePermissions}
              tooltip="Manage Permissions"
            >
              <Shield className="mr-2" />
              <span>Manage Permissions</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSettings}
              tooltip="Settings"
            >
              <Settings className="mr-2" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleHelpAndSupport}
              tooltip="Help & Support"
            >
              <HelpCircle className="mr-2" />
              <span>Help & Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarTools;
