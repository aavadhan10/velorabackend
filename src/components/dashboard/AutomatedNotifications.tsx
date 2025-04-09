
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle, Calendar, Clock, Filter, Bell, Scale, Gavel, FileText, Globe } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useDialogs } from '@/App';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const stateDeadlines = {
  'Connecticut': [
    { name: 'Slip-and-Fall', deadline: '2 years' },
    { name: 'Medical Malpractice', deadline: '2 years from discovery, max 3 years' },
    { name: 'Product Liability', deadline: '3 years' }
  ],
  'New York': [
    { name: 'Slip-and-Fall', deadline: '3 years' },
    { name: 'Medical Malpractice', deadline: '2.5 years' },
    { name: 'Product Liability', deadline: '3 years' }
  ],
  'Massachusetts': [
    { name: 'Slip-and-Fall', deadline: '3 years' },
    { name: 'Medical Malpractice', deadline: '3 years' },
    { name: 'Product Liability', deadline: '3 years' }
  ],
  'California': [
    { name: 'Slip-and-Fall', deadline: '2 years' },
    { name: 'Medical Malpractice', deadline: '1 year from discovery, max 3 years' },
    { name: 'Product Liability', deadline: '2 years' }
  ],
  'Florida': [
    { name: 'Slip-and-Fall', deadline: '4 years' },
    { name: 'Medical Malpractice', deadline: '2 years from discovery, max 4 years' },
    { name: 'Product Liability', deadline: '4 years' }
  ],
  'Texas': [
    { name: 'Slip-and-Fall', deadline: '2 years' },
    { name: 'Medical Malpractice', deadline: '2 years' },
    { name: 'Product Liability', deadline: '2 years' }
  ],
  'Illinois': [
    { name: 'Slip-and-Fall', deadline: '2 years' },
    { name: 'Medical Malpractice', deadline: '2 years' },
    { name: 'Product Liability', deadline: '2 years' }
  ],
  'Pennsylvania': [
    { name: 'Slip-and-Fall', deadline: '2 years' },
    { name: 'Medical Malpractice', deadline: '2 years' },
    { name: 'Product Liability', deadline: '2 years' }
  ],
};

const mockCases = [
  {
    id: 1,
    title: 'Johnson v. Memorial Hospital',
    type: 'Medical Malpractice',
    state: 'California',
    incidentDate: new Date(new Date().setDate(new Date().getDate() - 300)),
  },
  {
    id: 2,
    title: 'Smith v. Retail Store',
    type: 'Slip-and-Fall',
    state: 'New York',
    incidentDate: new Date(new Date().setDate(new Date().getDate() - 900)),
  },
  {
    id: 3,
    title: 'Williams v. ABC Manufacturing',
    type: 'Product Liability',
    state: 'Florida',
    incidentDate: new Date(new Date().setDate(new Date().getDate() - 1100)),
  },
  {
    id: 4,
    title: 'Rodriguez v. Tech Corp',
    type: 'Medical Malpractice',
    state: 'Texas',
    incidentDate: new Date(new Date().setDate(new Date().getDate() - 650)),
  },
  {
    id: 5,
    title: 'Garcia v. County Hospital',
    type: 'Medical Malpractice',
    state: 'Illinois',
    incidentDate: new Date(new Date().setDate(new Date().getDate() - 180)),
  }
];

// Court deadlines - mock data
const courtDeadlines = [
  {
    id: 101,
    title: 'Motion Response Deadline',
    case: 'Johnson v. Memorial Hospital',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    description: 'Deadline to file response to defendant\'s motion to dismiss',
    courtName: 'Northern District Court'
  },
  {
    id: 102,
    title: 'Pretrial Conference',
    case: 'Smith v. Retail Store',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    description: 'Mandatory pretrial conference with Judge Martinez',
    courtName: 'NY State Supreme Court'
  },
  {
    id: 103,
    title: 'Discovery Deadline',
    case: 'Williams v. ABC Manufacturing',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    description: 'All discovery requests must be completed',
    courtName: 'Florida Circuit Court'
  }
];

// Regulatory changes - mock data
const regulatoryAlerts = [
  {
    id: 201,
    title: 'New Privacy Regulation',
    effectiveDate: new Date(new Date().setDate(new Date().getDate() + 45)),
    description: 'CCPA-like regulations affecting client data privacy coming into effect',
    jurisdiction: 'Federal',
    relevantPracticeAreas: ['Privacy Law', 'Corporate Law']
  },
  {
    id: 202,
    title: 'Healthcare Billing Changes',
    effectiveDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    description: 'New Medicare billing requirements affecting healthcare clients',
    jurisdiction: 'Federal',
    relevantPracticeAreas: ['Healthcare Law', 'Insurance Law']
  },
  {
    id: 203,
    title: 'Employment Law Update',
    effectiveDate: new Date(new Date().setDate(new Date().getDate() + 15)),
    description: 'New employee classification requirements for gig workers',
    jurisdiction: 'California',
    relevantPracticeAreas: ['Employment Law', 'Labor Law']
  }
];

const AutomatedNotifications: React.FC = () => {
  const [filteredState, setFilteredState] = useState<string | undefined>(undefined);
  const [notifications, setNotifications] = useState<Array<{
    id: number;
    title: string;
    description: string;
    urgency: 'low' | 'medium' | 'high';
    daysLeft?: number;
    case: typeof mockCases[0];
  }>>([]);
  
  const { setCalendarOpen } = useDialogs();

  useEffect(() => {
    const generateNotifications = () => {
      const filteredCases = filteredState 
        ? mockCases.filter(c => c.state === filteredState) 
        : mockCases;
      
      const newNotifications = filteredCases.flatMap(caseItem => {
        const caseType = caseItem.type as keyof typeof stateDeadlines[keyof typeof stateDeadlines][0];
        const state = caseItem.state as keyof typeof stateDeadlines;
        
        const deadlineInfo = stateDeadlines[state]?.find(d => d.name === caseType);
        if (!deadlineInfo) return [];
        
        let deadlineYears = 0;
        if (deadlineInfo.deadline.includes('from discovery')) {
          deadlineYears = parseInt(deadlineInfo.deadline.split(' ')[0]);
        } else {
          deadlineYears = parseInt(deadlineInfo.deadline.split(' ')[0]);
        }
        
        const deadlineDate = new Date(caseItem.incidentDate);
        deadlineDate.setFullYear(deadlineDate.getFullYear() + deadlineYears);
        
        const today = new Date();
        const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysLeft <= 180) {
          let urgency: 'low' | 'medium' | 'high' = 'low';
          
          if (daysLeft <= 0) {
            urgency = 'high';
          } else if (daysLeft <= 30) {
            urgency = 'high';
          } else if (daysLeft <= 90) {
            urgency = 'medium';
          }
          
          const daysText = daysLeft <= 0 
            ? `Statute of limitations EXPIRED ${Math.abs(daysLeft)} days ago` 
            : `${daysLeft} days until statute of limitations expires`;
          
          return [{
            id: Date.now() + caseItem.id,
            title: `Deadline Alert: ${caseItem.title}`,
            description: `${caseType} case in ${state} - ${daysText}`,
            urgency,
            daysLeft,
            case: caseItem
          }];
        }
        
        return [];
      });
      
      setNotifications(newNotifications);
      
      // Show toast for high urgency notifications
      if (!filteredState) { // Only show toasts when initially loading without filters
        newNotifications
          .filter(n => n.urgency === 'high')
          .forEach(notification => {
            toast.warning(notification.title, {
              description: notification.description,
              action: {
                label: "View Calendar",
                onClick: () => console.log("Open calendar for", notification.case.title)
              },
              duration: 8000
            });
          });
      }
    };
    
    generateNotifications();
  }, [filteredState]);

  const getUrgencyStyles = (urgency: 'low' | 'medium' | 'high') => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleAddToCalendar = (notification: any) => {
    setCalendarOpen(true);
    toast.success('Added to calendar', {
      description: `Added deadline for ${notification.case.title}`
    });
  };

  const handleSetReminder = (notification: any) => {
    toast.success('Reminder set', {
      description: `You'll be reminded about ${notification.case.title} deadline`
    });
  };

  const getDaysUntilLabel = (date: Date) => {
    const today = new Date();
    const daysUntil = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil <= 0) {
      return <Badge variant="destructive">Today</Badge>;
    } else if (daysUntil <= 7) {
      return <Badge variant="destructive">{daysUntil}d remaining</Badge>;
    } else if (daysUntil <= 30) {
      return <Badge variant="warning">{daysUntil}d remaining</Badge>;
    } else {
      return <Badge variant="secondary">{daysUntil}d remaining</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Legal Alerts & Deadlines</h3>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Select value={filteredState} onValueChange={setFilteredState}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={undefined}>All States</SelectItem>
              {Object.keys(stateDeadlines).map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="statutes" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="statutes" className="flex items-center gap-1">
            <Scale className="h-4 w-4" /> 
            Statutes of Limitations
          </TabsTrigger>
          <TabsTrigger value="court" className="flex items-center gap-1">
            <Gavel className="h-4 w-4" /> 
            Court Deadlines
          </TabsTrigger>
          <TabsTrigger value="regulatory" className="flex items-center gap-1">
            <FileText className="h-4 w-4" /> 
            Regulatory Changes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="statutes" className="mt-4 space-y-3">
          {notifications.length === 0 ? (
            <Alert className="bg-slate-50 border">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertTitle>No statute of limitations alerts</AlertTitle>
              <AlertDescription>
                No urgent statute of limitations deadlines were found for the selected filter.
              </AlertDescription>
            </Alert>
          ) : (
            notifications.map(notification => (
              <Alert key={notification.id} className={`${getUrgencyStyles(notification.urgency)} border`}>
                <AlertCircle className="h-4 w-4 mr-2" />
                <div className="w-full">
                  <div className="flex justify-between items-start">
                    <AlertTitle>{notification.title}</AlertTitle>
                    {notification.daysLeft !== undefined && (
                      <span className={`text-sm font-semibold ${notification.daysLeft <= 0 ? 'text-red-600' : ''}`}>
                        {notification.daysLeft <= 0 
                          ? `Expired ${Math.abs(notification.daysLeft)}d ago` 
                          : `${notification.daysLeft}d remaining`}
                      </span>
                    )}
                  </div>
                  <AlertDescription className="mt-1">
                    {notification.description}
                  </AlertDescription>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-1 text-xs"
                      onClick={() => handleAddToCalendar(notification)}
                    >
                      <Calendar className="h-3 w-3" />
                      Add to Calendar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-1 text-xs"
                      onClick={() => handleSetReminder(notification)}
                    >
                      <Clock className="h-3 w-3" />
                      Set Reminder
                    </Button>
                  </div>
                </div>
              </Alert>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="court" className="mt-4 space-y-3">
          {courtDeadlines.map(deadline => (
            <Alert key={deadline.id} className="bg-indigo-50 text-indigo-800 border border-indigo-200">
              <Gavel className="h-4 w-4 mr-2" />
              <div className="w-full">
                <div className="flex justify-between items-start">
                  <AlertTitle>{deadline.title}</AlertTitle>
                  {getDaysUntilLabel(deadline.dueDate)}
                </div>
                <AlertDescription className="mt-1">
                  <span className="font-medium">{deadline.case}</span> - {deadline.description}
                </AlertDescription>
                <AlertDescription className="mt-0.5 text-xs text-indigo-600">
                  {deadline.courtName} • Due on {deadline.dueDate.toLocaleDateString()}
                </AlertDescription>
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="gap-1 text-xs"
                    onClick={() => {
                      setCalendarOpen(true);
                      toast.success('Added to calendar', {
                        description: `Added court deadline for ${deadline.case}`
                      });
                    }}
                  >
                    <Calendar className="h-3 w-3" />
                    Add to Calendar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="gap-1 text-xs"
                    onClick={() => {
                      toast.success('Reminder set', {
                        description: `You'll be reminded about ${deadline.title}`
                      });
                    }}
                  >
                    <Bell className="h-3 w-3" />
                    Set Reminder
                  </Button>
                </div>
              </div>
            </Alert>
          ))}
        </TabsContent>
        
        <TabsContent value="regulatory" className="mt-4 space-y-3">
          {regulatoryAlerts.map(alert => (
            <Alert key={alert.id} className="bg-emerald-50 text-emerald-800 border border-emerald-200">
              <FileText className="h-4 w-4 mr-2" />
              <div className="w-full">
                <div className="flex justify-between items-start">
                  <AlertTitle>{alert.title}</AlertTitle>
                  {getDaysUntilLabel(alert.effectiveDate)}
                </div>
                <AlertDescription className="mt-1">
                  {alert.description}
                </AlertDescription>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs bg-emerald-100/50 border-emerald-200">
                    {alert.jurisdiction}
                  </Badge>
                  {alert.relevantPracticeAreas.map(area => (
                    <Badge key={area} variant="outline" className="text-xs bg-emerald-100/50 border-emerald-200">
                      {area}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="gap-1 text-xs"
                    onClick={() => {
                      setCalendarOpen(true);
                      toast.success('Added to calendar', {
                        description: `Added regulatory change: ${alert.title}`
                      });
                    }}
                  >
                    <Calendar className="h-3 w-3" />
                    Add to Calendar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="gap-1 text-xs"
                    onClick={() => {
                      toast.success('Reminder set', {
                        description: `You'll be reminded about: ${alert.title}`
                      });
                    }}
                  >
                    <Bell className="h-3 w-3" />
                    Set Reminder
                  </Button>
                </div>
              </div>
            </Alert>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomatedNotifications;
