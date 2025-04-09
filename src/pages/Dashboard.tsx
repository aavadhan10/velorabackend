import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from '../components/Sidebar';
import { Loader, FileText, Users, Globe, Download, Share2, Briefcase, BookOpen, Shield } from 'lucide-react';
import DataSourceSelector from '../components/DataSourceSelector';
import { useCSVParser } from '../hooks/useCSVParser';
import { useDataAnalysis } from '../hooks/useDataAnalysis';
import { CSVData, DataSummary, VisualizationConfig } from '../types';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useDialogs } from '../App';
import { Toaster } from 'sonner';

const DashboardComponent = lazy(() => import('../components/Dashboard'));

const DashboardPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('managingPartnerLoggedIn') === 'true';
  const { setCalendarOpen, setCurrentTool } = useDialogs();
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/managing-partner-login');
    }
  }, [isLoggedIn, navigate]);

  const [data, setData] = useState<CSVData | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dataSummary, setDataSummary] = useState<DataSummary | null>(null);
  const [visualizations, setVisualizations] = useState<VisualizationConfig[]>([]);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [isConnectingClio, setIsConnectingClio] = useState(false);
  const [selectedVisualization, setSelectedVisualization] = useState<string | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [shareRecipients, setShareRecipients] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [permissionLevels, setPermissionLevels] = useState<Record<string, string>>({
    'team-litigation': 'view',
    'team-corporate': 'view',
    'team-realestate': 'view',
    'team-ip': 'view',
    'partners': 'edit',
  });
  
  const { parseCSVFromDragEvent, isLoading: isLoadingCSV, error: csvError } = useCSVParser();
  const { 
    analyzeData, 
    generateInitialVisualizations, 
    isAnalyzing, 
    error: analysisError 
  } = useDataAnalysis();
  
  const availableReports = [
    { id: 'revenue-q1-2023', name: 'Revenue Analysis Q1 2023', type: 'PDF', size: '4.2 MB', created: '2023-04-15', author: 'John Smith' },
    { id: 'billable-hours-2023', name: 'Billable Hours Report 2023', type: 'XLSX', size: '2.8 MB', created: '2023-05-22', author: 'Sarah Johnson' },
    { id: 'practice-performance', name: 'Practice Area Performance', type: 'PDF', size: '6.1 MB', created: '2023-06-10', author: 'Michael Wong' },
    { id: 'client-acquisition', name: 'Client Acquisition Trends', type: 'PDF', size: '3.5 MB', created: '2023-07-05', author: 'Lisa Chen' },
    { id: 'attorney-metrics', name: 'Attorney Performance Metrics', type: 'XLSX', size: '5.3 MB', created: '2023-08-12', author: 'Robert Davis' },
    { id: 'firm-financial', name: 'Firm Financial Dashboard', type: 'Dashboard', size: '', created: '2023-09-01', author: 'Emma Wilson' },
    { id: 'litigation-caseload', name: 'Litigation Caseload Analysis', type: 'Dashboard', size: '', created: '2023-09-15', author: 'James Taylor' },
  ];
  
  const simulateProcessingTime = (steps: string[], callback: () => void) => {
    let currentStep = 0;
    
    const processNextStep = () => {
      if (currentStep < steps.length) {
        setProcessingStep(steps[currentStep]);
        setAnalyzeProgress(Math.round((currentStep / (steps.length - 1)) * 100));
        
        const timeForStep = Math.random() * 1000 + 500;
        setTimeout(() => {
          currentStep++;
          processNextStep();
        }, timeForStep);
      } else {
        setAnalyzeProgress(100);
        setTimeout(() => {
          callback();
          setAnalyzeProgress(0);
        }, 500);
      }
    };
    
    processNextStep();
  };
  
  const handleFileDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    
    if (!event.dataTransfer.files || event.dataTransfer.files.length === 0) {
      toast.error('No file detected');
      return;
    }
    
    console.log('File drop detected:', event.dataTransfer.files[0].name);
    setFileName(event.dataTransfer.files[0].name);
    setIsLoadingDashboard(true);
    
    const processingSteps = [
      "Initializing data parser...",
      "Loading CSV data...",
      "Validating file structure...",
      "Processing rows...",
      "Reading column headers...",
      "Analyzing data types...",
      "Preparing data structure...",
      "Analyzing data patterns...",
      "Generating initial insights...",
      "Preparing visualization options...",
      "Finalizing dashboard components..."
    ];
    
    setProcessingStep(processingSteps[0]);
    
    try {
      const csvData = await parseCSVFromDragEvent(event);
      
      if (!csvData) {
        console.error('Failed to parse CSV data');
        toast.error('Failed to parse CSV data');
        setIsLoadingDashboard(false);
        setProcessingStep(null);
        return;
      }
      
      console.log('CSV data loaded:', csvData.headers, csvData.rows.length);
      setData(csvData);
      toast.success('CSV file loaded successfully!');
      
      simulateProcessingTime(processingSteps.slice(3), async () => {
        try {
          const summary = await analyzeData(csvData);
          console.log('Data analysis complete:', summary);
          setDataSummary(summary);
          
          const initialViz = generateInitialVisualizations(summary);
          console.log('Generated visualizations:', initialViz);
          setVisualizations(initialViz);
          
          toast.success('Analysis complete. Dashboard generated!');
          setIsLoadingDashboard(false);
          setProcessingStep(null);
        } catch (err) {
          console.error('Error analyzing data:', err);
          toast.error('Error analyzing data');
          setIsLoadingDashboard(false);
          setProcessingStep(null);
        }
      });
    } catch (err) {
      console.error('Error processing CSV file:', err);
      toast.error('Error processing CSV file');
      setIsLoadingDashboard(false);
      setProcessingStep(null);
    }
  }, [parseCSVFromDragEvent, analyzeData, generateInitialVisualizations]);
  
  const handleClioConnect = useCallback(async (credentials: { email: string; apiKey: string }) => {
    if (isConnectingClio) return;
    
    setIsConnectingClio(true);
    setIsLoadingDashboard(true);
    
    const processingSteps = [
      "Connecting to Clio API...",
      "Authenticating credentials...",
      "Establishing secure connection...",
      "Fetching firm data...",
      "Downloading matter information...",
      "Retrieving client records...",
      "Processing billing data...",
      "Analyzing practice areas...",
      "Compiling attorney statistics...",
      "Generating performance metrics...",
      "Preparing visualization options..."
    ];
    
    simulateProcessingTime(processingSteps, () => {
      try {
        const mockCsvData: CSVData = {
          headers: ['Client', 'Matter', 'Status', 'Hours', 'Revenue', 'Date'],
          rows: [
            { Client: 'Acme Corp', Matter: 'Contract Review', Status: 'Active', Hours: 12, Revenue: 3600, Date: '2023-09-15' },
            { Client: 'Globex LLC', Matter: 'IP Litigation', Status: 'Active', Hours: 28, Revenue: 9800, Date: '2023-09-18' },
            { Client: 'Smith Family', Matter: 'Estate Planning', Status: 'Completed', Hours: 5, Revenue: 1250, Date: '2023-09-10' },
            { Client: 'TechStart Inc', Matter: 'Incorporation', Status: 'Completed', Hours: 8, Revenue: 2000, Date: '2023-09-05' },
            { Client: 'Johnson & Co', Matter: 'Employment Dispute', Status: 'Active', Hours: 18, Revenue: 5400, Date: '2023-09-20' }
          ],
          rawData: ''
        };
        
        setData(mockCsvData);
        setFileName('Clio Data Import');
        
        const mockSummary: DataSummary = {
          totalRows: 5,
          totalColumns: 6,
          columnTypes: {
            Client: 'categorical',
            Matter: 'categorical',
            Status: 'categorical',
            Hours: 'numeric',
            Revenue: 'numeric',
            Date: 'date'
          },
          columnStats: {
            Client: { type: 'categorical', missingValues: 0, uniqueValues: 5, mostCommonValues: [] },
            Matter: { type: 'categorical', missingValues: 0, uniqueValues: 5, mostCommonValues: [] },
            Status: { type: 'categorical', missingValues: 0, uniqueValues: 2, mostCommonValues: [] },
            Hours: { type: 'numeric', missingValues: 0, min: 5, max: 28, mean: 14.2, median: 12 },
            Revenue: { type: 'numeric', missingValues: 0, min: 1250, max: 9800, mean: 4410, median: 3600 },
            Date: { type: 'date', missingValues: 0, uniqueValues: 5, mostCommonValues: [] }
          },
          possibleVisualizations: ['bar', 'line', 'pie', 'table', 'summary'],
          suggestedInsights: [
            'Average revenue per hour is $311.27',
            'Most matters are in Active status (60%)',
            'Revenue is highest for IP Litigation ($9,800)'
          ]
        };
        
        setDataSummary(mockSummary);
        
        const initialViz = generateInitialVisualizations(mockSummary);
        setVisualizations(initialViz);
        
        toast.success('Successfully connected to Clio');
        toast.success('Analysis complete. Dashboard generated!');
        setIsLoadingDashboard(false);
        setProcessingStep(null);
      } catch (error) {
        console.error(error);
        toast.error('Error analyzing data');
        setIsLoadingDashboard(false);
        setProcessingStep(null);
      } finally {
        setIsConnectingClio(false);
      }
    });
  }, [generateInitialVisualizations, isConnectingClio]);
  
  const handleVisualizationSelect = useCallback((type: string) => {
    if (!data || !dataSummary) {
      toast.error('Please load data first');
      return;
    }
    
    setSelectedVisualization(type);
    
    const position = {
      x: (visualizations.length % 2) * 6,
      y: Math.floor(visualizations.length / 2) * 8,
      w: 6,
      h: 8
    };
    
    const newViz: VisualizationConfig = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      columns: dataSummary.columnTypes ? Object.keys(dataSummary.columnTypes).slice(0, 2) : [],
      position
    };
    
    setVisualizations(prev => [...prev, newViz]);
    toast.success(`Added new ${type} visualization`);
  }, [data, dataSummary, visualizations]);
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('managingPartnerLoggedIn');
    localStorage.removeItem('managingPartnerEmail');
    toast.success('Logged out successfully');
    navigate('/');
  }, [navigate]);
  
  const handleShareReport = useCallback(() => {
    if (shareRecipients.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }
    
    toast.success('Dashboard shared successfully', {
      description: `Shared with ${shareRecipients.length} team members`
    });
    
    setShareRecipients([]);
    setActiveDialog(null);
  }, [shareRecipients]);
  
  const handlePermissionChange = useCallback((team: string, level: string) => {
    setPermissionLevels(prev => ({
      ...prev,
      [team]: level
    }));
    
    toast.success(`Updated ${team} permission to ${level}`);
  }, []);
  
  const handleViewReports = useCallback(() => {
    navigate('/reports');
  }, [navigate]);
  
  const simulateDownload = useCallback((reportId: string) => {
    setSelectedReport(reportId);
    setDownloadProgress(0);
    
    const selectedReport = availableReports.find(r => r.id === reportId);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success(`Report "${selectedReport?.name}" downloaded successfully`);
          setDownloadProgress(0);
          setSelectedReport(null);
          return 0;
        }
        return prev + 10;
      });
    }, 300);
    
    setActiveDialog(null);
  }, [availableReports]);
  
  const handleToolSelect = useCallback((tool: string) => {
    switch(tool) {
      case 'client':
        toast.info('Opening client database...', {
          description: 'This feature will be available in the next update.'
        });
        break;
      case 'notifications':
        navigate('/notifications-and-deadlines');
        break;
      case 'settings':
        setActiveDialog('settings');
        break;
      case 'help':
        setActiveDialog('help');
        break;
      case 'downloadReports':
        setActiveDialog('downloadReports');
        break;
      case 'shareWithFirm':
        setActiveDialog('shareWithFirm');
        break;
      case 'viewReports':
        handleViewReports();
        break;
      case 'permissions':
        setActiveDialog('permissions');
        break;
      case 'realTimeData':
        const dialog = document.getElementById('crm-dialog-trigger') as HTMLButtonElement;
        if (dialog) dialog.click();
        break;
      case 'uploadCSV':
        if (data) {
          setData(null);
          setDataSummary(null);
          setVisualizations([]);
          setFileName(null);
          toast.info('Ready to upload new CSV data');
        }
        break;
      case 'calendar':
        setCurrentTool('calendar');
        setCalendarOpen(true);
        break;
      default:
        break;
    }
  }, [data, handleViewReports, navigate, setCurrentTool, setCalendarOpen]);
  
  useEffect(() => {
    if (csvError) {
      toast.error(csvError);
    }
  }, [csvError]);
  
  useEffect(() => {
    if (analysisError) {
      toast.error(analysisError);
    }
  }, [analysisError]);
  
  const LoadingIndicator = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] w-full">
      <div className="bg-card rounded-lg shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <Loader className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">{processingStep || "Loading dashboard..."}</p>
        <div className="w-full bg-secondary/30 h-2 mt-6 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300" 
            style={{ width: `${analyzeProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          {analyzeProgress < 100 ? 
            `Processing ${analyzeProgress}% complete` : 
            "Finalizing results..."}
        </p>
      </div>
    </div>
  );
  
  const memoizedSidebar = useMemo(() => (
    <Sidebar 
      fileName={fileName || undefined} 
      dataLoaded={!!data}
      onVisualizationSelect={handleVisualizationSelect}
      onToolSelect={handleToolSelect}
      onLogout={handleLogout}
      userType="managingPartner"
    />
  ), [fileName, data, handleVisualizationSelect, handleToolSelect, handleLogout]);
  
  const memoizedDashboard = useMemo(() => {
    if (!data || !dataSummary) return null;
    
    return (
      <Suspense fallback={<LoadingIndicator />}>
        <DashboardComponent 
          data={data} 
          dataSummary={dataSummary} 
          initialVisualizations={visualizations} 
        />
      </Suspense>
    );
  }, [data, dataSummary, visualizations]);
  
  const memoizedDataSourceSelector = useMemo(() => {
    if (data && dataSummary) return null;
    
    return (
      <DataSourceSelector
        onCSVDrop={handleFileDrop}
        onClioConnect={handleClioConnect}
        isLoading={isLoadingCSV || isAnalyzing || isConnectingClio}
        error={csvError}
      />
    );
  }, [data, dataSummary, handleFileDrop, handleClioConnect, isLoadingCSV, isAnalyzing, isConnectingClio, csvError]);
  
  if (!isLoggedIn) {
    return null;
  }
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {memoizedSidebar}
        
        <main className="flex-1 overflow-x-hidden">
          {isLoadingDashboard ? (
            <LoadingIndicator />
          ) : (
            <>
              {memoizedDashboard || (
                <div className="container mx-auto p-6 space-y-6">
                  <div className="text-center space-y-2 mb-8 animate-fade-in">
                    <h1 className="text-4xl font-semibold text-primary">Create Custom Reports</h1>
                    <p className="text-xl text-muted-foreground">
                      Data-driven insights for your law firm
                    </p>
                  </div>
                  
                  {memoizedDataSourceSelector}
                </div>
              )}
            </>
          )}
        </main>
      </div>
      
      <Dialog open={activeDialog === 'settings'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">Configure your Velora AI experience.</p>
            <div className="grid gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Theme</h3>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border rounded-md bg-white text-black">Light</button>
                  <button className="px-4 py-2 border rounded-md bg-gray-900 text-white">Dark</button>
                  <button className="px-4 py-2 border rounded-md">System</button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Data Processing</h3>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span>Process data locally when possible</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span>Allow anonymous usage analytics</span>
                </label>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={activeDialog === 'help'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle>Help & Support</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">Need assistance with Velora AI?</p>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Quick Start</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Upload a CSV file or connect to Clio</li>
                  <li>Review the automatically generated visualizations</li>
                  <li>Use natural language queries to explore your data</li>
                  <li>Add custom visualizations from the sidebar</li>
                </ol>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Contact Us</h3>
                <p className="text-sm">Email: support@velora.ai</p>
                <p className="text-sm">Phone: (555) 123-4567</p>
                <p className="text-sm">Hours: Mon-Fri, 9AM-5PM EST</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={activeDialog === 'downloadReports'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="bg-background sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Download Reports
            </DialogTitle>
            <DialogDescription>
              Download pre-generated reports for your law firm
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-2">
            <div className="relative">
              <Input 
                placeholder="Search reports..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-2.5 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
            
            <div className="border rounded-md divide-y">
              {availableReports.filter(report => 
                report.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 hover:bg-muted/50">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-md ${
                      report.type === 'PDF' ? 'bg-red-100 text-red-600' : 
                      report.type === 'XLSX' ? 'bg-green-100 text-green-600' : 
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.type} • {report.size} • {report.created}</p>
                    </div>
                  </div>
                  
                  {selectedReport === report.id ? (
                    <div className="flex items-center gap-2 w-32">
                      <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-300" 
                          style={{ width: `${downloadProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{downloadProgress}%</span>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => simulateDownload(report.id)}
                      className="gap-1"
                    >
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDialog(null)}>Close</Button>
            <Button 
              disabled={!data || !dataSummary}
              onClick={() => {
                if (data && dataSummary) {
                  toast.success('Generating new report...', {
                    description: 'Your report will be available shortly'
                  });
                  setActiveDialog(null);
                }
              }}
            >
              Generate New Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={activeDialog === 'shareWithFirm'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="bg-background sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share with Firm
            </DialogTitle>
            <DialogDescription>
              Share this dashboard with members of your firm
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="share-message">Add a message (optional)</Label>
              <Input id="share-message" placeholder="Here's the latest revenue analysis..." className="mt-1.5" />
            </div>
            
            <div>
              <Label className="mb-1.5 block">Select recipients</Label>
              <div className="space-y-2 border rounded-md p-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="r1" 
                    checked={shareRecipients.includes('team-litigation')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setShareRecipients(prev => [...prev, 'team-litigation']);
                      } else {
                        setShareRecipients(prev => prev.filter(r => r !== 'team-litigation'));
                      }
                    }}
                  />
                  <Label htmlFor="r1" className="text-sm">Litigation Team (12 members)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="r2" 
                    checked={shareRecipients.includes('team-corporate')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setShareRecipients(prev => [...prev, 'team-corporate']);
                      } else {
                        setShareRecipients(prev => prev.filter(r => r !== 'team-corporate'));
                      }
                    }}
                  />
                  <Label htmlFor="r2" className="text-sm">Corporate Team (8 members)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="r3"
                    checked={shareRecipients.includes('team-realestate')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setShareRecipients(prev => [...prev, 'team-realestate']);
                      } else {
                        setShareRecipients(prev => prev.filter(r => r !== 'team-realestate'));
                      }
                    }}
                  />
                  <Label htmlFor="r3" className="text-sm">Real Estate Team (6 members)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="r4"
                    checked={shareRecipients.includes('team-ip')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setShareRecipients(prev => [...prev, 'team-ip']);
                      } else {
                        setShareRecipients(prev => prev.filter(r => r !== 'team-ip'));
                      }
                    }}
                  />
                  <Label htmlFor="r4" className="text-sm">Intellectual Property Team (5 members)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="r5"
                    checked={shareRecipients.includes('partners')}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setShareRecipients(prev => [...prev, 'partners']);
                      } else {
                        setShareRecipients(prev => prev.filter(r => r !== 'partners'));
                      }
                    }}
                  />
                  <Label htmlFor="r5" className="text-sm">All Partners (4 members)</Label>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="mb-1.5 block">Share options</Label>
              <Select defaultValue="view">
                <SelectTrigger>
                  <SelectValue placeholder="Select permission level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Permission level</SelectLabel>
                    <SelectItem value="view">View only</SelectItem>
                    <SelectItem value="comment">View and comment</SelectItem>
                    <SelectItem value="edit">Edit</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDialog(null)}>Cancel</Button>
            <Button 
              onClick={handleShareReport}
              disabled={shareRecipients.length === 0}
            >
              Share Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={activeDialog === 'permissions'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="bg-background sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Dashboard Permissions
            </DialogTitle>
            <DialogDescription>
              Manage access permissions for firm members
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="border rounded-md divide-y">
              <div className="p-3 bg-muted/30 grid grid-cols-5 text-sm font-medium">
                <div className="col-span-3">Team</div>
                <div className="col-span-1">Access Level</div>
                <div className="col-span-1 text-right">Members</div>
              </div>
              
              <div className="p-3 grid grid-cols-5 items-center">
                <div className="col-span-3">Litigation Team</div>
                <div className="col-span-1">
                  <Select value={permissionLevels['team-litigation']} onValueChange={(val) => handlePermissionChange('team-litigation', val)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View</SelectItem>
                      <SelectItem value="comment">Comment</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                      <SelectItem value="none">No Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 text-right">12</div>
              </div>
              
              <div className="p-3 grid grid-cols-5 items-center">
                <div className="col-span-3">Corporate Team</div>
                <div className="col-span-1">
                  <Select value={permissionLevels['team-corporate']} onValueChange={(val) => handlePermissionChange('team-corporate', val)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View</SelectItem>
                      <SelectItem value="comment">Comment</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                      <SelectItem value="none">No Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 text-right">8</div>
              </div>
              
              <div className="p-3 grid grid-cols-5 items-center">
                <div className="col-span-3">Real Estate Team</div>
                <div className="col-span-1">
                  <Select value={permissionLevels['team-realestate']} onValueChange={(val) => handlePermissionChange('team-realestate', val)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View</SelectItem>
                      <SelectItem value="comment">Comment</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                      <SelectItem value="none">No Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 text-right">6</div>
              </div>
              
              <div className="p-3 grid grid-cols-5 items-center">
                <div className="col-span-3">Intellectual Property Team</div>
                <div className="col-span-1">
                  <Select value={permissionLevels['team-ip']} onValueChange={(val) => handlePermissionChange('team-ip', val)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View</SelectItem>
                      <SelectItem value="comment">Comment</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                      <SelectItem value="none">No Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 text-right">5</div>
              </div>
              
              <div className="p-3 grid grid-cols-5 items-center">
                <div className="col-span-3">All Partners</div>
                <div className="col-span-1">
                  <Select value={permissionLevels['partners']} onValueChange={(val) => handlePermissionChange('partners', val)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View</SelectItem>
                      <SelectItem value="comment">Comment</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                      <SelectItem value="none">No Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1 text-right">4</div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDialog(null)}>Cancel</Button>
            <Button onClick={() => {
              toast.success('Permissions updated successfully');
              setActiveDialog(null);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default DashboardPage;
