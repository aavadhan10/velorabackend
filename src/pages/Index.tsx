import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Briefcase, 
  ChevronRight,
  ChevronDown, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  Calendar, 
  BarChart4, 
  Scale,
  Bot,
  ClipboardList,
  Clock,
  FileText,
  LineChart,
  PieChart,
  TrendingUp,
  ArrowRight,
  ArrowDown,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  User,
  Sparkles,
  Play
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import WaitlistForm from '@/components/WaitlistForm';

const Index = () => {
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [animatedData, setAnimatedData] = useState<any[]>([]);
  const [aiMessage, setAiMessage] = useState('');
  const [userQuery, setUserQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);
  
  const conversation = [
    { 
      query: "Show me the success rate for Smith & Johnson litigation cases from last quarter",
      response: "The success rate for Smith & Johnson litigation cases last quarter was 78%, which is a 12% increase from the previous quarter. Would you like to see the breakdown by case type?" 
    },
    { 
      query: "How does that compare to Davis & Partners?",
      response: "Smith & Johnson's 78% success rate outperforms Davis & Partners by 15%. Their litigation success rate was 63% last quarter, with particular weakness in corporate litigation (52% success)." 
    },
    { 
      query: "What's our average time to settlement?",
      response: "Your firm's average time to settlement is 4.2 months, which is 28% faster than the industry average of 5.8 months. Corporate cases settle quickest at 3.1 months on average."
    }
  ];
  
  const growthChartData = [
    { month: 'Jan', litigation: 18, corporate: 15, ip: 12, realestate: 10 },
    { month: 'Feb', litigation: 22, corporate: 18, ip: 14, realestate: 13 },
    { month: 'Mar', litigation: 28, corporate: 21, ip: 17, realestate: 16 },
    { month: 'Apr', litigation: 32, corporate: 26, ip: 19, realestate: 18 },
    { month: 'May', litigation: 35, corporate: 31, ip: 22, realestate: 20 },
    { month: 'Jun', litigation: 42, corporate: 35, ip: 28, realestate: 23 },
    { month: 'Jul', litigation: 48, corporate: 41, ip: 32, realestate: 27 },
    { month: 'Aug', litigation: 53, corporate: 47, ip: 36, realestate: 30 },
    { month: 'Sep', litigation: 58, corporate: 52, ip: 42, realestate: 35 },
    { month: 'Oct', litigation: 65, corporate: 58, ip: 48, realestate: 40 },
    { month: 'Nov', litigation: 72, corporate: 65, ip: 54, realestate: 46 },
    { month: 'Dec', litigation: 78, corporate: 71, ip: 60, realestate: 52 },
  ];
  
  useEffect(() => {
    if (isTyping) {
      const currentResponse = conversation[conversationStep].response;
      let charIndex = 0;
      
      const typingInterval = window.setInterval(() => {
        if (charIndex <= currentResponse.length) {
          setAiMessage(currentResponse.substring(0, charIndex));
          charIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
          
          setTimeout(() => {
            const nextStep = (conversationStep + 1) % conversation.length;
            setConversationStep(nextStep);
            setUserQuery('');
            startUserTyping(nextStep);
          }, 4000);
        }
      }, 80);
      
      return () => {
        clearInterval(typingInterval);
      };
    }
  }, [isTyping, conversationStep]);
  
  const startUserTyping = (step: number) => {
    setIsUserTyping(true);
    const nextUserQuery = conversation[step].query;
    let userCharIndex = 0;
    
    const userTypingInterval = window.setInterval(() => {
      if (userCharIndex <= nextUserQuery.length) {
        setUserQuery(nextUserQuery.substring(0, userCharIndex));
        userCharIndex++;
      } else {
        clearInterval(userTypingInterval);
        setIsUserTyping(false);
        setTimeout(() => {
          setIsTyping(true);
        }, 1000);
      }
    }, 120);
    
    return () => clearInterval(userTypingInterval);
  };
  
  useEffect(() => {
    setTimeout(() => {
      startUserTyping(0);
    }, 2000);
    
    return () => {};
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedData([growthChartData[0]]);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (animatedData.length < growthChartData.length) {
      const timer = setTimeout(() => {
        setAnimatedData(prevData => [
          ...prevData, 
          growthChartData[prevData.length]
        ]);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [animatedData]);

  const handleManagingPartnerLogin = () => {
    navigate('/managing-partner-login');
  };

  const handleAttorneyLogin = () => {
    navigate('/attorney-login');
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen purple-soft-bg overflow-x-hidden">
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollPosition > 20 ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Scale className="h-6 w-6 text-primary" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold tracking-tight text-primary">Velora AI</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">About</a>
            <a href="#waitlist" onClick={(e) => { e.preventDefault(); scrollToWaitlist(); }} className="text-sm font-medium hover:text-primary transition-colors">Get on Waitlist</a>
          </nav>
          
          <div className="space-x-2 hidden md:block">
            <Button variant="outline" onClick={handleAttorneyLogin} size="sm">
              Attorney Login
            </Button>
            <Button onClick={handleManagingPartnerLogin} size="sm">
              Managing Partner Login
            </Button>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 purple-gradient-bg"></div>
        <div className="container mx-auto px-4 relative z-10">
          
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">The Future of </span> 
              <span className="text-gray-900 dark:text-white">Law Firm Efficiency</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"> is Here.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <strong>Velora AI</strong> automates your back-office, saving time, reducing errors, and letting you focus on what matters most—your clients.
            </p>
            
            <div className="flex justify-center pt-6">
              <Button size="lg" onClick={handleManagingPartnerLogin} className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
        
        <div className="relative max-w-5xl mx-auto mt-16 px-4">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Case Completion</span>
                </div>
                <p className="text-3xl font-bold">87%</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>12% increase</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Client Retention</span>
                </div>
                <p className="text-3xl font-bold">92%</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>5% increase</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Revenue Growth</span>
                </div>
                <p className="text-3xl font-bold">23%</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>8% increase</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Task Efficiency</span>
                </div>
                <p className="text-3xl font-bold">78%</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>15% increase</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-12">
              <div className="h-[350px] w-full mb-6">
                <h3 className="text-lg font-semibold mb-2">Law Practice Growth</h3>
                <div className="text-sm text-muted-foreground mb-4">Growth trends across practice areas (percentage)</div>
                
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={animatedData} 
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorLitigation" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorCorporate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorIp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F97316" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorRealestate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D946EF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#D946EF" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 10, fill: '#888' }}
                      axisLine={{ stroke: '#eee' }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: '#888' }}
                      axisLine={false}
                      tickLine={false}
                      width={25}
                    />
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: 'none',
                      }}
                      labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
                      formatter={(value: any) => [`${value}%`, '']}
                    />
                    <Legend 
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="litigation" 
                      name="Litigation" 
                      stroke="#8B5CF6" 
                      fillOpacity={1} 
                      fill="url(#colorLitigation)" 
                      strokeWidth={2}
                      activeDot={{ 
                        r: 6, 
                        stroke: '#8B5CF6', 
                        strokeWidth: 2, 
                        fill: 'white',
                        className: 'animate-pulse'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="corporate" 
                      name="Corporate" 
                      stroke="#0EA5E9" 
                      fillOpacity={1} 
                      fill="url(#colorCorporate)" 
                      strokeWidth={2}
                      activeDot={{ 
                        r: 6, 
                        stroke: '#0EA5E9', 
                        strokeWidth: 2, 
                        fill: 'white',
                        className: 'animate-pulse'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ip" 
                      name="Intellectual Property" 
                      stroke="#F97316" 
                      fillOpacity={1} 
                      fill="url(#colorIp)" 
                      strokeWidth={2}
                      activeDot={{ 
                        r: 6, 
                        stroke: '#F97316', 
                        strokeWidth: 2, 
                        fill: 'white',
                        className: 'animate-pulse'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="realestate" 
                      name="Real Estate" 
                      stroke="#D946EF" 
                      fillOpacity={1} 
                      fill="url(#colorRealestate)" 
                      strokeWidth={2}
                      activeDot={{ 
                        r: 6, 
                        stroke: '#D946EF', 
                        strokeWidth: 2, 
                        fill: 'white',
                        className: 'animate-pulse'
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 mt-8">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Litigation</div>
                  <div className="text-xl font-semibold text-purple-600">78%</div>
                  <div className="text-xs text-green-600">+12% growth</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Corporate</div>
                  <div className="text-xl font-semibold text-blue-600">71%</div>
                  <div className="text-xs text-green-600">+8% growth</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">IP</div>
                  <div className="text-xl font-semibold text-orange-600">60%</div>
                  <div className="text-xs text-green-600">+7% growth</div>
                </div>
                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground">Real Estate</div>
                  <div className="text-xl font-semibold text-pink-600">52%</div>
                  <div className="text-xs text-green-600">+5% growth</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-purple-50/80 dark:bg-gray-900/80">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none">
              Core Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Powerful Tools for Data-Driven Law Firms
            </h2>
            <p className="text-lg text-muted-foreground">
              Our AI-driven tools go beyond visualization to provide intelligent insights that transform your legal practice.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto mb-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 bg-primary/10 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Velora AI Assistant</h3>
            </div>
            
            <div className="p-6 space-y-4 h-96 overflow-y-auto">
              {userQuery && (
                <div className="flex gap-4 justify-end">
                  <div className="max-w-3xl bg-primary text-primary-foreground p-4 rounded-lg">
                    <div className="whitespace-pre-wrap">
                      {userQuery}
                      {isUserTyping && (
                        <span className="inline-block w-2 h-4 ml-1 bg-white animate-pulse"></span>
                      )}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
              )}
              
              {aiMessage && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="max-w-3xl bg-card border border-border shadow-sm p-4 rounded-lg">
                    <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
                      <Sparkles className="h-3 w-3" />
                      <span>Velora AI</span>
                    </div>
                    <div className="whitespace-pre-wrap">
                      {aiMessage}
                      {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse"></span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <input 
                    type="text" 
                    placeholder="Ask Velora AI about your legal practice..." 
                    className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Sparkles className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                <Button className="px-4 flex-shrink-0">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Simple & Automated Financial Reporting</h3>
                <p className="text-muted-foreground mb-4">
                  Instant dashboards, interactive data insights, and no-code setup. Generate comprehensive reports with powerful visualization tools.
                </p>
                <a href="#" className="text-primary inline-flex items-center hover:underline font-medium text-sm">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant & Actionable Performance Insights</h3>
                <p className="text-muted-foreground mb-4">
                  AI assistant instantly answers questions on cases and attorney performance. Save hours of research time with intelligent analytics.
                </p>
                <a href="#" className="text-primary inline-flex items-center hover:underline font-medium text-sm">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Reliable Deadline Management</h3>
                <p className="text-muted-foreground mb-4">
                  Smart alerts and automated tracking ensure critical deadlines are met. Never miss important dates with our intelligent scheduling tools.
                </p>
                <a href="#" className="text-primary inline-flex items-center hover:underline font-medium text-sm">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="demo" className="py-20 bg-white/80 dark:bg-gray-800/80">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none">
              Product Demo
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              See Velora AI in Action
            </h2>
            <p className="text-lg text-muted-foreground">
              Watch a quick demonstration of how Velora AI transforms your law firm's productivity and insights.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="aspect-video relative">
                <div className="absolute inset-0 flex items-center justify-center group">
                  <iframe 
                    className="w-full h-full"
                    src="https://www.loom.com/embed/8a6f9bcd716a436982a3c04df9af23a9?sid=7c5ecf0a-f28a-4d81-b475-06295b06eb51" 
                    frameBorder="0" 
                    allowFullScreen
                    title="Velora AI Demo"
                  />
                </div>
              </div>
              <div className="p-6 text-center">
                <p className="text-muted-foreground">
                  See how Velora AI helps law firms streamline operations, gain insights from data, and improve client outcomes.
                </p>
                <Button className="mt-4" onClick={scrollToWaitlist}>
                  Join the Waitlist <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none">
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Choose the Right Plan for Your Firm
            </h2>
            <p className="text-lg text-muted-foreground">
              Select the plan that fits your law firm's needs and start turning data into decisions today.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border border-gray-200 dark:border-gray-700 relative flex flex-col h-full">
              <div className="p-6">
                <h3 className="flex items-center text-xl font-bold mb-2">
                  <BarChart4 className="mr-2 h-5 w-5 text-primary" />
                  Starter Plan
                </h3>
                <p className="text-muted-foreground mb-4">For small law firms getting started with data analytics</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">$399</span>
                  <span className="text-muted-foreground">/month per attorney</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Basic AI Assistant</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Standard Dashboards</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Up to 5 custom reports</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Basic Calendar Sync</span>
                  </li>
                </ul>
                
                <Button className="w-full" onClick={() => navigate('/managing-partner-login')}>
                  Get Started
                </Button>
              </div>
            </Card>
            
            <Card className="border-2 border-primary relative flex flex-col h-full shadow-lg">
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <Badge className="px-3 py-1 bg-primary text-white">Most Popular</Badge>
              </div>
              <div className="p-6">
                <h3 className="flex items-center text-xl font-bold mb-2">
                  <BarChart4 className="mr-2 h-5 w-5 text-primary" />
                  Advanced Plan
                </h3>
                <p className="text-muted-foreground mb-4">For power users and managing partners</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">$499</span>
                  <span className="text-muted-foreground">/month per attorney</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Full AI Assistant</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Unlimited Dashboards</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Enhanced Workflows</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Premium Integrations</span>
                  </li>
                </ul>
                
                <Button className="w-full" onClick={() => navigate('/managing-partner-login')}>
                  Get Started
                </Button>
              </div>
            </Card>
            
            <Card className="border border-gray-200 dark:border-gray-700 relative flex flex-col h-full">
              <div className="p-6">
                <h3 className="flex items-center text-xl font-bold mb-2">
                  <BarChart4 className="mr-2 h-5 w-5 text-primary" />
                  Enterprise Plan
                </h3>
                <p className="text-muted-foreground mb-4">For large organizations with complex requirements</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold">Custom</span>
                  <span className="text-muted-foreground"> pricing</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Dedicated Account Manager</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Custom AI Training</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Advanced Security Features</span>
                  </li>
                  <li className="flex">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Unlimited Users</span>
                  </li>
                </ul>
                
                <Button variant="outline" className="w-full" onClick={() => navigate('/managing-partner-login')}>
                  Contact Sales
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
      
      <section id="waitlist" className="py-20 bg-gradient-to-r from-purple-50/80 to-blue-50/80 dark:from-gray-900/80 dark:to-gray-800/80">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none">
              Limited Spots Available
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Join Our Exclusive Waitlist
            </h2>
            <p className="text-lg text-muted-foreground">
              Be among the first to experience Velora AI and transform your legal practice. Early access members receive special pricing and dedicated onboarding support.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Integrations</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">API Reference</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href="mailto:info@velora.ai" className="text-muted-foreground hover:text-primary transition-colors">info@velora.ai</a>
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href="tel:+15551234567" className="text-muted-foreground hover:text-primary transition-colors">+1 (555) 123-4567</a>
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">San Francisco, CA</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 dark:border-gray-800 mt-10 pt-8">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Scale className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <span className="text-lg font-bold tracking-tight text-primary">Velora AI</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Velora AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
