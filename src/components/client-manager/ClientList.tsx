
import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  lastContact: string;
  nextDeadline: string;
  notes: string;
}

interface ClientListProps {
  clients: Client[];
  activeTab: string;
  onClientSelect: (client: Client) => void;
  selectedClientId?: number;
}

const ClientList: React.FC<ClientListProps> = ({ 
  clients, 
  activeTab, 
  onClientSelect,
  selectedClientId
}) => {
  // Filter clients based on activeTab
  const filteredClients = clients.filter(client => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return client.status === 'Active';
    if (activeTab === 'priority') return client.status === 'Priority';
    if (activeTab === 'on-hold') return client.status === 'On Hold';
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate days since last contact
  const getDaysSinceContact = (dateString: string) => {
    const contactDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - contactDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-2">
      {filteredClients.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No clients found matching your criteria
        </div>
      ) : (
        filteredClients.map(client => (
          <div 
            key={client.id}
            onClick={() => onClientSelect(client)}
            className={`p-3 rounded-md cursor-pointer border transition-colors ${
              selectedClientId === client.id 
                ? 'bg-primary/5 border-primary/20' 
                : 'bg-card hover:bg-muted/50 border-border'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="font-medium">{client.name}</div>
              <Badge variant={
                client.status === 'Active' ? 'default' : 
                client.status === 'Priority' ? 'warning' : 
                'secondary'
              }>
                {client.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mb-2">{client.type}</div>
            <div className="flex items-center justify-between text-xs mt-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                <span>{getDaysSinceContact(client.lastContact)} days ago</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Next: {formatDate(client.nextDeadline)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ClientList;
