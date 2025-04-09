
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Bar, 
  Line, 
  Area, 
  Cell, 
  Pie
} from 'recharts';
import { InfoIcon, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Clock, Calendar, BarChart2 } from 'lucide-react';

// Mock data for visualizations
const revenueData = [
  { month: 'Jan', litigation: 42000, corporate: 35000, ip: 28000, realestate: 22000 },
  { month: 'Feb', litigation: 40000, corporate: 38000, ip: 27000, realestate: 24000 },
  { month: 'Mar', litigation: 45000, corporate: 40000, ip: 30000, realestate: 25000 },
  { month: 'Apr', litigation: 48000, corporate: 42000, ip: 32000, realestate: 26000 },
  { month: 'May', litigation: 46000, corporate: 45000, ip: 35000, realestate: 28000 },
  { month: 'Jun', litigation: 52000, corporate: 48000, ip: 38000, realestate: 30000 },
  { month: 'Jul', litigation: 58000, corporate: 52000, ip: 42000, realestate: 34000 },
  { month: 'Aug', litigation: 60000, corporate: 55000, ip: 45000, realestate: 38000 },
  { month: 'Sep', litigation: 55000, corporate: 58000, ip: 48000, realestate: 40000 },
];

const attorneyData = [
  { name: 'John Smith', revenue: 680000, clients: 15, growth: 8.2 },
  { name: 'Sarah Johnson', revenue: 720000, clients: 18, growth: 12.5 },
  { name: 'Michael Wong', revenue: 850000, clients: 12, growth: 15.8 },
  { name: 'Priya Patel', revenue: 620000, clients: 20, growth: 6.4 },
  { name: 'Robert Chen', revenue: 780000, clients: 16, growth: 10.2 },
];

const clientData = [
  { name: 'New Clients', value: 25, color: '#3b82f6' },
  { name: 'Returning', value: 65, color: '#10b981' },
  { name: 'Inactive', value: 10, color: '#f43f5e' },
];

const efficiencyData = [
  { month: 'Jan', actual: 82, target: 85 },
  { month: 'Feb', actual: 84, target: 85 },
  { month: 'Mar', actual: 86, target: 86 },
  { month: 'Apr', actual: 87, target: 87 },
  { month: 'May', actual: 89, target: 88 },
  { month: 'Jun', actual: 91, target: 89 },
  { month: 'Jul', actual: 93, target: 90 },
  { month: 'Aug', actual: 94, target: 91 },
  { month: 'Sep', actual: 95, target: 92 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const TrendsTab: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y' | 'all'>('6m');
  const [visibleTrends, setVisibleTrends] = useState<string[]>(['revenue', 'efficiency', 'attorney', 'client']);
  
  const toggleTrendVisibility = (trend: string) => {
    if (visibleTrends.includes(trend)) {
      setVisibleTrends(visibleTrends.filter(t => t !== trend));
    } else {
      setVisibleTrends([...visibleTrends, trend]);
    }
  };
  
  // Filter data by selected time range
  const getFilteredData = (data: any[]) => {
    if (timeRange === '3m') return data.slice(-3);
    if (timeRange === '6m') return data.slice(-6);
    if (timeRange === '1y') return data.slice(-9); // Using all available data as mock
    return data;
  };
  
  const filteredRevenueData = getFilteredData(revenueData);
  const filteredEfficiencyData = getFilteredData(efficiencyData);
  
  return (
    <div className="space-y-6 py-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Practice Performance Trends</h2>
        </div>
        <div className="flex space-x-2">
          <Tabs value={timeRange} onValueChange={(v: any) => setTimeRange(v)} className="w-auto">
            <TabsList className="bg-muted">
              <TabsTrigger value="3m" className="text-xs px-3">
                3 Months
              </TabsTrigger>
              <TabsTrigger value="6m" className="text-xs px-3">
                6 Months
              </TabsTrigger>
              <TabsTrigger value="1y" className="text-xs px-3">
                1 Year
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs px-3">
                All Time
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={`transition-opacity ${visibleTrends.includes('revenue') ? 'opacity-100' : 'opacity-60'}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Revenue Growth</CardTitle>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={() => toggleTrendVisibility('revenue')}
              >
                <InfoIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">$248,000</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="text-green-500 h-4 w-4" />
                  <span className="text-green-500 text-sm font-medium">+12.5%</span>
                  <span className="text-muted-foreground text-xs">vs last period</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="h-[120px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredRevenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #ccc', borderRadius: '8px', fontSize: '12px' }} 
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="litigation" 
                    stroke="#8884d8" 
                    strokeWidth={2} 
                    dot={{ r: 0 }} 
                    activeDot={{ r: 3 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="corporate" 
                    stroke="#82ca9d" 
                    strokeWidth={2} 
                    dot={{ r: 0 }} 
                    activeDot={{ r: 3 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`transition-opacity ${visibleTrends.includes('efficiency') ? 'opacity-100' : 'opacity-60'}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Utilization Rate</CardTitle>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={() => toggleTrendVisibility('efficiency')}
              >
                <InfoIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">95%</p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="text-green-500 h-4 w-4" />
                  <span className="text-green-500 text-sm font-medium">+3.2%</span>
                  <span className="text-muted-foreground text-xs">vs target</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="h-[120px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredEfficiencyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #ccc', borderRadius: '8px', fontSize: '12px' }} 
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#8884d8" 
                    fillOpacity={1} 
                    fill="url(#colorActual)" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#ff7300" 
                    strokeWidth={2} 
                    strokeDasharray="3 3" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`transition-opacity ${visibleTrends.includes('attorney') ? 'opacity-100' : 'opacity-60'}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Attorney Performance</CardTitle>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={() => toggleTrendVisibility('attorney')}
              >
                <InfoIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">$730K</p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-blue-500 text-sm font-medium">Avg. Revenue</span>
                  <span className="text-muted-foreground text-xs">per attorney</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="h-[120px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attorneyData.slice(0, 5)} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 8 }} />
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #ccc', borderRadius: '8px', fontSize: '12px' }} 
                    labelStyle={{ fontWeight: 'bold' }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#8884d8">
                    {attorneyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`transition-opacity ${visibleTrends.includes('client') ? 'opacity-100' : 'opacity-60'}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Client Distribution</CardTitle>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={() => toggleTrendVisibility('client')}
              >
                <InfoIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">65%</p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-green-500 text-sm font-medium">Returning</span>
                  <span className="text-muted-foreground text-xs">clients</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="h-[120px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={clientData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={45}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {clientData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: '#fff', border: '1px solid #ccc', borderRadius: '8px', fontSize: '12px' }} 
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends by Practice Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLitigation" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCorporate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRealestate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff8042" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff8042" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{ background: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="litigation" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorLitigation)" 
                  name="Litigation"
                />
                <Area 
                  type="monotone" 
                  dataKey="corporate" 
                  stroke="#82ca9d" 
                  fillOpacity={1} 
                  fill="url(#colorCorporate)" 
                  name="Corporate"
                />
                <Area 
                  type="monotone" 
                  dataKey="ip" 
                  stroke="#ffc658" 
                  fillOpacity={1} 
                  fill="url(#colorIp)" 
                  name="IP"
                />
                <Area 
                  type="monotone" 
                  dataKey="realestate" 
                  stroke="#ff8042" 
                  fillOpacity={1} 
                  fill="url(#colorRealestate)" 
                  name="Real Estate"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performer Growth Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attorneyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: any) => {
                      if (name === 'growth') return [`${value}%`, 'Growth Rate'];
                      if (name === 'revenue') return [`$${value.toLocaleString()}`, 'Revenue'];
                      if (name === 'clients') return [value, 'Clients'];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="growth" fill="#8884d8" name="Growth Rate (%)" />
                  <Bar dataKey="clients" fill="#82ca9d" name="Client Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Efficiency vs Target Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredEfficiencyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[75, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                    name="Actual Efficiency" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#ff7300" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    name="Target" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrendsTab;
