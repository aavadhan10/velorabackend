import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from '../components/Sidebar';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, LineChart, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Calendar, Download, Filter, Users, Star, ChevronUp, Clock, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const satisfactionByPracticeArea = [
  { name: 'Corporate', score: 9.2, clients: 48 },
  { name: 'Litigation', score: 8.4, clients: 52 },
  { name: 'Tax', score: 8.9, clients: 31 },
  { name: 'Real Estate', score: 8.6, clients: 27 },
  { name: 'IP', score: 9.4, clients: 19 },
  { name: 'Employment', score: 8.7, clients: 23 },
];

const satisfactionTrends = [
  { month: 'Jan', score: 8.2, industry: 7.6 },
  { month: 'Feb', score: 8.3, industry: 7.7 },
  { month: 'Mar', score: 8.4, industry: 7.8 },
  { month: 'Apr', score: 8.5, industry: 7.7 },
  { month: 'May', score: 8.7, industry: 7.8 },
  { month: 'Jun', score: 8.8, industry: 7.9 },
  { month: 'Jul', score: 8.9, industry: 7.8 },
  { month: 'Aug', score: 9.0, industry: 7.9 },
  { month: 'Sep', score: 9.1, industry: 8.0 },
  { month: 'Oct', score: 9.2, industry: 8.0 },
  { month: 'Nov', score: 9.3, industry: 8.1 },
  { month: 'Dec', score: 9.4, industry: 8.1 },
];

const clientFeedbackCategories = [
  { name: 'Communication', value: 38 },
  { name: 'Responsiveness', value: 27 },
  { name: 'Expertise', value: 16 },
  { name: 'Billing', value: 11 },
  { name: 'Outcome', value: 8 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const attorneySatisfactionScores = [
  { name: 'John Smith', score: 9.7, clients: 14, change: '+0.4' },
  { name: 'Sarah Johnson', score: 9.4, clients: 12, change: '+0.2' },
  { name: 'Michael Wong', score: 9.1, clients: 10, change: '+0.5' },
  { name: 'Lisa Chen', score: 9.0, clients: 8, change: '+0.3' },
  { name: 'Robert Davis', score: 8.9, clients: 9, change: '+0.1' },
  { name: 'Emma Wilson', score: 8.7, clients: 7, change: '+0.2' },
  { name: 'James Taylor', score: 8.6, clients: 6, change: '-0.1' },
  { name: 'Patricia Garcia', score: 8.5, clients: 8, change: '+0.4' },
];

const ClientSatisfactionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('Last 12 months');
  const [practiceFilter, setPracticeFilter] = useState('All Practices');
  const [clientTypeFilter, setClientTypeFilter] = useState('All Clients');
  
  const handleBack = () => {
    navigate('/reports');
    toast.info('Returned to Reports Library');
  };
  
  const handleExportReport = () => {
    toast.success('Exporting Client Satisfaction Dashboard', {
      description: 'Your report will be available in PDF format shortly'
    });
  };
  
  const handleToolSelect = (tool: string) => {
    console.log(`Tool selected in Client Satisfaction Dashboard: ${tool}`);
    // Implement any dashboard-specific tool handling here
  };
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar 
          fileName={undefined} 
          dataLoaded={false} 
          onVisualizationSelect={() => {}} 
          onLogout={() => {}} 
          userType="managingPartner"
          onToolSelect={handleToolSelect}
        />
        
        <main className="flex-1 overflow-x-hidden p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold text-primary">Client Satisfaction Dashboard</h1>
                  <p className="text-muted-foreground">Monitor and analyze client feedback across all practice areas</p>
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
                
                <Select value={practiceFilter} onValueChange={setPracticeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Practice area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Practices">All Practices</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Litigation">Litigation</SelectItem>
                    <SelectItem value="Tax">Tax</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="IP">IP</SelectItem>
                    <SelectItem value="Employment">Employment</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={clientTypeFilter} onValueChange={setClientTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Client type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Clients">All Clients</SelectItem>
                    <SelectItem value="Corporate">Corporate Clients</SelectItem>
                    <SelectItem value="Individual">Individual Clients</SelectItem>
                    <SelectItem value="New">New Clients (&lt; 1 year)</SelectItem>
                    <SelectItem value="Established">Established Clients (&gt; 1 year)</SelectItem>
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Overall Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold">9.2</div>
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <ChevronUp className="h-4 w-4 mr-1" />
                      +0.5
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Out of 10 based on 200 client surveys</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Net Promoter Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold">72</div>
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <ChevronUp className="h-4 w-4 mr-1" />
                      +6
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Industry average: 54</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold">4.2h</div>
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <ChevronUp className="h-4 w-4 mr-1" />
                      -1.8h
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Average client inquiry response time</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Client Retention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold">94%</div>
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <ChevronUp className="h-4 w-4 mr-1" />
                      +3%
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Year-over-year client retention rate</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Satisfaction Score by Practice Area</CardTitle>
                  <CardDescription>Client satisfaction scores across different practice areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={satisfactionByPracticeArea}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[7, 10]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" name="Satisfaction Score" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Satisfaction Trend Over Time</CardTitle>
                  <CardDescription>Monthly satisfaction scores compared to industry average</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={satisfactionTrends}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[7, 10]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="score" name="Firm Score" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="industry" name="Industry Average" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Feedback Categories</CardTitle>
                  <CardDescription>Distribution of client feedback by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={clientFeedbackCategories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {clientFeedbackCategories.map((entry, index) => (
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
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Top Attorneys by Client Satisfaction</CardTitle>
                  <CardDescription>Attorneys with highest client satisfaction scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {attorneySatisfactionScores.slice(0, 5).map((attorney, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b">
                        <div className="flex items-center">
                          <div className="bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{attorney.name}</p>
                            <p className="text-xs text-muted-foreground">{attorney.clients} client reviews</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center mr-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < Math.floor(attorney.score / 2) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                            ))}
                          </div>
                          <div className="font-semibold">{attorney.score.toFixed(1)}</div>
                          <div className={`ml-2 text-xs ${attorney.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {attorney.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Client Comments</CardTitle>
                <CardDescription>Latest feedback from client satisfaction surveys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-secondary/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                          AB
                        </div>
                        <div>
                          <p className="font-medium">Acme Corporation</p>
                          <p className="text-xs text-muted-foreground">Corporate client • Oct 15, 2023</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm">"Exceptional service on our recent acquisition. The team was proactive, responsive, and went above and beyond to ensure a smooth transaction. Special mention to Sarah Johnson who was available day and night."</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-secondary/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                          TC
                        </div>
                        <div>
                          <p className="font-medium">TechStart Inc.</p>
                          <p className="text-xs text-muted-foreground">IP client • Oct 10, 2023</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-4 w-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm">"Great expertise in patent filing. The team was knowledgeable and efficient. Would appreciate more regular updates on case progress, but overall very satisfied with the outcome and expertise demonstrated."</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-secondary/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                          RD
                        </div>
                        <div>
                          <p className="font-medium">Real Developers LLC</p>
                          <p className="text-xs text-muted-foreground">Real Estate client • Oct 5, 2023</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-4 w-4 ${star <= 5 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm">"Outstanding legal work on our recent property acquisition. Complex deal with multiple stakeholders, but the team navigated it flawlessly. Particularly impressed with the creative solutions to some unusual zoning challenges."</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClientSatisfactionDashboard;
