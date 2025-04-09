
import React, { useState } from 'react';
import { Calendar as CalendarIcon, FileText, FileUp, Plus, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventCreationFormProps {
  onSave: (event: {
    title: string;
    date: Date | undefined;
    time?: string;
    description?: string;
    caseType: string;
    files: File[];
    priority?: 'low' | 'medium' | 'high';
  }) => void;
  onCancel: () => void;
  initialDate?: Date;
}

const EventCreationForm: React.FC<EventCreationFormProps> = ({ onSave, onCancel, initialDate }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [caseType, setCaseType] = useState('');
  const [customCaseType, setCustomCaseType] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  const predefinedCaseTypes = [
    'Medical Malpractice', 
    'Slip-and-Fall', 
    'Product Liability',
    'Contract Dispute',
    'Family Law',
    'Criminal Defense',
    'Other (Custom)'
  ];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) added`, {
        description: newFiles.map(f => f.name).join(', ')
      });
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error("Please enter an event title");
      return;
    }
    
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    
    const finalCaseType = caseType === 'Other (Custom)' ? customCaseType : caseType;
    
    onSave({
      title,
      date,
      time,
      description,
      caseType: finalCaseType || 'General',
      files,
      priority
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="E.g., Client Meeting, Filing Deadline"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  setShowCalendar(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Time (optional)</Label>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input 
              id="time" 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Add more details about this event"
          className="min-h-[80px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="caseType">Case Type</Label>
          <Select 
            value={caseType} 
            onValueChange={setCaseType}
          >
            <SelectTrigger id="caseType">
              <SelectValue placeholder="Select a case type" />
            </SelectTrigger>
            <SelectContent>
              {predefinedCaseTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {caseType === 'Other (Custom)' && (
            <div className="mt-2">
              <Input
                placeholder="Enter custom case type"
                value={customCaseType}
                onChange={(e) => setCustomCaseType(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select 
            value={priority} 
            onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="files">Attach Files</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <FileUp className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500">Drag & drop files or click to browse</p>
            <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
              <FileText className="mr-2 h-4 w-4" />
              Browse files
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium mb-1">Uploaded Files:</p>
            <ul className="space-y-1">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between text-sm py-1 px-2 bg-gray-50 rounded">
                  <span className="truncate">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 p-0"
                  >
                    ✕
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>
    </form>
  );
};

export default EventCreationForm;
