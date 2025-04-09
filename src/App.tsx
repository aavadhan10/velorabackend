
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import { toast } from "sonner";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AttorneyLogin from "./pages/AttorneyLogin";
import AttorneyDashboard from "./pages/AttorneyDashboard";
import ManagingPartnerLogin from "./pages/ManagingPartnerLogin";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ClientSatisfactionDashboard from "./pages/ClientSatisfactionDashboard";
import LitigationDashboard from "./pages/LitigationDashboard";
import MarketingDashboard from "./pages/MarketingDashboard";
import CalendarDialog from "./components/dialogs/CalendarDialog";
import ShareWithFirmDialog from "./components/dialogs/ShareWithFirmDialog";
import AIAssistant from "./pages/AIAssistant";
import ClientManager from "./pages/ClientManager";
import NotificationsAndDeadlines from "./pages/NotificationsAndDeadlines";
import CalendarPage from "./pages/Calendar";

// Create a fresh query client instance
const queryClient = new QueryClient();

// Create context for dialog state and tool handling
interface DialogsContextType {
  calendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;
  shareWithFirmOpen: boolean;
  setShareWithFirmOpen: (open: boolean) => void;
  currentTool: string;
  setCurrentTool: (tool: string) => void;
  handleToolSelect: (tool: string) => void; // Add this to make tool handling accessible globally
}

const DialogsContext = createContext<DialogsContextType>({
  calendarOpen: false,
  setCalendarOpen: () => {},
  shareWithFirmOpen: false,
  setShareWithFirmOpen: () => {},
  currentTool: "",
  setCurrentTool: () => {},
  handleToolSelect: () => {} // Add default empty function
});

// Hook to use dialogs context
export const useDialogs = () => useContext(DialogsContext);

const App = () => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [shareWithFirmOpen, setShareWithFirmOpen] = useState(false);
  const [currentTool, setCurrentTool] = useState("");
  
  // Handle tool selection from sidebar
  const handleToolSelect = (tool: string) => {
    setCurrentTool(tool);
    
    if (tool === 'calendar') {
      setCalendarOpen(true);
    } else if (tool === 'shareWithFirm') {
      setShareWithFirmOpen(true);
    } else if (tool === 'downloadReports') {
      handleDownloadReports();
    } else if (tool === 'permissions') {
      handleManagePermissions();
    } else if (tool === 'settings') {
      handleSettings();
    } else if (tool === 'help') {
      handleHelpAndSupport();
    } else if (tool === 'uploadData') {
      handleUploadData();
    } else if (tool === 'connectCRM') {
      handleConnectCRM();
    } else if (tool === 'spreadsheetImport') {
      handleSpreadsheetImport();
    }
  };
  
  // Tool handler functions
  const handleDownloadReports = () => {
    toast.success("Reports are being prepared for download", {
      description: "Your reports will be ready in a moment."
    });
    
    // Simulate download completion after 2 seconds
    setTimeout(() => {
      toast.success("Reports ready for download", {
        description: "All reports have been prepared successfully.",
        action: {
          label: "Download",
          onClick: () => {
            toast.success("Reports downloaded successfully");
          }
        }
      });
    }, 2000);
  };
  
  const handleManagePermissions = () => {
    toast.info("Permissions Management", {
      description: "The permissions management tool will be available in a future update.",
      action: {
        label: "Learn More",
        onClick: () => {
          toast.info("Coming Soon", {
            description: "Advanced permissions management will be available in our next release."
          });
        }
      }
    });
  };
  
  const handleSettings = () => {
    toast.info("Settings", {
      description: "The settings panel will be available in a future update.",
      action: {
        label: "Preferences",
        onClick: () => {
          toast.info("User Preferences", {
            description: "User preference settings will be available in our next release."
          });
        }
      }
    });
  };
  
  const handleHelpAndSupport = () => {
    toast.info("Help & Support", {
      description: "Our support team is available 24/7 to assist you.",
      action: {
        label: "Contact Support",
        onClick: () => {
          toast.success("Support Request Sent", {
            description: "A support agent will contact you shortly."
          });
        }
      }
    });
  };

  // Data Source tool handlers
  const handleUploadData = () => {
    toast.info("Upload Data", {
      description: "The file upload tool will open shortly.",
      action: {
        label: "Select Files",
        onClick: () => {
          toast.loading("Preparing upload...");
          setTimeout(() => {
            toast.success("Upload ready", {
              description: "You can now select files to upload"
            });
          }, 1000);
        }
      }
    });
  };

  const handleConnectCRM = () => {
    toast.info("Connect CRM", {
      description: "The CRM connection wizard will be available soon.",
      action: {
        label: "View Integrations",
        onClick: () => {
          toast.info("Available Integrations", {
            description: "Salesforce, HubSpot, and Clio integrations are coming soon."
          });
        }
      }
    });
  };

  const handleSpreadsheetImport = () => {
    toast.info("Spreadsheet Import", {
      description: "The spreadsheet import tool is being prepared.",
      action: {
        label: "Import Now",
        onClick: () => {
          toast.loading("Preparing import tool...");
          setTimeout(() => {
            toast.success("Import tool ready", {
              description: "You can now select a spreadsheet to import"
            });
          }, 1500);
        }
      }
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DialogsContext.Provider value={{ 
          calendarOpen, 
          setCalendarOpen,
          shareWithFirmOpen,
          setShareWithFirmOpen,
          currentTool,
          setCurrentTool,
          handleToolSelect // Add the handler to the context
        }}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/attorney-login" element={<AttorneyLogin />} />
              <Route path="/attorney-dashboard" element={<AttorneyDashboard />} />
              <Route path="/managing-partner-login" element={<ManagingPartnerLogin />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/client-satisfaction" element={<ClientSatisfactionDashboard />} />
              <Route path="/litigation-caseload" element={<LitigationDashboard />} />
              <Route path="/marketing-roi" element={<MarketingDashboard />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/client-manager" element={<ClientManager />} />
              <Route path="/notifications-and-deadlines" element={<NotificationsAndDeadlines />} />
              <Route path="/calendar" element={<CalendarPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          
          {/* Global Dialogs */}
          <CalendarDialog 
            open={calendarOpen} 
            onOpenChange={setCalendarOpen} 
          />
          <ShareWithFirmDialog
            open={shareWithFirmOpen}
            onOpenChange={setShareWithFirmOpen}
          />
        </DialogsContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
