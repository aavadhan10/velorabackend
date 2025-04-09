
import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

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

interface ClientDetailsProps {
  client: Client;
  onBack: () => void;
  onStatusChange: (clientId: number, newStatus: string) => void;
}

// Mock communication history
const mockCommunications = [
  { id: 1, type: "Email", date: "2023-05-15", subject: "Case Update", summary: "Sent status update on insurance claim" },
  { id: 2, type: "Phone", date: "2023-05-10", subject: "Initial Consultation", summary: "Discussed case details and next steps" },
  { id: 3, type: "Message", date: "2023-05-05", subject: "Document Request", summary: "Requested medical records and police report" }
];

const ClientDetails: React.FC<ClientDetailsProps> = ({ client, onBack, onStatusChange }) => {
  const [messageText, setMessageText] = useState('');
  
  const form = useForm({
    defaultValues: {
      status: client.status
    }
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleCall = () => {
    toast.success(`Calling ${client.name}`, {
      description: `Dialing ${client.phone}...`,
    });
  };

  const handleEmail = () => {
    toast.success(`Composing email to ${client.name}`, {
      description: `Opening email to ${client.email}...`,
    });
  };

  const handleMessage = () => {
    if (!messageText.trim()) {
      toast.warning("Can't send empty message", { 
        description: "Please type a message first" 
      });
      return;
    }
    
    toast.success(`Message sent to ${client.name}`, {
      description: `"${messageText.substring(0, 30)}${messageText.length > 30 ? '...' : ''}" has been sent`,
    });
    setMessageText('');
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(client.id, newStatus);
    toast.success(`Status updated`, {
      description: `${client.name}'s status changed to ${newStatus}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 mr-2" 
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Clients
        </Button>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={onBack}>Clients</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{client.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{client.name}</CardTitle>
              <CardDescription>{client.type}</CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={client.status === 'Active' ? 'default' : client.status === 'Inactive' ? 'secondary' : 'warning'}>
                {client.status}
              </Badge>
              
              <Select 
                defaultValue={client.status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Priority">Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Contact Information</div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Last Contact</div>
              <div className="text-sm">
                {formatDate(client.lastContact)}
              </div>
              <div className="text-sm font-medium text-muted-foreground mt-2">Notes</div>
              <div className="text-sm p-2 bg-muted/30 rounded-md">{client.notes}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 border-t pt-4">
          <Button variant="outline" size="sm" className="gap-1" onClick={handleCall}>
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={handleEmail}>
            <Mail className="h-4 w-4" />
            Email
          </Button>
        </CardFooter>
      </Card>
      
      <Tabs defaultValue="message">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="message">Quick Message</TabsTrigger>
          <TabsTrigger value="communication">Communication History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="message" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Send Quick Message</CardTitle>
              <CardDescription>Send a text message directly to this client</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Type your message here..."
                className="min-h-[120px]"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" size="sm">
                Use Template
              </Button>
              <Button size="sm" className="gap-1" onClick={handleMessage}>
                <MessageSquare className="h-4 w-4" />
                Send Message
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="communication" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Communication History</CardTitle>
              <CardDescription>Recent interactions with this client</CardDescription>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-3">
                {mockCommunications.map(comm => (
                  <div key={comm.id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {comm.type === 'Email' && <Mail className="h-4 w-4" />}
                        {comm.type === 'Phone' && <Phone className="h-4 w-4" />}
                        {comm.type === 'Message' && <MessageSquare className="h-4 w-4" />}
                        <span className="font-medium">{comm.type}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(comm.date)}</span>
                    </div>
                    <div className="text-sm font-medium">{comm.subject}</div>
                    <div className="text-sm text-muted-foreground">{comm.summary}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetails;
