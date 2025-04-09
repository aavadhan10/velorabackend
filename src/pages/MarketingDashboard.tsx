
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from '../components/Sidebar';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, LineChart, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Calendar, Download, Filter, Target, TrendingUp, DollarSign, Users, Megaphone, Globe, Mail, PenTool, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

// Mock data for marketing dashboard
const channelPerformance = [
  { name: 'Thought Leadership', leads: 84, clients: 18, cost: 45000, roi: 4.2 },
  { name: 'Digital Ads', leads: 126, clients: 12, cost: 65000, roi: 2.8 },
  { name: 'Events', leads: 52, clients: 14, cost: 85000, roi: 3.5 },
  { name: 'Referrals', leads: 38, clients: 22, cost: 20000, roi: 8.7 },
  { name: 'Email', leads: 78, clients: 9, cost: 15000, roi: 3.8 },
  { name: 'Website SEO', leads: 104, clients: 16, cost: 35000, roi: 4.1 },
];

const roiTrends = [
  { month: 'Jan', roi: 2.4, benchmark: 2.0 },
  { month: 'Feb', roi: 2.6, benchmark: 2.0 },
  { month: 'Mar', roi: 2.8, benchmark: 2.1 },
  { month: 'Apr', roi: 3.2, benchmark: 2.1 },
  { month: 'May', roi: 3.6, benchmark: 2.2 },
  { month: 'Jun', roi: 3.9, benchmark: 2.2 },
  { month: 'Jul', roi: 4.1, benchmark: 2.3 },
  { month: 'Aug', roi: 4.3, benchmark: 2.3 },
  { month: 'Sep', roi: 4.5, benchmark: 2.4 },
  { month: 'Oct', roi: 4.7, benchmark: 2.4 },
  { month: 'Nov', roi: 4.9, benchmark: 2.5 },
  { month: 'Dec', roi: 5.2, benchmark: 2.5 },
];

const leadSources = [
  { name: 'Website', value: 35 },
  { name: 'Referrals', value: 25 },
  { name: 'Events', value: 15 },
  { name: 'Content', value: 15 },
  { name: 'Advertising', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const campaignPerformance = [
  { name: 'IP Protection Webinar', leads: 42, conversion: 28, roi: 3.8, status: 'Active' },
  { name: 'M&A Advisory Series', leads: 36, conversion: 32, roi: 4.5, status: 'Active' },
  { name: 'Employment Law Updates', leads: 28, conversion: 22, roi: 2.9, status: 'Active' },
  { name: 'Real Estate Investment Guide', leads: 22, conversion: 36, roi: 4.2, status: 'Active' },
  { name: 'Corporate Restructuring Whitepaper', leads: 18, conversion: 45, roi: 5.1, status: 'Completed' },
];

const monthlyMarketingData = [
  { month: 'Jan', spend: 22000, leads: 42, clients: 6 },
  { month: 'Feb', spend: 24000, leads: 48, clients: 7 },
  { month: 'Mar', spend: 26000, leads: 52, clients: 8 },
  { month: 'Apr', spend: 28000, leads: 58, clients: 9 },
  { month: 'May', spend: 32000, leads: 64, clients: 10 },
  { month: 'Jun', spend: 35000, leads: 72, clients: 11 },
  { month: 'Jul', spend: 38000, leads: 78, clients: 12 },
  { month: 'Aug', spend: 42000, leads: 84, clients: 14 },
  { month: 'Sep', spend: 45000, leads: 92, clients: 15 },
  { month: 'Oct', spend: 48000, leads: 96, clients: 16 },
  { month: 'Nov', spend: 52000, leads: 104, clients: 18 },
  { month: 'Dec', spend: 55000, leads: 112, clients: 20 },
];

const practiceAreaAttribution = [
  { name: 'Corporate', percentage: 35, growth: '+12%' },
  { name: 'Litigation', percentage: 25, growth: '+8%' },
  { name: 'Real Estate', percentage: 15, growth: '+5%' },
  { name: 'IP', percentage: 12, growth: '+18%' },
  { name: 'Tax', percentage: 8, growth: '+3%' },
  { name: 'Employment', percentage: 5, growth: '+6%' },
];

const MarketingDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('Last 12 months');
  const [channelFilter, setChannelFilter] = useState('All Channels');
  const [campaignFilter, setCampaignFilter] = useState('All Campaigns');
  
  const handleBack = () => {
    navigate('/reports');
    toast.info('Returned to Reports Library');
  };
  
  const handleExportReport = () => {
    toast.success('Exporting Marketing ROI Dashboard', {
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
                  <h1 className="text-2xl font-semibold text-primary">Marketing ROI Analysis</h1>
                  <p className="text-muted-foreground">Performance metrics across all marketing channels and campaigns</p>
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
                
                <Select value={channelFilter} onValueChange={setChannelFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Megaphone className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Channels">All Channels</SelectItem>
                    <SelectItem value="Thought Leadership">Thought Leadership</SelectItem>
                    <SelectItem value="Digital Ads">Digital Ads</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Referrals">Referrals</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Website SEO">Website SEO</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Target className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Campaigns">All Campaigns</SelectItem>
                    <SelectItem value="IP Protection Webinar">IP Protection Webinar</SelectItem>
                    <SelectItem value="M&A Advisory Series">M&A Advisory Series</SelectItem>
                    <SelectItem value="Employment Law Updates">Employment Law Updates</SelectItem>
                    <SelectItem value="Real Estate Investment Guide">Real Estate Investment</SelectItem>
                    <SelectItem value="Corporate Restructuring Whitepaper">Corporate Restructuring</SelectItem>
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Overall ROI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold">4.2x</div>
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +0.8x
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Return on marketing investment</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Annual Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold">$447K</div>
                    <div className="text-sm font-medium">
                      <span className="text-green-600">82%</span> utilized
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total marketing spend</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Lead Conversion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold">24.5%</div>
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +3.2%
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Leads to client conversion rate</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Client Acquisition Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold">$8,240</div>
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      -$420
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Average cost per new client</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Channel Performance</CardTitle>
                  <CardDescription>ROI and lead generation by marketing channel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={channelPerformance}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="leads" name="Leads Generated" fill="#8884d8" />
                        <Bar yAxisId="right" dataKey="roi" name="ROI (multiplier)" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>ROI Trend Analysis</CardTitle>
                  <CardDescription>Monthly ROI compared to industry benchmark</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={roiTrends}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="roi" name="Firm ROI" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="benchmark" name="Industry Benchmark" stroke="#82ca9d" strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Lead Sources</CardTitle>
                  <CardDescription>Distribution of leads by acquisition channel</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leadSources}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {leadSources.map((entry, index) => (
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
                  <CardTitle>Marketing Performance Over Time</CardTitle>
                  <CardDescription>Monthly spend, leads, and client acquisition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={monthlyMarketingData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="leads" name="Leads" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="clients" name="New Clients" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Metrics for active and recent marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Campaign</th>
                        <th className="text-left py-3 px-4 font-medium">Leads</th>
                        <th className="text-left py-3 px-4 font-medium">Conversion Rate</th>
                        <th className="text-left py-3 px-4 font-medium">ROI</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaignPerformance.map((campaign, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{campaign.name}</div>
                          </td>
                          <td className="py-3 px-4">{campaign.leads}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-16 bg-secondary rounded-full h-2 mr-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${campaign.conversion}%` }}
                                ></div>
                              </div>
                              <span>{campaign.conversion}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">{campaign.roi}x</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              campaign.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {campaign.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Practice Area Attribution</CardTitle>
                  <CardDescription>Marketing-driven revenue by practice area</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {practiceAreaAttribution.map((area, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span>{area.name}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{area.percentage}%</span>
                            <span className="text-xs text-green-600">{area.growth}</span>
                          </div>
                        </div>
                        <Progress value={area.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Key Insights & Recommendations</CardTitle>
                  <CardDescription>AI-generated marketing strategy recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Award className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span><span className="font-medium">Thought leadership content</span> delivers the highest quality leads with 28% higher conversion rate than other channels.</span>
                    </li>
                    <li className="flex items-start">
                      <Target className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span><span className="font-medium">Digital advertising ROI</span> has improved 72% after implementing targeted account-based marketing for specific industries.</span>
                    </li>
                    <li className="flex items-start">
                      <Globe className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span><span className="font-medium">Industry events</span> yield 3.2x return on investment, with highest conversion rates for IP and Corporate practice areas.</span>
                    </li>
                    <li className="flex items-start">
                      <Mail className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span><span className="font-medium">Email campaigns</span> to existing clients have 24% conversion rate for additional services, representing a significant cross-selling opportunity.</span>
                    </li>
                    <li className="flex items-start">
                      <PenTool className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span><span className="font-medium">Content strategy</span> should be realigned to focus more on Tax and IP practices which show strongest growth potential based on lead quality metrics.</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MarketingDashboard;
