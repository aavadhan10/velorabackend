import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { LLMProvider, Message, VisualizationType, VisualizationConfig } from '@/types';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from '@/components/Sidebar';
import { useDialogs } from '@/App';
import QueryInput from '@/components/QueryInput';
import ChatHeader from '@/components/ai-assistant/ChatHeader';
import MessageList from '@/components/ai-assistant/MessageList';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [llmProvider, setLLMProvider] = useState<LLMProvider>('Velora AI (beta)');
  const [dataLoaded, setDataLoaded] = useState(true);
  const [fileName, setFileName] = useState('Sample Firm Data');
  const [awaitingFollowUp, setAwaitingFollowUp] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCalendarOpen, setCurrentTool } = useDialogs();
  
  const isAttorneyLoggedIn = localStorage.getItem('attorneyLoggedIn') === 'true';
  const isManagingPartnerLoggedIn = localStorage.getItem('managingPartnerLoggedIn') === 'true';
  const userType = isManagingPartnerLoggedIn ? 'managingPartner' : isAttorneyLoggedIn ? 'attorney' : undefined;

  const suggestions = [
    "What is our client satisfaction rate?",
    "How many active cases do we have?",
    "What are our most profitable practice areas?",
    "What is our average case resolution time?",
    "Summarize marketing ROI by channel"
  ];

  const handleLogout = () => {
    if (isAttorneyLoggedIn) {
      localStorage.removeItem('attorneyLoggedIn');
      localStorage.removeItem('attorneyEmail');
    } else if (isManagingPartnerLoggedIn) {
      localStorage.removeItem('managingPartnerLoggedIn');
      localStorage.removeItem('managingPartnerEmail');
    }
    navigate('/');
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account',
    });
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: "Hello! I'm Velora, your legal AI assistant. I can help you analyze your firm's data, track performance metrics, and answer questions about your legal practice. How can I assist you today?",
          role: 'assistant',
          timestamp: new Date(),
          provider: llmProvider
        }
      ]);
    }
  }, []);

  const handleSubmit = (userQuery: string) => {
    if (!userQuery.trim()) return;
    setCurrentQuery(userQuery);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userQuery,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    setTimeout(() => {
      let response = generateResponse(userQuery, llmProvider);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        provider: llmProvider
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
      
      if (shouldOfferVisualization(userQuery)) {
        setTimeout(() => {
          const followUpMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: "Would you like me to create a visual chart based on this information?",
            role: 'assistant',
            timestamp: new Date(),
            provider: llmProvider,
            isFollowUp: true,
            awaitingResponse: true
          };
          
          setMessages(prev => [...prev, followUpMessage]);
          setAwaitingFollowUp(true);
        }, 1000);
      }
      
      toast({
        title: `Response generated using ${llmProvider}`,
        description: "You can change models using the selector in the header",
      });
    }, 1500);
  };

  const shouldOfferVisualization = (query: string): boolean => {
    const q = query.toLowerCase();
    return (
      q.includes('profitable') || 
      q.includes('revenue') || 
      q.includes('cases') || 
      q.includes('client satisfaction') || 
      q.includes('marketing') || 
      q.includes('roi') || 
      q.includes('performance') ||
      q.includes('statistics') ||
      q.includes('metrics') ||
      q.includes('numbers')
    );
  };

  const handleActionSelect = (messageId: string, action: string, visualizationType?: VisualizationType) => {
    if (action === 'visualize' && visualizationType) {
      const visualizationConfig = createVisualization(currentQuery, visualizationType);
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, awaitingResponse: false } : msg
      ));
      
      const visualizationMessage: Message = {
        id: Date.now().toString(),
        content: "Here's the visualization you requested:",
        role: 'assistant',
        timestamp: new Date(),
        provider: llmProvider,
        visualization: visualizationConfig
      };
      
      setMessages(prev => [...prev, visualizationMessage]);
      setAwaitingFollowUp(false);
    } else if (action === 'decline') {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, awaitingResponse: false, content: "Would you like me to create a visual chart based on this information?\n\nNo problem. Let me know if you need anything else!" } : msg
      ));
      setAwaitingFollowUp(false);
    }
  };

  const createVisualization = (query: string, type: VisualizationType): VisualizationConfig => {
    const q = query.toLowerCase();
    
    let title = "Data Visualization";
    let columns = ['Category', 'Value'];
    
    if (q.includes('profitable') || q.includes('revenue') || q.includes('practice areas')) {
      title = "Most Profitable Practice Areas";
    } else if (q.includes('client satisfaction')) {
      title = "Client Satisfaction by Practice Area";
    } else if (q.includes('marketing') || q.includes('roi')) {
      title = "Marketing ROI by Channel";
    } else if (q.includes('active cases') || q.includes('caseload')) {
      title = "Active Cases by Practice Area";
    }
    
    return {
      id: `visualization-${Date.now()}`,
      type,
      title,
      columns,
      description: `Visualization based on query: "${query}"`,
      position: {
        x: 0,
        y: 0,
        w: 6,
        h: 8
      }
    };
  };

  const generateResponse = (query: string, provider: LLMProvider): string => {
    const q = query.toLowerCase();
    
    let response = "";
    
    if (q.includes('client satisfaction') || q.includes('satisfied clients')) {
      response = "Based on our records, the overall client satisfaction rate is 87%. This is a 5% increase from last quarter. Areas with highest satisfaction include personal injury (92%) and family law (89%). Corporate law has the lowest satisfaction at 78%, which might need attention.";
    } else if (q.includes('active cases') || q.includes('current caseload')) {
      response = "Your firm currently has 157 active cases. This represents a 12% increase from the same period last year. The breakdown by practice area is: Corporate Law (42), Family Law (38), Personal Injury (31), Real Estate (24), and Criminal Defense (22).";
    } else if (q.includes('profitable') || q.includes('revenue') || q.includes('practice areas')) {
      response = "The most profitable practice areas based on the last 12 months are: 1. Corporate Law ($1.2M), 2. Personal Injury ($950K), 3. Real Estate ($820K). Corporate law has the highest hourly rate, while Personal Injury has the highest volume of cases.";
    } else if (q.includes('case resolution') || q.includes('case duration') || q.includes('time to resolve')) {
      response = "The average case resolution time across all practice areas is 4.7 months. Personal Injury cases take the longest at 7.3 months on average, while Real Estate closings are quickest at 2.1 months. There's been a 15% improvement in resolution time compared to last year.";
    } else if (q.includes('marketing') || q.includes('roi') || q.includes('advertising')) {
      response = "Your marketing ROI analysis shows that digital channels are outperforming traditional methods. Google Ads has the highest ROI at 320%, followed by LinkedIn (210%) and referral programs (180%). Print advertising is underperforming at 70% ROI.";
    } else {
      response = "I understand you're asking about " + query + ". To provide an accurate answer, I'd need to analyze your firm's specific data in this area. Would you like me to prepare a detailed report on this topic?";
    }
    
    if (provider === 'Claude') {
      return `${response}\n\nAs Claude, I'd be happy to explore this data in more detail or help you interpret these trends in the context of your firm's specific strategy.`;
    } else if (provider === 'ChatGPT') {
      return `${response}\n\nAs ChatGPT, I notice that this information could be visualized effectively. Would you like me to suggest some visualization options for this data?`;
    } else {
      return response;
    }
  };

  const handleProviderChange = (provider: LLMProvider) => {
    setLLMProvider(provider);
  };

  const handleVisualizationSelect = (type: string) => {
    console.log(`Selected visualization: ${type}`);
  };

  const handleToolSelect = (tool: string) => {
    setCurrentTool(tool);
    console.log(`Tool selected in AI Assistant: ${tool}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarProvider>
        <Sidebar 
          fileName={fileName}
          dataLoaded={dataLoaded}
          onVisualizationSelect={handleVisualizationSelect}
          onLogout={handleLogout}
          userType={userType}
          onToolSelect={handleToolSelect}
        />

        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
          <ChatHeader 
            currentProvider={llmProvider}
            onProviderChange={handleProviderChange}
          />
          
          <div className="flex-1 flex flex-col px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full h-full overflow-hidden">
            <Card className="flex-1 flex flex-col h-full overflow-hidden border-0 shadow-none bg-transparent">
              <CardContent className="flex-1 p-0 flex flex-col h-full">
                <MessageList 
                  messages={messages}
                  isProcessing={isProcessing}
                  onActionSelect={handleActionSelect}
                />
                
                <div className="border-t pt-4">
                  <QueryInput 
                    onSubmit={handleSubmit}
                    isProcessing={isProcessing || awaitingFollowUp}
                    suggestions={suggestions}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default AIAssistant;
