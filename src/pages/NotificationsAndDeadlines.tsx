
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Bell, 
  Calendar, 
  ArrowLeft,
  Filter,
  Scale,
  Gavel,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import Sidebar from '@/components/Sidebar';
import { useDialogs } from '@/App';
import { SidebarProvider } from '@/components/ui/sidebar';

// Mock data for statutes of limitations
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

// Mock cases data
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
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    description: 'Deadline to file response to defendant\'s motion to dismiss',
    courtName: 'Northern District Court'
  },
  {
    id: 102,
    title: 'Pretrial Conference',
    case: 'Smith v. Retail Store',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
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
  },
  {
    id: 104,
    title: 'Expert Witness Disclosure',
    case: 'Rodriguez v. Tech Corp',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
    description: 'Deadline to disclose expert witnesses and reports',
    courtName: 'Texas District Court'
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
  },
  {
    id: 204,
    title: 'Tax Filing Requirement Changes',
    effectiveDate: new Date(new Date().setDate(new Date().getDate() + 60)),
    description: 'Updated tax filing requirements for corporate clients',
    jurisdiction: 'Federal',
    relevantPracticeAreas: ['Tax Law', 'Corporate Law']
  }
];

const NotificationsAndDeadlines: React.FC = () => {
  const navigate = useNavigate();
  const [filterState, setFilterState] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("statutes");
  const { setCalendarOpen, setCurrentTool } = useDialogs();
  const [dataLoaded, setDataLoaded] = useState(true);
  const [fileName, setFileName] = useState("Case Data.csv");
  
  const handleToolSelect = (tool: string) => {
    setCurrentTool(tool);
    
    if (tool === 'calendar') {
      setCalendarOpen(true);
    } else if (tool === 'client') {
      navigate('/client-manager');
    }
  };
  
  const handleVisualizationSelect = () => {
    // No-op function to satisfy prop requirements
  };
  
  const handleLogout = () => {
    localStorage.removeItem('attorneyLoggedIn');
    localStorage.removeItem('managingPartnerLoggedIn');
    navigate('/');
  };
  
  const handleViewInCalendar = () => {
    setCalendarOpen(true);
  };

  const handleAddToCalendar = (itemTitle: string) => {
    setCalendarOpen(true);
    toast.success('Added to calendar', {
      description: `Added deadline for ${itemTitle}`
    });
  };

  const handleSetReminder = (itemTitle: string) => {
    toast.success('Reminder set', {
      description: `You'll be reminded about ${itemTitle} deadline`
    });
  };

  // Function to calculate days left and return appropriate styling
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

  // Generate SOL notifications based on case data and state filter
  const getStatuteOfLimitationsAlerts = () => {
    const filteredCases = filterState 
      ? mockCases.filter(c => c.state === filterState) 
      : mockCases;
    
    const notifications = filteredCases.flatMap(caseItem => {
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

    return notifications;
  };

  // Get court deadlines filtered by state if applicable
  const getFilteredCourtDeadlines = () => {
    if (!filterState) return courtDeadlines;
    
    // Match court deadlines with cases by case title
    return courtDeadlines.filter(deadline => {
      const matchingCase = mockCases.find(c => c.title === deadline.case);
      return matchingCase && matchingCase.state === filterState;
    });
  };

  // Get regulatory alerts filtered by jurisdiction if applicable
  const getFilteredRegulatoryAlerts = () => {
    if (!filterState) return regulatoryAlerts;
    
    return regulatoryAlerts.filter(alert => 
      alert.jurisdiction === filterState || alert.jurisdiction === 'Federal'
    );
  };

  const statutes = getStatuteOfLimitationsAlerts();
  const courtItems = getFilteredCourtDeadlines();
  const regulatoryItems = getFilteredRegulatoryAlerts();

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
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar 
          dataLoaded={dataLoaded}
          fileName={fileName}
          onVisualizationSelect={handleVisualizationSelect}
          onToolSelect={handleToolSelect}
          onLogout={handleLogout}
        />
        
        <div className="flex-1 p-4">
          <Helmet>
            <title>Notifications & Deadlines | Velora AI</title>
          </Helmet>
          
          <div className="container mx-auto py-6 space-y-6 max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigate('/dashboard')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <Bell className="h-6 w-6" />
                  Notifications & Deadlines
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterState} onValueChange={setFilterState}>
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
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Legal Alerts & Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  
                  {/* Statutes of Limitations Tab */}
                  <TabsContent value="statutes" className="mt-4 space-y-3">
                    {statutes.length === 0 ? (
                      <Alert className="bg-slate-50 border">
                        <Scale className="h-4 w-4 mr-2" />
                        <AlertTitle>No statute of limitations alerts</AlertTitle>
                        <AlertDescription>
                          No urgent statute of limitations deadlines were found for the selected filter.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      statutes.map(notification => (
                        <Alert key={notification.id} className={`${getUrgencyStyles(notification.urgency)} border`}>
                          <Scale className="h-4 w-4 mr-2" />
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
                                onClick={() => handleAddToCalendar(notification.case.title)}
                              >
                                <Calendar className="h-3 w-3" />
                                Add to Calendar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-1 text-xs"
                                onClick={() => handleSetReminder(notification.case.title)}
                              >
                                <Bell className="h-3 w-3" />
                                Set Reminder
                              </Button>
                            </div>
                          </div>
                        </Alert>
                      ))
                    )}
                  </TabsContent>
                  
                  {/* Court Deadlines Tab */}
                  <TabsContent value="court" className="mt-4 space-y-3">
                    {courtItems.length === 0 ? (
                      <Alert className="bg-slate-50 border">
                        <Gavel className="h-4 w-4 mr-2" />
                        <AlertTitle>No court deadlines</AlertTitle>
                        <AlertDescription>
                          No upcoming court deadlines were found for the selected filter.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      courtItems.map(deadline => (
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
                                onClick={() => handleAddToCalendar(deadline.case)}
                              >
                                <Calendar className="h-3 w-3" />
                                Add to Calendar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-1 text-xs"
                                onClick={() => handleSetReminder(deadline.title)}
                              >
                                <Bell className="h-3 w-3" />
                                Set Reminder
                              </Button>
                            </div>
                          </div>
                        </Alert>
                      ))
                    )}
                  </TabsContent>
                  
                  {/* Regulatory Changes Tab */}
                  <TabsContent value="regulatory" className="mt-4 space-y-3">
                    {regulatoryItems.length === 0 ? (
                      <Alert className="bg-slate-50 border">
                        <FileText className="h-4 w-4 mr-2" />
                        <AlertTitle>No regulatory alerts</AlertTitle>
                        <AlertDescription>
                          No upcoming regulatory changes were found for the selected filter.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      regulatoryItems.map(alert => (
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
                                onClick={() => handleAddToCalendar(alert.title)}
                              >
                                <Calendar className="h-3 w-3" />
                                Add to Calendar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-1 text-xs"
                                onClick={() => handleSetReminder(alert.title)}
                              >
                                <Bell className="h-3 w-3" />
                                Set Reminder
                              </Button>
                            </div>
                          </div>
                        </Alert>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4 bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Motion Response Deadline</h3>
                        <p className="text-sm text-muted-foreground">Johnson v. Memorial Hospital</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                          3 days left
                        </span>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Northern District Court • Jun.14.2023
                      </span>
                      <Button size="sm" variant="outline" className="gap-1" onClick={handleViewInCalendar}>
                        <Calendar className="h-3 w-3" />
                        View in Calendar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-slate-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Pretrial Conference</h3>
                        <p className="text-sm text-muted-foreground">Smith v. Retail Store</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          10 days left
                        </span>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        NY State Supreme Court • Jun.21.2023
                      </span>
                      <Button size="sm" variant="outline" className="gap-1" onClick={handleViewInCalendar}>
                        <Calendar className="h-3 w-3" />
                        View in Calendar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default NotificationsAndDeadlines;
