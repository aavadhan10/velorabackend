
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Users, DollarSign, Clock, Briefcase, Filter, BarChart2, PieChartIcon, LineChartIcon, Sparkles, Bell, CalendarDays } from 'lucide-react';
import QueryInput from '@/components/QueryInput';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import CalendarDialog from '@/components/dialogs/CalendarDialog';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AttorneyDashboard = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('attorneyLoggedIn') === 'true';
  const attorneyEmail = localStorage.getItem('attorneyEmail');
  
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6m');
  const [practiceArea, setPracticeArea] = useState('all');
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);
  const [showQueryResults, setShowQueryResults] = useState(false);
  const [queryResults, setQueryResults] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/attorney-login');
    }
  }, [isLoggedIn, navigate]);
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('attorneyLoggedIn');
    localStorage.removeItem('attorneyEmail');
    toast.success('Logged out successfully');
    navigate('/');
  }, [navigate]);
  
  const topClients = useMemo(() => [
    { name: 'Acme Corporation', revenue: 42500, hours: 92, practiceArea: 'Corporate' },
    { name: 'Smith Industries', revenue: 37800, hours: 76, practiceArea: 'Litigation' },
    { name: 'Johnson & Partners', revenue: 31200, hours: 65, practiceArea: 'Corporate' },
    { name: 'Globex LLC', revenue: 28900, hours: 61, practiceArea: 'IP' },
    { name: 'Tech Innovators', revenue: 24500, hours: 52, practiceArea: 'Litigation' }
  ], []);
  
  const monthlyRevenue = useMemo(() => [
    { month: 'Jan', revenue: 28500, billableHours: 160, realization: 0.88 },
    { month: 'Feb', revenue: 32100, billableHours: 175, realization: 0.92 },
    { month: 'Mar', revenue: 27800, billableHours: 155, realization: 0.85 },
    { month: 'Apr', revenue: 34200, billableHours: 182, realization: 0.93 },
    { month: 'May', revenue: 38900, billableHours: 201, realization: 0.91 },
    { month: 'Jun', revenue: 42500, billableHours: 215, realization: 0.95 }
  ], []);
  
  const hoursByMatter = useMemo(() => [
    { name: 'Contract Review', value: 120, efficiency: 0.92 },
    { name: 'Litigation', value: 210, efficiency: 0.85 },
    { name: 'Corporate', value: 85, efficiency: 0.94 },
    { name: 'IP', value: 65, efficiency: 0.89 },
    { name: 'Compliance', value: 45, efficiency: 0.90 }
  ], []);
  
  const performanceMetrics = useMemo(() => ({
    billedHours: 525,
    revenue: 164900,
    clients: 12,
    matters: 18,
    utilizationRate: 0.82,
    realizationRate: 0.91
  }), []);
  
  const skillAssessment = useMemo(() => [
    { subject: 'Legal Research', value: 90, fullMark: 100 },
    { subject: 'Client Relations', value: 85, fullMark: 100 },
    { subject: 'Litigation', value: 92, fullMark: 100 },
    { subject: 'Negotiation', value: 88, fullMark: 100 },
    { subject: 'Document Drafting', value: 95, fullMark: 100 },
    { subject: 'Case Management', value: 86, fullMark: 100 },
  ], []);
  
  const upcomingDeadlines = useMemo(() => [
    { matter: 'Smith v. Johnson', task: 'File Motion to Dismiss', date: '2023-07-15', daysLeft: 5, client: 'Johnson & Partners' },
    { matter: 'Acme Acquisition', task: 'Due Diligence Report', date: '2023-07-22', daysLeft: 12, client: 'Acme Corporation' },
    { matter: 'Tech Innovators IP', task: 'Patent Filing', date: '2023-07-29', daysLeft: 19, client: 'Tech Innovators' },
    { matter: 'Globex Compliance', task: 'Regulatory Review', date: '2023-08-05', daysLeft: 26, client: 'Globex LLC' },
  ], []);

  // New notifications data
  const notifications = useMemo(() => [
    { id: 1, title: 'Motion Deadline Approaching', message: 'Smith v. Johnson motion due in 5 days', date: '2023-07-10', read: false, type: 'deadline' },
    { id: 2, title: 'New Case Assignment', message: 'You have been assigned to Globex LLC v. Stark Industries', date: '2023-07-09', read: true, type: 'assignment' },
    { id: 3, title: 'Client Meeting Reminder', message: 'Meeting with Acme Corporation tomorrow at 2:00 PM', date: '2023-07-09', read: false, type: 'meeting' },
    { id: 4, title: 'Document Review Complete', message: 'Tech Innovators contract review completed by paralegal', date: '2023-07-08', read: true, type: 'document' },
    { id: 5, title: 'Court Date Changed', message: 'Smith v. Johnson hearing rescheduled to August 3rd', date: '2023-07-07', read: false, type: 'court' },
    { id: 6, title: 'Billing Update', message: 'June hours approved by managing partner', date: '2023-07-06', read: true, type: 'billing' },
    { id: 7, title: 'CLE Requirement', message: 'Ethics CLE credits due by end of month', date: '2023-07-05', read: false, type: 'training' }
  ], []);

  // Calendar events
  const calendarEvents = useMemo(() => [
    { id: 1, title: 'Client Meeting: Acme Corp', date: new Date(2023, 6, 15), time: '10:00 AM', location: 'Conference Room A', type: 'meeting' },
    { id: 2, title: 'Smith v. Johnson Hearing', date: new Date(2023, 6, 18), time: '2:00 PM', location: 'County Courthouse', type: 'court' },
    { id: 3, title: 'Team Strategy Session', date: new Date(2023, 6, 20), time: '1:00 PM', location: 'Conference Room B', type: 'internal' },
    { id: 4, title: 'Deposition: Tech Innovators Case', date: new Date(2023, 6, 22), time: '9:00 AM', location: 'Opposing Counsel Office', type: 'deposition' },
    { id: 5, title: 'Monthly Practice Group Meeting', date: new Date(2023, 6, 25), time: '4:00 PM', location: 'Main Conference Room', type: 'internal' },
    { id: 6, title: 'Client Call: Globex LLC', date: new Date(2023, 6, 27), time: '11:00 AM', location: 'Your Office', type: 'call' },
    { id: 7, title: 'Bar Association Event', date: new Date(2023, 6, 29), time: '6:00 PM', location: 'Downtown Hilton', type: 'networking' }
  ], []);
  
  const handleQuery = useCallback(async (query: string) => {
    setIsProcessingQuery(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResult = {
        query,
        answer: `Based on your data, I've analyzed "${query}" and found the following insights:`,
        visualizations: []
      };
      
      if (query.toLowerCase().includes('client') || query.toLowerCase().includes('revenue')) {
        mockResult.answer += ' Your top clients by revenue show strong performance in the corporate sector, with Acme Corporation leading at $42,500.';
        mockResult.visualizations.push({
          type: 'bar',
          title: 'Top Clients by Revenue',
          data: topClients.map(client => ({ name: client.name, value: client.revenue }))
        });
      }
      
      if (query.toLowerCase().includes('hour') || query.toLowerCase().includes('time')) {
        mockResult.answer += ' Your billable hours have been steadily increasing over the past 6 months, with June showing the highest at 215 hours.';
        mockResult.visualizations.push({
          type: 'line',
          title: 'Billable Hours Trend',
          data: monthlyRevenue.map(month => ({ name: month.month, value: month.billableHours }))
        });
      }
      
      if (query.toLowerCase().includes('matter') || query.toLowerCase().includes('case')) {
        mockResult.answer += ' Litigation matters account for the largest portion of your billable hours at 210 hours, followed by Contract Review at 120 hours.';
        mockResult.visualizations.push({
          type: 'pie',
          title: 'Hours by Matter Type',
          data: hoursByMatter
        });
      }
      
      if (mockResult.visualizations.length === 0) {
        mockResult.answer += ' Here\'s a summary of your monthly performance over the last 6 months.';
        mockResult.visualizations.push({
          type: 'line',
          title: 'Monthly Revenue Performance',
          data: monthlyRevenue.map(month => ({ name: month.month, value: month.revenue }))
        });
      }
      
      setQueryResults(mockResult);
      setShowQueryResults(true);
      toast.success('Analysis complete');
    } catch (error) {
      toast.error('Error processing query');
      console.error(error);
    } finally {
      setIsProcessingQuery(false);
    }
  }, [topClients, monthlyRevenue, hoursByMatter]);
  
  const querySuggestions = useMemo(() => [
    "Show my top clients by revenue",
    "What's my billable hours trend?",
    "Analyze my matter distribution",
    "How is my efficiency by practice area?"
  ], []);
  
  const renderQueryResultsDialog = useMemo(() => (
    <Dialog open={showQueryResults} onOpenChange={setShowQueryResults}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Analysis Results</DialogTitle>
        </DialogHeader>
        
        {queryResults && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Query</h3>
              <p className="text-muted-foreground italic">"{queryResults.query}"</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Answer</h3>
              <p>{queryResults.answer}</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Visualizations</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {queryResults.visualizations.map((vis: any, index: number) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>{vis.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        {vis.type === 'bar' && (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={vis.data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="#8884d8">
                                {vis.data.map((_: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                        
                        {vis.type === 'line' && (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={vis.data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                        
                        {vis.type === 'pie' && (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                              <Pie
                                data={vis.data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label={({name, percent}) => {
                                  return `${name} ${(Number(percent) * 100).toFixed(0)}%`;
                                }}
                              >
                                {vis.data.map((_: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value, name, props) => [`${value} hours`, props.payload.name]}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  ), [showQueryResults, queryResults]);
  
  if (!isLoggedIn) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Velora AI</h1>
              <p className="text-sm text-muted-foreground">Attorney Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Last Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={practiceArea} onValueChange={setPracticeArea}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Practice Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  <SelectItem value="litigation">Litigation</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="ip">IP</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium">{attorneyEmail || 'Attorney'}</p>
              <p className="text-xs text-muted-foreground">Litigation Department</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Billable Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-primary mr-2" />
                <div className="text-2xl font-bold">{performanceMetrics.billedHours}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Last 6 months
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-primary mr-2" />
                <div className="text-2xl font-bold">${performanceMetrics.revenue.toLocaleString()}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Last 6 months
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Utilization Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-primary mr-2" />
                <div className="text-2xl font-bold">{(performanceMetrics.utilizationRate * 100).toFixed(1)}%</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Billable vs. available hours
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Realization Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-primary mr-2" />
                <div className="text-2xl font-bold">{(performanceMetrics.realizationRate * 100).toFixed(1)}%</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Billed vs. collected
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Ask about your data</h2>
          <QueryInput 
            onSubmit={handleQuery}
            isProcessing={isProcessingQuery}
            suggestions={querySuggestions}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="matters">Matters</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              <span>Notifications</span>
              <Badge className="ml-2 bg-primary">{notifications.filter(n => !n.read).length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>Calendar</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                  <CardDescription>
                    Revenue trend for the last 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" tickFormatter={(value) => `$${value / 1000}k`} />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}h`} />
                        <Tooltip formatter={(value, name) => [
                          name === 'revenue' ? `$${value}` : `${value} hours`, 
                          name === 'revenue' ? 'Revenue' : 'Billable Hours'
                        ]} />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="revenue"
                          name="Revenue"
                          stroke="#8884d8"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="billableHours"
                          name="Billable Hours"
                          stroke="#82ca9d"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Hours by Matter Type</CardTitle>
                  <CardDescription>
                    Distribution of billable hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={hoursByMatter}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => {
                            return `${name} ${(Number(percent) * 100).toFixed(0)}%`;
                          }}
                        >
                          {hoursByMatter.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => [`${value} hours`, props.payload.name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Clients by Revenue</CardTitle>
                  <CardDescription>
                    Your highest revenue generating clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topClients}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip formatter={(value, name) => [`$${value}`, 'Revenue']} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" name="Revenue">
                          {topClients.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Clients by Hours</CardTitle>
                  <CardDescription>
                    Clients requiring most billable hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topClients}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [`${value} hours`, 'Hours']} />
                        <Legend />
                        <Bar dataKey="hours" fill="#82ca9d" name="Billable Hours">
                          {topClients.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="matters" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hours by Practice Area</CardTitle>
                  <CardDescription>
                    Distribution of billable hours across practice areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hoursByMatter}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [`${value} hours`, 'Hours']} />
                        <Legend />
                        <Bar dataKey="value" fill="#82ca9d" name="Billable Hours">
                          {hoursByMatter.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Efficiency by Practice Area</CardTitle>
                  <CardDescription>
                    Efficiency ratings across different practice areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hoursByMatter}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `${(Number(value) * 100).toFixed(0)}%`} domain={[0, 1]} />
                        <Tooltip formatter={(value, name) => [`${(Number(value) * 100).toFixed(1)}%`, 'Efficiency']} />
                        <Legend />
                        <Bar dataKey="efficiency" fill="#8884d8" name="Efficiency">
                          {hoursByMatter.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Realization Rate Trend</CardTitle>
                  <CardDescription>
                    Billed vs. collected over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `${(Number(value) * 100).toFixed(0)}%`} domain={[0, 1]} />
                        <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Realization Rate']} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="realization"
                          name="Realization Rate"
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={{ fill: '#8884d8', r: 5 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Skill Assessment</CardTitle>
                  <CardDescription>
                    Performance across key legal competencies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={skillAssessment}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}/100`, 'Score']} />
                        <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="deadlines" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  Critical dates for your matters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-2 text-left font-medium">Matter</th>
                        <th className="pb-2 text-left font-medium">Task</th>
                        <th className="pb-2 text-left font-medium">Client</th>
                        <th className="pb-2 text-left font-medium">Date</th>
                        <th className="pb-2 text-left font-medium">Days Left</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {upcomingDeadlines.map((deadline, i) => (
                        <tr key={i} className="hover:bg-muted/50">
                          <td className="py-3">{deadline.matter}</td>
                          <td className="py-3">{deadline.task}</td>
                          <td className="py-3">{deadline.client}</td>
                          <td className="py-3">{deadline.date}</td>
                          <td className="py-3">
                            <Badge variant={deadline.daysLeft <= 7 ? 'destructive' : 'outline'}>
                              {deadline.daysLeft} days
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Stay informed about important events and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 rounded-lg border ${notification.read ? 'bg-background' : 'bg-primary/5 border-primary/20'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium flex items-center">
                            {!notification.read && <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>}
                            {notification.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.date}</p>
                        </div>
                        <Badge variant={notification.read ? 'outline' : 'secondary'}>
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Calendar</CardTitle>
                    <CardDescription>
                      Manage and view your scheduled events
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowCalendarDialog(true)}>
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Open Calendar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="mx-auto"
                      classNames={{
                        day_today: "bg-primary text-primary-foreground",
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Upcoming Events</h3>
                    <div className="space-y-2">
                      {calendarEvents
                        .filter(event => {
                          if (!date) return true;
                          return event.date.toDateString() === date.toDateString();
                        })
                        .map(event => (
                          <div key={event.id} className="p-3 border rounded-lg flex items-start justify-between hover:bg-muted/50">
                            <div>
                              <h4 className="font-medium">{event.title}</h4>
                              <div className="text-sm text-muted-foreground mt-1">
                                <span>{format(event.date, 'PPP')} • {event.time}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <span>{event.location}</span>
                              </div>
                            </div>
                            <Badge>{event.type}</Badge>
                          </div>
                        ))}
                        
                        {date && calendarEvents.filter(event => 
                          event.date.toDateString() === date.toDateString()
                        ).length === 0 && (
                          <div className="py-8 text-center text-muted-foreground">
                            <CalendarDays className="mx-auto h-12 w-12 opacity-20" />
                            <p className="mt-2">No events scheduled for {format(date, 'PPP')}</p>
                            <Button 
                              variant="link" 
                              onClick={() => setShowCalendarDialog(true)}
                              className="mt-1"
                            >
                              Add an event
                            </Button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {renderQueryResultsDialog}
        <CalendarDialog 
          open={showCalendarDialog} 
          onOpenChange={setShowCalendarDialog} 
        />
      </main>
    </div>
  );
};

export default AttorneyDashboard;
