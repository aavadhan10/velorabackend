
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Calendar, Plus, X } from 'lucide-react';
import EventCreationForm from './EventCreationForm';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface Event {
  id: number;
  title: string;
  date: Date;
  caseType: string;
  files: File[];
}

const CalendarDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  
  const handleAddEvent = (eventData: { title: string; date: Date | undefined; caseType: string; files: File[] }) => {
    if (!eventData.date) return;
    
    const newEvent: Event = {
      id: Date.now(),
      title: eventData.title,
      date: eventData.date,
      caseType: eventData.caseType,
      files: eventData.files
    };
    
    setEvents(prev => [...prev, newEvent]);
    setIsAddingEvent(false);
    
    toast.success('Event created successfully', {
      description: `${eventData.title} on ${eventData.date.toLocaleDateString()}`
    });
    
    // Log the files for demonstration purposes
    if (eventData.files.length > 0) {
      console.log(`Files attached to event "${eventData.title}":`, eventData.files);
    }
  };
  
  const handleDeleteEvent = (id: number) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    toast.success('Event deleted');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5" />
            Calendar
          </DialogTitle>
        </DialogHeader>
        
        {isAddingEvent ? (
          <EventCreationForm 
            onSave={handleAddEvent} 
            onCancel={() => setIsAddingEvent(false)} 
          />
        ) : (
          <div className="space-y-4">
            <Button onClick={() => setIsAddingEvent(true)} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add New Event
            </Button>
            
            <div className="rounded-md border">
              {events.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Calendar className="mx-auto h-12 w-12 opacity-20" />
                  <p className="mt-2">No events scheduled</p>
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
                  {events.map(event => (
                    <div key={event.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {event.date.toLocaleDateString()} • {event.caseType}
                          </p>
                          {event.files.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {event.files.length} file(s) attached
                            </p>
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDialog;
