
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AlertCircle, Calendar, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useDialogs } from '@/App';

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
  }
];

const AutomatedNotifications: React.FC = () => {
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
    // Set a small delay to make sure toast appears after component mounts
    const timer = setTimeout(() => {
      const generateNotifications = () => {
        const newNotifications = mockCases.flatMap(caseItem => {
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
        
        // Show toast notification for high urgency items
        newNotifications
          .filter(n => n.urgency === 'high')
          .forEach(notification => {
            toast.warning(notification.title, {
              description: notification.description,
              action: {
                label: "View Calendar",
                onClick: () => handleAddToCalendar(notification)
              },
              duration: 8000
            });
          });
      };
      
      generateNotifications();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

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

  if (notifications.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Statute of Limitations Alerts</h3>
        <Alert className="bg-slate-50 border">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>No urgent deadlines</AlertTitle>
          <AlertDescription>
            No statute of limitations deadlines require attention at this time.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-3">
      <h3 className="text-lg font-medium">Statute of Limitations Alerts</h3>
      
      {notifications.map(notification => (
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
      ))}
    </div>
  );
};

export default AutomatedNotifications;
