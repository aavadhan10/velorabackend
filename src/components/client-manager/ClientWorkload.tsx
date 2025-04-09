
import React from 'react';
import { BarChart4, PieChart, Users, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie, 
  Cell,
  Legend 
} from 'recharts';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  billedHours: number;
  totalMatters: number;
  caseProgress: number;
  lastContact: string;
  nextDeadline: string;
  notes: string;
}

interface ClientWorkloadProps {
  clients: Client[];
}

const ClientWorkload: React.FC<ClientWorkloadProps> = ({ clients }) => {
  // Create data for charts
  const clientsByType = clients.reduce((acc, client) => {
    if (!acc[client.type]) {
      acc[client.type] = { name: client.type, count: 0, hours: 0, matters: 0 };
    }
    acc[client.type].count += 1;
    acc[client.type].hours += client.billedHours;
    acc[client.type].matters += client.totalMatters;
    return acc;
  }, {} as Record<string, { name: string; count: number; hours: number; matters: number }>);
  
  const typeData = Object.values(clientsByType);
  
  // Data for pie chart
  const caseStatusData = clients.reduce((acc, client) => {
    if (!acc[client.status]) {
      acc[client.status] = { name: client.status, value: 0 };
    }
    acc[client.status].value += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);
  
  const pieData = Object.values(caseStatusData);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Top clients by billed hours
  const topClients = [...clients]
    .sort((a, b) => b.billedHours - a.billedHours)
    .slice(0, 5);
  
  // Summary stats
  const totalHours = clients.reduce((sum, client) => sum + client.billedHours, 0);
  const totalMatters = clients.reduce((sum, client) => sum + client.totalMatters, 0);
  const activeClients = clients.filter(client => client.status === 'Active').length;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Billed Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{totalHours}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{activeClients}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Matters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{totalMatters}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Client Types</CardTitle>
                <CardDescription>Distribution of clients by type</CardDescription>
              </div>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Billed Hours by Practice Area</CardTitle>
                <CardDescription>Hours distribution across practice areas</CardDescription>
              </div>
              <BarChart4 className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={typeData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#3b82f6" name="Billed Hours" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Clients by Billed Hours</CardTitle>
          <CardDescription>Clients with the highest billable hours</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Billed Hours</TableHead>
                <TableHead>Total Matters</TableHead>
                <TableHead>Case Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topClients.map(client => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.type}</TableCell>
                  <TableCell>{client.status}</TableCell>
                  <TableCell>{client.billedHours} hrs</TableCell>
                  <TableCell>{client.totalMatters}</TableCell>
                  <TableCell>{client.caseProgress}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientWorkload;
