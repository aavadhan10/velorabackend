
import { Upload, Database, FileSpreadsheet } from 'lucide-react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useDialogs } from '../../App';

// Remove props interface since we'll use context
const SidebarDataSources = () => {
  const { handleToolSelect } = useDialogs();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Data Sources</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleToolSelect('uploadData')}
              tooltip="Upload Data"
            >
              <Upload className="mr-2" />
              <span>Upload Data</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleToolSelect('connectCRM')}
              tooltip="Connect CRM"
            >
              <Database className="mr-2" />
              <span>Connect CRM</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleToolSelect('spreadsheetImport')}
              tooltip="Spreadsheet Import"
            >
              <FileSpreadsheet className="mr-2" />
              <span>Spreadsheet Import</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarDataSources;
