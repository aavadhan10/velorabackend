import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, X, Bell, Clock, Calendar as CalIcon, FileText } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from '@/components/Sidebar';
import EventCreationForm from '@/components/dialogs/EventCreationForm';
import { toast } from 'sonner';
import { SidebarProvider } from '@/components/ui/sidebar';
import AutomatedNotifications from '@/components/dashboard/AutomatedNotifications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, isSameDay, addDays, isToday, isFuture } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: number;
  title: string;
  date: Date;
  time?: string;
  description?: string;
  caseType: string;
  files: File[];
  priority?: 'low' | 'medium' | 'high';
}

const defaultEvents: Event[] = [
  {
    id: 1001,
    title: 'Initial Client Consultation',
    date: addDays(new Date(), 1),
    time: '09:30',
    description: 'First meeting to discuss case details',
    caseType: 'Medical Malpractice',
    files: [],
    priority: 'high'
  },
  {
    id: 1002,
    title: 'Document Filing Deadline',
    date: addDays(new Date(), 3),
    time: '16:00',
    description: 'Filing deadline for Smith case documents',
    caseType: 'Contract Dispute',
    files: [],
    priority: 'high'
  },
  {
    id: 1003,
    title: 'Case Review Meeting',
    date: addDays(new Date(), 5),
    time: '14:30',
    description: 'Internal team meeting to review progress',
    caseType: 'Product Liability',
    files: [],
    priority: 'medium'
  },
  {
    id: 1004,
    title: 'Court Appearance',
    date: addDays(new Date(), 7),
    time: '10:00',
    description: 'Scheduled court appearance for Johnson case',
    caseType: 'Criminal Defense',
    files: [],
    priority: 'high'
  },
  {
    id: 1005,
    title: 'Client Follow-up',
    date: new Date(),
    time: '13:00',
    description: 'Follow-up call with client',
    caseType: 'Family Law',
    files: [],
    priority: 'medium'
  }
];

const CalendarPage: React.FC = () => {
  const [dataLoaded, setDataLoaded] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("calendar");
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  
  useEffect(() => {
    setEvents(defaultEvents);
    setAllEvents(defaultEvents);
  }, []);

  const handleAddEvent = (eventData: { 
    title: string; 
    date: Date | undefined; 
    time?: string;
    description?: string;
    caseType: string; 
    files: File[];
    priority?: 'low' | 'medium' | 'high';
  }) => {
    if (!eventData.date) return;
    
    const newEvent: Event = {
      id: Date.now(),
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      description: eventData.description,
      caseType: eventData.caseType,
      files: eventData.files,
      priority: eventData.priority
    };
    
    setEvents(prev => [...prev, newEvent]);
    setAllEvents(prev => [...prev, newEvent]);
    setIsAddingEvent(false);
    
    toast.success('Event created successfully', {
      description: `${eventData.title} on ${eventData.date.toLocaleDateString()}`
    });
  };
  
  const handleDeleteEvent = (id: number) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    setAllEvents(prev => prev.filter(event => event.id !== id));
    toast.success('Event deleted');
  };
  
  const getFilteredEvents = (date: Date | undefined) => {
    if (!date) return [];
    
    return allEvents.filter(event => 
      isSameDay(event.date, date)
    );
  };

  const filteredEvents = getFilteredEvents(selectedDate);

  const hasEvents = (date: Date) => {
    return allEvents.some(event => isSameDay(event.date, date));
  };

  const getUpcomingEvents = () => {
    return allEvents
      .filter(event => isFuture(event.date) || (isToday(event.date) && event.time && event.time > format(new Date(), 'HH:mm')))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const upcomingEvents = getUpcomingEvents();

  const renderDay = (day: Date) => {
    const hasEventsOnDay = hasEvents(day);
    const isHighPriority = allEvents.some(event => 
      isSameDay(event.date, day) && event.priority === 'high'
    );
    
    return (
      <div className="relative">
        <div>{day.getDate()}</div>
        {hasEventsOnDay && (
          <div 
            className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
              isHighPriority ? 'bg-red-500' : 'bg-primary'
            }`} 
          />
        )}
      </div>
    );
  };

  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleToolSelect = (tool: string) => {
    console.log(`Tool selected in Calendar: ${tool}`);
    // Implement any calendar-specific tool handling here
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar 
          dataLoaded={dataLoaded} 
          onVisualizationSelect={() => {}}
          onToolSelect={handleToolSelect}
        />
        
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Calendar & Deadlines</h1>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setActiveTab("notifications")} className={activeTab === "notifications" ? "bg-secondary" : ""}>
                <Bell className="mr-2 h-4 w-4" />
                Notifications & Deadlines
              </Button>
              <Button onClick={() => setIsAddingEvent(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Event
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="calendar" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="calendar" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" /> 
                Calendar
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-1">
                <Bell className="h-4 w-4" /> 
                Notifications & Deadlines
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CalIcon className="mr-2 h-5 w-5" />
                      Calendar View
                    </CardTitle>
                    <CardDescription>Select a date to see events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border pointer-events-auto"
                      components={{
                        DayContent: ({ date }: { date: Date }) => 
                          renderDay(date)
                      }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedDate ? (
                        `Events for ${format(selectedDate, "PPPP")}`
                      ) : (
                        "Events"
                      )}
                    </CardTitle>
                    <CardDescription>
                      {filteredEvents.length === 0 
                        ? "No events scheduled for this day" 
                        : `${filteredEvents.length} event(s) scheduled`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isAddingEvent ? (
                      <EventCreationForm 
                        onSave={handleAddEvent} 
                        onCancel={() => setIsAddingEvent(false)} 
                        initialDate={selectedDate}
                      />
                    ) : (
                      <div className="space-y-4">
                        {filteredEvents.length === 0 ? (
                          <div className="py-12 text-center text-muted-foreground">
                            <CalendarIcon className="mx-auto h-12 w-12 opacity-20" />
                            <p className="mt-2">No events scheduled for this day</p>
                            <Button 
                              variant="link" 
                              onClick={() => setIsAddingEvent(true)}
                              className="mt-1"
                            >
                              Create your first event
                            </Button>
                          </div>
                        ) : (
                          <div className="divide-y">
                            {filteredEvents.map(event => (
                              <div key={event.id} className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-medium">{event.title}</h3>
                                      {event.priority && (
                                        <Badge className={getPriorityColor(event.priority)}>
                                          {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                      <Clock className="mr-1 h-3 w-3" />
                                      {event.time ? event.time : 'All day'} • {event.caseType}
                                    </div>
                                    {event.description && (
                                      <p className="text-sm mt-2">{event.description}</p>
                                    )}
                                    {event.files.length > 0 && (
                                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                                        <FileText className="mr-1 h-3 w-3" />
                                        {event.files.length} file(s) attached
                                      </div>
                                    )}
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDeleteEvent(event.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>View and manage all upcoming events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Event</TableHead>
                          <TableHead>Case Type</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingEvents.length > 0 ? (
                          upcomingEvents.map(event => (
                            <TableRow 
                              key={event.id}
                              className={isToday(event.date) ? "bg-muted/30" : ""}
                            >
                              <TableCell>
                                <div className="font-medium">
                                  {format(event.date, "MMM d, yyyy")}
                                </div>
                                {isToday(event.date) && (
                                  <Badge className="bg-primary/20 text-primary hover:bg-primary/30 mt-1">
                                    Today
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{event.time || 'All day'}</TableCell>
                              <TableCell>
                                <div className="font-medium">{event.title}</div>
                                {event.description && (
                                  <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                    {event.description}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>{event.caseType}</TableCell>
                              <TableCell>
                                {event.priority && (
                                  <Badge className={getPriorityColor(event.priority)}>
                                    {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDate(event.date);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                >
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteEvent(event.id)}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                              No upcoming events scheduled
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Notifications & Deadlines
                  </CardTitle>
                  <CardDescription>
                    Upcoming deadlines and important legal notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AutomatedNotifications />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CalendarPage;
