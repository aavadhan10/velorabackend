
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from '../components/Sidebar';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, LineChart, PieChart, Pie, Cell, Scatter, ScatterChart, ZAxis } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Calendar, Download, Filter, Users, Briefcase, Clock, TrendingUp, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

// Mock data for litigation dashboard
const caseTypeData = [
  { name: 'Commercial', count: 42, revenue: 3850000 },
  { name: 'Employment', count: 28, revenue: 1680000 },
  { name: 'IP Disputes', count: 17, revenue: 2125000 },
  { name: 'Class Action', count: 8, revenue: 4200000 },
  { name: 'Regulatory', count: 12, revenue: 900000 },
  { name: 'Personal Injury', count: 22, revenue: 1430000 },
];

const caseStatusData = [
  { name: 'Active', value: 76 },
  { name: 'Settlement', value: 14 },
  { name: 'Pre-Filing', value: 32 },
  { name: 'Appeal', value: 8 },
  { name: 'Closed', value: 37 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const caseVolumeByMonth = [
  { month: 'Jan', newCases: 8, closedCases: 5 },
  { month: 'Feb', newCases: 12, closedCases: 7 },
  { month: 'Mar', newCases: 10, closedCases: 9 },
  { month: 'Apr', newCases: 14, closedCases: 11 },
  { month: 'May', newCases: 9, closedCases: 8 },
  { month: 'Jun', newCases: 11, closedCases: 9 },
  { month: 'Jul', newCases: 13, closedCases: 10 },
  { month: 'Aug', newCases: 15, closedCases: 12 },
  { month: 'Sep', newCases: 17, closedCases: 13 },
  { month: 'Oct', newCases: 14, closedCases: 11 },
  { month: 'Nov', newCases: 12, closedCases: 10 },
  { month: 'Dec', newCases: 10, closedCases: 8 },
];

const topCases = [
  { id: 'LC-2023-187', name: 'TechCorp v. Innovate Solutions', type: 'IP Dispute', revenue: 1250000, risk: 'Medium', progress: 65, attorney: 'John Smith' },
  { id: 'LC-2023-142', name: 'Retail Workers Class Action', type: 'Class Action', revenue: 2400000, risk: 'High', progress: 42, attorney: 'Sarah Johnson' },
  { id: 'LC-2023-201', name: 'Global Pharma Regulatory Investigation', type: 'Regulatory', revenue: 850000, risk: 'Low', progress: 78, attorney: 'Michael Wong' },
  { id: 'LC-2023-176', name: 'Merger Shareholder Dispute', type: 'Commercial', revenue: 1680000, risk: 'Medium', progress: 35, attorney: 'Lisa Chen' },
  { id: 'LC-2023-195', name: 'Executive Severance Negotiation', type: 'Employment', revenue: 520000, risk: 'Low', progress: 90, attorney: 'Robert Davis' },
];

const caseComplexityData = [
  { id: 1, complexity: 8, duration: 18, revenue: 1200000, name: 'Case A' },
  { id: 2, complexity: 9, duration: 24, revenue: 1800000, name: 'Case B' },
  { id: 3, complexity: 5, duration: 8, revenue: 600000, name: 'Case C' },
  { id: 4, complexity: 7, duration: 14, revenue: 950000, name: 'Case D' },
  { id: 5, complexity: 10, duration: 36, revenue: 3200000, name: 'Case E' },
  { id: 6, complexity: 6, duration: 12, revenue: 780000, name: 'Case F' },
  { id: 7, complexity: 8, duration: 22, revenue: 1450000, name: 'Case G' },
  { id: 8, complexity: 4, duration: 6, revenue: 420000, name: 'Case H' },
  { id: 9, complexity: 9, duration: 30, revenue: 2100000, name: 'Case I' },
  { id: 10, complexity: 7, duration: 20, revenue: 1300000, name: 'Case J' },
];

const LitigationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('Last 12 months');
  const [caseTypeFilter, setCaseTypeFilter] = useState('All Types');
  const [attorneyFilter, setAttorneyFilter] = useState('All Attorneys');
  
  const handleBack = () => {
    navigate('/reports');
    toast.info('Returned to Reports Library');
  };
  
  const handleExportReport = () => {
    toast.success('Exporting Litigation Caseload Dashboard', {
      description: 'Your report will be available in PDF format shortly'
    });
  };
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar fileName={undefined} dataLoaded={false} onVisualizationSelect={() => {}} onToolSelect={() => {}} onLogout={() => {}} userType="managingPartner" />
        
        <main className="flex-1 overflow-x-hidden p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold text-primary">Litigation Caseload Analysis</h1>
                  <p className="text-muted-foreground">Comprehensive view of litigation practice performance and caseload</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Last 3 months">Last 3 months</SelectItem>
                    <SelectItem value="Last 6 months">Last 6 months</SelectItem>
                    <SelectItem value="Last 12 months">Last 12 months</SelectItem>
                    <SelectItem value="Year to date">Year to date</SelectItem>
                    <SelectItem value="Custom range">Custom range</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={caseTypeFilter} onValueChange={setCaseTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Case type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Types">All Types</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Employment">Employment</SelectItem>
                    <SelectItem value="IP Disputes">IP Disputes</SelectItem>
                    <SelectItem value="Class Action">Class Action</SelectItem>
                    <SelectItem value="Regulatory">Regulatory</SelectItem>
                    <SelectItem value="Personal Injury">Personal Injury</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={attorneyFilter} onValueChange={setAttorneyFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Attorney" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Attorneys">All Attorneys</SelectItem>
                    <SelectItem value="John Smith">John Smith</SelectItem>
                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="Michael Wong">Michael Wong</SelectItem>
                    <SelectItem value="Lisa Chen">Lisa Chen</SelectItem>
                    <SelectItem value="Robert Davis">Robert Davis</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button onClick={handleExportReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">129</div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                    <span className="text-green-600 font-medium">+12%</span>
                    <span className="ml-1">from last year</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$14.2M</div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                    <span className="text-green-600 font-medium">+8.5%</span>
                    <span className="ml-1">year over year</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">78%</div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <span>Based on last 50 completed cases</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Case Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">14.3 mo</div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>From filing to resolution</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Cases by Type</CardTitle>
                  <CardDescription>Distribution of cases and revenue by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={caseTypeData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="count" name="Case Count" fill="#8884d8" />
                        <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Case Status Distribution</CardTitle>
                  <CardDescription>Current status of all litigation matters</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={caseStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {caseStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Case Volume Trends</CardTitle>
                <CardDescription>New vs. closed cases over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={caseVolumeByMonth}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="newCases" name="New Cases" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="closedCases" name="Closed Cases" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Cases by Revenue</CardTitle>
                <CardDescription>Highest value cases currently active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Case ID</th>
                        <th className="text-left py-3 px-4 font-medium">Case Name</th>
                        <th className="text-left py-3 px-4 font-medium">Type</th>
                        <th className="text-left py-3 px-4 font-medium">Revenue</th>
                        <th className="text-left py-3 px-4 font-medium">Risk</th>
                        <th className="text-left py-3 px-4 font-medium">Progress</th>
                        <th className="text-left py-3 px-4 font-medium">Lead Attorney</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCases.map((caseItem) => (
                        <tr key={caseItem.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 text-sm font-mono">{caseItem.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-medium">{caseItem.name}</div>
                          </td>
                          <td className="py-3 px-4">{caseItem.type}</td>
                          <td className="py-3 px-4 font-medium">${(caseItem.revenue / 1000).toFixed(0)}k</td>
                          <td className="py-3 px-4">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              caseItem.risk === 'High' ? 'bg-red-100 text-red-700' :
                              caseItem.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {caseItem.risk === 'High' ? <AlertTriangle className="h-3 w-3 mr-1" /> :
                               caseItem.risk === 'Medium' ? <Info className="h-3 w-3 mr-1" /> :
                               <CheckCircle className="h-3 w-3 mr-1" />}
                              {caseItem.risk}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Progress value={caseItem.progress} className="h-2 w-24" />
                              <span className="text-sm">{caseItem.progress}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{caseItem.attorney}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Case Complexity Analysis</CardTitle>
                <CardDescription>Relationship between case complexity, duration, and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="complexity" name="Complexity Score" unit="/10" />
                      <YAxis type="number" dataKey="duration" name="Case Duration" unit=" mo" />
                      <ZAxis type="number" dataKey="revenue" name="Revenue" unit="$" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Scatter name="Cases" data={caseComplexityData} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default LitigationDashboard;
