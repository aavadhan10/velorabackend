import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/Sidebar";
import ClientList from "@/components/client-manager/ClientList";
import ClientDetails from "@/components/client-manager/ClientDetails";
import { SidebarProvider } from "@/components/ui/sidebar";

// Mock client data
const mockClients = [
  {
    id: 1,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 123-4567",
    type: "Personal Injury",
    status: "Active",
    lastContact: "2023-05-15",
    nextDeadline: "2023-06-10",
    notes: "Client is responsive and engaged in the case."
  },
  {
    id: 2,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "(555) 234-5678",
    type: "Corporate",
    status: "Active",
    lastContact: "2023-05-20",
    nextDeadline: "2023-06-15",
    notes: "Multiple ongoing matters related to acquisition."
  },
  {
    id: 3,
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    phone: "(555) 345-6789",
    type: "Family Law",
    status: "Priority",
    lastContact: "2023-05-22",
    nextDeadline: "2023-05-30",
    notes: "Case nearing completion, final documentation in progress."
  },
  {
    id: 4,
    name: "David Chen",
    email: "david.chen@example.com",
    phone: "(555) 456-7890",
    type: "Real Estate",
    status: "On Hold",
    lastContact: "2023-05-05",
    nextDeadline: "2023-07-01",
    notes: "Waiting on third-party documentation."
  },
  {
    id: 5,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "(555) 567-8901",
    type: "Estate Planning",
    status: "Inactive",
    lastContact: "2023-05-18",
    nextDeadline: "2023-06-20",
    notes: "Initial consultation completed, drafting documents."
  }
];

const ClientManager: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [clients, setClients] = useState(mockClients);
  
  const handleLogout = () => {
    localStorage.removeItem('attorneyLoggedIn');
    localStorage.removeItem('managingPartnerLoggedIn');
    navigate('/');
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClientSelect = (client: typeof clients[0]) => {
    setSelectedClient(client);
  };

  const handleBackToClients = () => {
    setSelectedClient(null);
  };

  const handleStatusChange = (clientId: number, newStatus: string) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === clientId 
          ? { ...client, status: newStatus } 
          : client
      )
    );
    
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient({ ...selectedClient, status: newStatus });
    }
  };

  const handleToolSelect = (tool: string) => {
    console.log(`Tool selected in Client Manager: ${tool}`);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Helmet>
          <title>Client Manager | Legal Analytics</title>
        </Helmet>
        
        <Sidebar 
          fileName={undefined}
          dataLoaded={true}
          onVisualizationSelect={() => {}}
          onLogout={handleLogout}
          userType="attorney"
          onToolSelect={handleToolSelect}
        />
        
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Client Manager</h1>
            <p className="text-muted-foreground">
              Track client status and manage communications efficiently
            </p>
          </div>

          <div className="flex gap-6">
            <div className={`${selectedClient ? 'hidden md:block' : ''} w-full md:w-1/3`}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Clients</CardTitle>
                    <Button size="sm" className="h-8 gap-1">
                      <Plus className="h-4 w-4" />
                      Add New
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search clients..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="w-full grid grid-cols-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="priority">Priority</TabsTrigger>
                      <TabsTrigger value="on-hold">On Hold</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto">
                  <ClientList 
                    clients={filteredClients} 
                    activeTab={activeTab}
                    onClientSelect={handleClientSelect}
                    selectedClientId={selectedClient?.id}
                  />
                </CardContent>
              </Card>
            </div>

            <div className={`${selectedClient ? 'w-full' : 'hidden md:block'} md:w-2/3`}>
              {selectedClient ? (
                <ClientDetails 
                  client={selectedClient} 
                  onBack={handleBackToClients}
                  onStatusChange={handleStatusChange}
                />
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center">
                  <div className="max-w-md space-y-2">
                    <h3 className="text-lg font-medium">No client selected</h3>
                    <p className="text-muted-foreground">
                      Select a client from the list to view and manage their details and communication.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ClientManager;
