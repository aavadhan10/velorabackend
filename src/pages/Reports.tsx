import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from '../components/Sidebar';
import { BookOpen, FileText, Search, Download, Eye, ArrowLeft, Star, Filter, Calendar, ChevronDown, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Report {
  id: string;
  name: string;
  description?: string;
  type: string;
  size: string;
  created: string;
  author: string;
  category?: string;
  starred?: boolean;
  thumbnail?: string;
  previewContent?: {
    title: string;
    summary: string;
    insights: string[];
    chart?: string;
  };
  dashboardView?: string;
}

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('managingPartnerLoggedIn') === 'true';
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/managing-partner-login');
    }
  }, [isLoggedIn, navigate]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All time');
  const [typeFilter, setTypeFilter] = useState('All types');
  const [sortBy, setSortBy] = useState('newest');
  const [reportToPreview, setReportToPreview] = useState<Report | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [starredReports, setStarredReports] = useState<string[]>(['revenue-q1-2023', 'firm-financial']);
  
  const reportsData: Report[] = [
    { 
      id: 'revenue-q1-2023', 
      name: 'Revenue Analysis Q1 2023', 
      description: 'Comprehensive analysis of firm revenue including billable hours, practice area performance, and individual attorney contributions for Q1 2023.',
      type: 'PDF', 
      size: '4.2 MB', 
      created: '2023-04-15', 
      author: 'John Smith',
      category: 'Financial',
      thumbnail: 'https://placehold.co/400x300/2563eb/ffffff?text=Revenue+Analysis',
      previewContent: {
        title: 'Q1 2023 Revenue Analysis',
        summary: 'This report provides an in-depth analysis of the firm\'s revenue performance during Q1 2023, compared to previous quarters and projected targets.',
        insights: [
          'Total revenue increased by 18% compared to Q1 2022',
          'Litigation practice showed highest growth at 24%',
          'Average billable rate increased from $385 to $412',
          'Corporate practice accounts for 42% of total revenue'
        ],
        chart: 'https://placehold.co/800x400/2563eb/ffffff?text=Revenue+Chart'
      }
    },
    { 
      id: 'billable-hours-2023', 
      name: 'Billable Hours Report 2023', 
      description: 'Analysis of billable hours across all practices, including utilization rates, realization rates, and efficiency metrics.',
      type: 'XLSX', 
      size: '2.8 MB', 
      created: '2023-05-22', 
      author: 'Sarah Johnson',
      category: 'Financial',
      thumbnail: 'https://placehold.co/400x300/059669/ffffff?text=Billable+Hours',
      previewContent: {
        title: 'Billable Hours Report 2023',
        summary: 'This report analyzes attorney productivity through the lens of billable hours, utilization rates, and efficiency metrics across all practice areas.',
        insights: [
          'Average utilization rate across firm is 76%',
          'Senior associates average 1,820 billable hours annually',
          'Corporate practice has highest realization rate at 92%',
          'IP practice shows most improved efficiency year-over-year'
        ],
        chart: 'https://placehold.co/800x400/059669/ffffff?text=Billable+Hours+Chart'
      }
    },
    { 
      id: 'practice-performance', 
      name: 'Practice Area Performance', 
      description: 'Comparative analysis of all practice areas showing profitability, growth trends, and client acquisition costs.',
      type: 'PDF', 
      size: '6.1 MB', 
      created: '2023-06-10', 
      author: 'Michael Wong',
      category: 'Performance',
      thumbnail: 'https://placehold.co/400x300/d97706/ffffff?text=Practice+Performance',
      previewContent: {
        title: 'Practice Area Performance Analysis',
        summary: 'A detailed breakdown of each practice area\'s financial performance, profitability metrics, and growth trajectory over the past year.',
        insights: [
          'Real Estate practice shows highest profit margin at 38%',
          'Litigation has highest revenue but second-lowest profit margin',
          'IP practice has grown 31% year-over-year',
          'Tax practice has lowest client acquisition cost'
        ],
        chart: 'https://placehold.co/800x400/d97706/ffffff?text=Practice+Performance+Chart'
      }
    },
    { 
      id: 'client-acquisition', 
      name: 'Client Acquisition Trends', 
      description: 'Analysis of client acquisition sources, costs, and retention rates across all practice areas.',
      type: 'PDF', 
      size: '3.5 MB', 
      created: '2023-07-05', 
      author: 'Lisa Chen',
      category: 'Client',
      thumbnail: 'https://placehold.co/400x300/dc2626/ffffff?text=Client+Acquisition',
      previewContent: {
        title: 'Client Acquisition Trends',
        summary: 'This report examines how the firm acquires new clients, the associated costs, conversion rates from prospects, and retention metrics.',
        insights: [
          'Referrals account for 42% of new clients with lowest acquisition cost',
          'Digital marketing generates 28% of leads but only 18% of clients',
          'Average client acquisition cost is $8,240 across all channels',
          'Client retention rate has improved to 87% firm-wide'
        ],
        chart: 'https://placehold.co/800x400/dc2626/ffffff?text=Client+Acquisition+Chart'
      }
    },
    { 
      id: 'attorney-metrics', 
      name: 'Attorney Performance Metrics', 
      description: 'Detailed metrics for all attorneys including billable hours, client satisfaction scores, and business development contributions.',
      type: 'XLSX', 
      size: '5.3 MB', 
      created: '2023-08-12', 
      author: 'Robert Davis',
      category: 'Performance',
      thumbnail: 'https://placehold.co/400x300/7c3aed/ffffff?text=Attorney+Metrics',
      previewContent: {
        title: 'Attorney Performance Metrics',
        summary: 'A comprehensive assessment of individual attorney performance across multiple dimensions including financial contribution, client satisfaction, and business development.',
        insights: [
          'Top 10% of attorneys generate 32% of total firm revenue',
          'Associates with 5+ years experience have highest client satisfaction scores',
          'Business development hours correlate strongly with partner compensation',
          'Junior associate retention is highest in Corporate practice'
        ],
        chart: 'https://placehold.co/800x400/7c3aed/ffffff?text=Attorney+Performance+Chart'
      },
      dashboardView: 'attorney'
    },
    { 
      id: 'firm-financial', 
      name: 'Firm Financial Dashboard', 
      description: 'Interactive dashboard showing firm-wide financial performance with drill-down capabilities by practice area, attorney, and client.',
      type: 'Dashboard', 
      size: '', 
      created: '2023-09-01', 
      author: 'Emma Wilson',
      category: 'Financial',
      thumbnail: 'https://placehold.co/400x300/0ea5e9/ffffff?text=Financial+Dashboard',
      previewContent: {
        title: 'Firm Financial Dashboard',
        summary: 'An interactive financial performance dashboard that provides real-time insights into the firm\'s financial health across all key metrics.',
        insights: [
          'Overall firm profitability is up 12% year-over-year',
          'Overhead costs reduced by 8% through operational efficiencies',
          'Average collection period reduced from 62 to 47 days',
          'Top 20 clients represent 48% of total firm revenue'
        ],
        chart: 'https://placehold.co/800x400/0ea5e9/ffffff?text=Financial+Dashboard+Preview'
      },
      dashboardView: 'managing'
    },
    { 
      id: 'litigation-caseload', 
      name: 'Litigation Caseload Analysis', 
      description: 'Analysis of the litigation practice area caseload distribution, case complexity, and profitability by case type.',
      type: 'Dashboard', 
      size: '', 
      created: '2023-09-15', 
      author: 'James Taylor',
      category: 'Performance',
      thumbnail: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Litigation+Caseload',
      previewContent: {
        title: 'Litigation Caseload Analysis',
        summary: 'This report breaks down the litigation practice\'s active cases by type, complexity, profitability, and staffing allocation to optimize resource management.',
        insights: [
          'Complex commercial disputes have highest profit margin at 41%',
          'Employment cases have highest volume but lowest average fee',
          'Current attorney-to-case ratio is 1:7 across the practice',
          'Class action cases require 2.4x more associate hours than average'
        ],
        chart: 'https://placehold.co/800x400/8b5cf6/ffffff?text=Litigation+Caseload+Chart'
      },
      dashboardView: 'custom-litigation'
    },
    { 
      id: 'marketing-roi', 
      name: 'Marketing ROI Analysis', 
      description: 'Evaluation of marketing campaigns and initiatives, showing return on investment across different channels.',
      type: 'Dashboard', 
      size: '', 
      created: '2023-10-05', 
      author: 'Patricia Garcia',
      category: 'Marketing',
      thumbnail: 'https://placehold.co/400x300/ec4899/ffffff?text=Marketing+ROI',
      previewContent: {
        title: 'Marketing ROI Analysis',
        summary: 'A detailed analysis of all marketing channels and campaigns, evaluating their effectiveness, cost-efficiency, and return on investment.',
        insights: [
          'Thought leadership content generates highest quality leads',
          'Digital advertising ROI has improved 72% after targeting adjustments',
          'Industry events yield 3.2x return on investment',
          'Email campaigns to existing clients have 24% conversion rate'
        ],
        chart: 'https://placehold.co/800x400/ec4899/ffffff?text=Marketing+ROI+Chart'
      },
      dashboardView: 'custom-marketing'
    },
    { 
      id: 'client-satisfaction', 
      name: 'Client Satisfaction Survey Results', 
      description: 'Analysis of client satisfaction survey results across all practice areas with actionable insights.',
      type: 'Dashboard', 
      size: '', 
      created: '2023-10-20', 
      author: 'Thomas Brown',
      category: 'Client',
      thumbnail: 'https://placehold.co/400x300/06b6d4/ffffff?text=Client+Satisfaction',
      previewContent: {
        title: 'Client Satisfaction Survey Results',
        summary: 'This report analyzes client feedback from formal surveys and interviews to identify trends, areas of excellence, and opportunities for improvement.',
        insights: [
          'Overall client satisfaction score is 8.7/10, up from 8.3 last year',
          'Communication frequency is the most cited improvement area',
          'IP practice has highest client satisfaction at 9.2/10',
          'Responsiveness scores have improved 18% after new protocols'
        ],
        chart: 'https://placehold.co/800x400/06b6d4/ffffff?text=Client+Satisfaction+Chart'
      },
      dashboardView: 'custom-client'
    },
  ];
  
  const handleBack = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);
  
  const handleStarReport = useCallback((reportId: string) => {
    setStarredReports(prev => 
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
    
    const isStarring = !starredReports.includes(reportId);
    toast.success(isStarring 
      ? 'Report added to favorites' 
      : 'Report removed from favorites'
    );
  }, [starredReports]);
  
  const handlePreviewReport = useCallback((report: Report) => {
    setReportToPreview(report);
    setIsLoadingPreview(true);
    
    // Simulate loading time
    setTimeout(() => {
      setIsLoadingPreview(false);
    }, 1500);
  }, []);
  
  const handleOpenReport = useCallback((report: Report) => {
    if (report.dashboardView) {
      switch (report.dashboardView) {
        case 'attorney':
          navigate('/attorney-dashboard');
          toast.success(`Opening Attorney Dashboard based on ${report.name}`);
          break;
        case 'managing':
          navigate('/dashboard');
          toast.success(`Opening Managing Partner Dashboard based on ${report.name}`);
          break;
        case 'custom-litigation':
          navigate('/litigation-caseload');
          toast.success(`Opening Litigation Caseload Dashboard`);
          break;
        case 'custom-marketing':
          navigate('/marketing-roi');
          toast.success(`Opening Marketing ROI Dashboard`);
          break;
        case 'custom-client':
          navigate('/client-satisfaction');
          toast.success(`Opening Client Satisfaction Dashboard`);
          break;
        default:
          navigate(`/dashboard?report=${report.id}`);
          toast.success(`Opening ${report.name} dashboard`);
      }
    } else if (report.type === 'Dashboard') {
      navigate(`/dashboard?report=${report.id}`);
      toast.success(`Opening ${report.name} dashboard`);
    } else {
      toast.success(`Opening ${report.name}`, {
        description: `Viewing ${report.type} in document viewer`
      });
      setReportToPreview(report);
    }
  }, [navigate]);
  
  const handleMultipleSelection = useCallback((reportId: string, checked: boolean) => {
    if (checked) {
      setSelectedReports(prev => [...prev, reportId]);
    } else {
      setSelectedReports(prev => prev.filter(id => id !== reportId));
    }
  }, []);
  
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allIds = filteredReports.map(report => report.id);
      setSelectedReports(allIds);
    } else {
      setSelectedReports([]);
    }
  }, []);
  
  const handleBulkAction = useCallback((action: 'download' | 'delete' | 'share') => {
    if (selectedReports.length === 0) {
      toast.error('Please select at least one report');
      return;
    }
    
    switch (action) {
      case 'download':
        toast.success(`Downloading ${selectedReports.length} reports`);
        break;
      case 'delete':
        toast.success(`Deleted ${selectedReports.length} reports`);
        setSelectedReports([]);
        break;
      case 'share':
        toast.success(`Sharing ${selectedReports.length} reports`, {
          description: 'Please select recipients on the next screen'
        });
        break;
    }
  }, [selectedReports]);
  
  const applyFilters = useCallback(() => {
    setShowFilterDialog(false);
    toast.success('Filters applied', {
      description: `Showing ${categoryFilter} reports sorted by ${sortBy}`
    });
  }, [categoryFilter, sortBy]);
  
  const filteredReports = reportsData.filter(report => {
    const matchesSearch = 
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.description && report.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      report.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'starred' && starredReports.includes(report.id)) ||
      (activeTab === 'dashboards' && report.type === 'Dashboard') ||
      (activeTab === 'documents' && (report.type === 'PDF' || report.type === 'XLSX'));
    
    const matchesCategory = 
      categoryFilter === 'All' ||
      report.category === categoryFilter;
    
    const matchesType =
      typeFilter === 'All types' ||
      (typeFilter === 'PDF' && report.type === 'PDF') ||
      (typeFilter === 'Excel' && report.type === 'XLSX') ||
      (typeFilter === 'Dashboard' && report.type === 'Dashboard');
    
    const matchesDate = true;
    
    return matchesSearch && matchesTab && matchesCategory && matchesType && matchesDate;
  });
  
  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      case 'oldest':
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
  
  const categories = ['All', 'Financial', 'Performance', 'Client', 'Marketing'];
  const types = ['All types', 'PDF', 'Excel', 'Dashboard'];
  const datePeriods = ['All time', 'Last week', 'Last month', 'Last quarter', 'Last year'];
  const sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
  ];
  
  if (!isLoggedIn) {
    return null;
  }
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar fileName={undefined} dataLoaded={false} onVisualizationSelect={() => {}} onToolSelect={() => {}} onLogout={() => {}} userType="managingPartner" />
        
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold text-primary flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" /> Reports Library
                  </h1>
                  <p className="text-muted-foreground">Access and manage all your firm's reports</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilterDialog(true)}
                  className="gap-1"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search reports..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Reports</TabsTrigger>
                <TabsTrigger value="starred">Favorites</TabsTrigger>
                <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <div className="my-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="select-all" 
                    checked={selectedReports.length > 0 && selectedReports.length === filteredReports.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="text-sm">
                    Select all ({filteredReports.length})
                  </Label>
                </div>
                
                {selectedReports.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {selectedReports.length} selected
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleBulkAction('download')}
                    >
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleBulkAction('share')}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Share
                    </Button>
                  </div>
                )}
              </div>
              
              <TabsContent value={activeTab} className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedReports.map(report => (
                    <div 
                      key={report.id} 
                      className="group relative border rounded-lg overflow-hidden transition-all hover:shadow-md"
                    >
                      <div className="absolute top-2 left-2 z-10">
                        <Checkbox 
                          checked={selectedReports.includes(report.id)}
                          onCheckedChange={(checked) => handleMultipleSelection(report.id, !!checked)}
                          className="bg-white/80"
                        />
                      </div>
                      
                      <div className="absolute top-2 right-2 z-10">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="bg-white/80 hover:bg-white"
                          onClick={() => handleStarReport(report.id)}
                        >
                          <Star 
                            className={`h-4 w-4 ${starredReports.includes(report.id) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                          />
                        </Button>
                      </div>
                      
                      <div 
                        className="h-40 bg-muted flex items-center justify-center cursor-pointer"
                        onClick={() => handlePreviewReport(report)}
                      >
                        {report.thumbnail ? (
                          <img 
                            src={report.thumbnail} 
                            alt={report.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <FileText className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <h3 
                            className="font-medium hover:text-primary cursor-pointer"
                            onClick={() => handleOpenReport(report)}
                          >
                            {report.name}
                          </h3>
                        </div>
                        
                        <div className="mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{report.created}</span>
                          </div>
                          <p className="mt-1">By {report.author}</p>
                        </div>
                        
                        <div className="mt-3 flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            report.type === 'PDF' ? 'bg-red-100 text-red-600' : 
                            report.type === 'XLSX' ? 'bg-green-100 text-green-600' : 
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {report.type}
                          </span>
                          
                          {report.category && (
                            <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                              {report.category}
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-1"
                            onClick={() => handlePreviewReport(report)}
                          >
                            <Eye className="h-3.5 w-3.5" /> Preview
                          </Button>
                          
                          <Button 
                            variant={report.dashboardView ? "default" : "secondary"}
                            size="sm"
                            className="gap-1"
                            onClick={() => handleOpenReport(report)}
                          >
                            {report.dashboardView ? (
                              <>
                                {report.dashboardView === 'attorney' ? (
                                  <Users className="h-3.5 w-3.5" />
                                ) : (
                                  <FileText className="h-3.5 w-3.5" />
                                )}
                                View Dashboard
                              </>
                            ) : (
                              <>
                                <FileText className="h-3.5 w-3.5" /> Open
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {sortedReports.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No reports found</h3>
                    <p className="text-muted-foreground mt-1">
                      {searchQuery ? `No reports matching "${searchQuery}"` : 'Try adjusting your filters'}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="bg-background sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Filter Reports</DialogTitle>
            <DialogDescription>
              Narrow down your reports by category, type and date
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>File Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {datePeriods.map(period => (
                    <SelectItem key={period} value={period}>{period}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFilterDialog(false)}>Cancel</Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!reportToPreview} onOpenChange={(open) => !open && setReportToPreview(null)}>
        <DialogContent className="bg-background sm:max-w-[800px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{reportToPreview?.name}</DialogTitle>
            <DialogDescription>
              {reportToPreview?.type} report created by {reportToPreview?.author} on {reportToPreview?.created}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto mt-2">
            {isLoadingPreview ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-start border rounded-md overflow-y-auto p-6">
                <div className="max-w-3xl w-full space-y-6">
                  {reportToPreview?.previewContent ? (
                    <>
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-primary">{reportToPreview.previewContent.title}</h2>
                        <p className="text-muted-foreground mt-2">{reportToPreview.previewContent.summary}</p>
                      </div>
                      
                      {reportToPreview.previewContent.chart && (
                        <div className="my-6">
                          <img 
                            src={reportToPreview.previewContent.chart} 
                            alt="Report Chart" 
                            className="w-full h-auto rounded-lg border"
                          />
                        </div>
                      )}
                      
                      <div className="border rounded-lg p-4 bg-muted/10">
                        <h3 className="font-semibold text-lg mb-3">Key Insights</h3>
                        <ul className="space-y-2">
                          {reportToPreview.previewContent.insights.map((insight, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium mr-3 mt-0.5">
                                {index + 1}
                              </span>
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="border-t border-dashed pt-6 mt-6">
                        <p className="text-sm text-muted-foreground italic">
                          This is a preview of the report. Open the full report to access all data and interactive features.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center h-60">
                      {reportToPreview?.thumbnail ? (
                        <img 
                          src={reportToPreview.thumbnail} 
                          alt={reportToPreview.name} 
                          className="w-full max-h-[300px] object-contain mb-6" 
                        />
                      ) : (
                        <FileText className="h-24 w-24 text-muted-foreground mb-6" />
                      )}
                      
                      <h3 className="text-lg font-medium">{reportToPreview?.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2 max-w-xl">{reportToPreview?.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setReportToPreview(null)}>Close</Button>
            <Button onClick={() => {
              handleOpenReport(reportToPreview!);
              setReportToPreview(null);
            }}>
              {reportToPreview?.dashboardView ? 'View Dashboard' : 'Open Full Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default ReportsPage;
