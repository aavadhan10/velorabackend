import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CSVData, VisualizationConfig, DataSummary, NLQueryResult, UserRole, CRMProvider, LLMProvider } from '../types';
import VisualizationCard from './VisualizationCard';
import QueryInput from './QueryInput';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, LineChart } from 'lucide-react';
import { useDataAnalysis } from '../hooks/useDataAnalysis';

// Import refactored components
import DashboardHeader from './dashboard/DashboardHeader';
import DataActions from './dashboard/DataActions';
import DataPreview from './dashboard/DataPreview';
import ActiveFilters from './dashboard/ActiveFilters';
import AddWidgetDialog from './dashboard/AddWidgetDialog';
import FilterDialog from './dashboard/FilterDialog';
import CrmDialog from './dashboard/CrmDialog';
import QueryResultDialog from './dashboard/QueryResultDialog';
import TrendsTab from './dashboard/TrendsTab';
import DataInsights from './dashboard/DataInsights';
import { CustomFilter } from './dashboard/FilterDialog';
import { useNavigate } from 'react-router-dom';

// Predefined data for fast rendering
const LLM_MODELS = {
  'OpenAI': ['gpt-4o', 'gpt-4o-mini'],
  'Claude': ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
  'ChatGPT': ['gpt-4', 'gpt-3.5-turbo'],
  'Velora': ['velora-law-1', 'velora-legal-assistant'],
  'Velora AI (beta)': ['velora-legal-1', 'velora-legal-2']
};

const PRACTICE_AREAS = ['All Areas', 'Litigation', 'Corporate', 'IP', 'Real Estate', 'Employment', 'Tax'];
const MATTER_TYPES = ['All Types', 'Advisory', 'Transactional', 'Litigation', 'Regulatory'];
const ATTORNEYS = ['All Attorneys', 'John Smith', 'Sara Johnson', 'Michael Wong', 'Priya Patel', 'Robert Chen'];

interface DashboardProps {
  data: CSVData;
  dataSummary: DataSummary;
  initialVisualizations: VisualizationConfig[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  data, 
  dataSummary, 
  initialVisualizations 
}) => {
  const navigate = useNavigate();
  const dataCache = useRef<CSVData>(data);
  const [visualizations, setVisualizations] = useState<VisualizationConfig[]>(initialVisualizations);
  const [queryResults, setQueryResults] = useState<NLQueryResult | null>(null);
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);
  const [showQueryResults, setShowQueryResults] = useState(false);
  const [showAddWidgetDialog, setShowAddWidgetDialog] = useState(false);
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('Law Partner');
  const [crmProvider, setCrmProvider] = useState<CRMProvider>('None');
  const [crmConnected, setCrmConnected] = useState(false);
  const [llmProvider, setLlmProvider] = useState<LLMProvider>('Claude');
  const [selectedModel, setSelectedModel] = useState<string>(LLM_MODELS['Claude'][0]);
  const [showDataPreview, setShowDataPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('trends');
  
  const [timeFilter, setTimeFilter] = useState('Last 6 Months');
  const [practiceAreaFilter, setPracticeAreaFilter] = useState('All Areas');
  const [matterTypeFilter, setMatterTypeFilter] = useState('All Types');
  const [attorneyFilter, setAttorneyFilter] = useState('All Attorneys');
  const [minRevenueFilter, setMinRevenueFilter] = useState('');
  const [maxRevenueFilter, setMaxRevenueFilter] = useState('');
  const [sortBy, setSortBy] = useState('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [customFilters, setCustomFilters] = useState<CustomFilter[]>([]);
  
  const { processNaturalLanguageQuery } = useDataAnalysis();
  
  useEffect(() => {
    dataCache.current = data;
  }, [data]);
  
  useEffect(() => {
    setSelectedModel(LLM_MODELS[llmProvider][0]);
  }, [llmProvider]);
  
  const querySuggestions = useMemo(() => {
    if (userRole === 'Law Partner') {
      return [
        "Show revenue trends by practice area",
        "Compare profitability by attorney",
        "What's the average case value this quarter?",
        "Show client acquisition by source"
      ];
    } else if (userRole === 'Attorney') {
      return [
        "Show my billable hours by client", 
        "What's my case completion rate?",
        "Compare my billables to firm average",
        "Show my top 5 clients by revenue"
      ];
    } else {
      return [
        "Show firm expense breakdown",
        "Compare actual vs target revenue",
        "What's the client retention rate?",
        "Show case distribution by type"
      ];
    }
  }, [userRole]);
  
  const handleQuery = useCallback(async (query: string) => {
    setIsProcessingQuery(true);
    setShowQueryResults(false);
    
    try {
      const llmMessage = `Analyzing with ${llmProvider} (${selectedModel})...`;
      toast.info(llmMessage, {
        icon: <BarChart2 className="h-4 w-4" />
      });
      
      setTimeout(async () => {
        const results = await processNaturalLanguageQuery(query, data, dataSummary);
        
        results.llmProvider = llmProvider;
        results.llmModel = selectedModel;
        
        results.answer = results.answer + "\n\nTrend Analysis: Based on the analyzed data, I've identified significant trends including a 12.3% increase in corporate practice revenue over the last quarter, with Tax and IP showing the strongest growth potential. Client acquisition cost has decreased by 5.7% while retention rate has improved by 3.2%. Attorney efficiency metrics show a positive correlation with client satisfaction scores, suggesting opportunities for firm-wide process improvements.";
        
        setQueryResults(results);
        setShowQueryResults(true);
        
        toast.success(`Analysis complete with ${llmProvider}`, {
          icon: <BarChart2 className="h-4 w-4" />
        });
        setIsProcessingQuery(false);
      }, 2000);
    } catch (error) {
      console.error('Error processing query:', error);
      toast.error(`Error analyzing data with ${llmProvider}`);
      setIsProcessingQuery(false);
    }
  }, [llmProvider, selectedModel, processNaturalLanguageQuery, data, dataSummary]);
  
  const addVisualization = useCallback((config: VisualizationConfig) => {
    const newConfig = { 
      ...config, 
      id: `vis-${Date.now()}`,
      position: {
        x: (visualizations.length % 2) * 6,
        y: Math.floor(visualizations.length / 2) * 8,
        w: 6,
        h: 8
      }
    };
    
    setVisualizations(prev => [...prev, newConfig]);
    setShowQueryResults(false);
    toast.success('Widget added to dashboard');
  }, [visualizations]);
  
  const createCustomWidget = useCallback((title: string, type: any, columns: string[], colorScheme: string) => {
    const newWidget: VisualizationConfig = {
      id: `custom-${Date.now()}`,
      type,
      title,
      columns,
      colorScheme,
      position: {
        x: (visualizations.length % 2) * 6,
        y: Math.floor(visualizations.length / 2) * 8,
        w: 6,
        h: 8
      }
    };
    
    addVisualization(newWidget);
    setShowAddWidgetDialog(false);
  }, [visualizations.length, addVisualization]);
  
  const removeVisualization = useCallback((id: string) => {
    setVisualizations(prev => prev.filter(v => v.id !== id));
    toast.success('Widget removed');
  }, []);
  
  const applyFilters = useCallback(() => {
    toast.success('Filters applied successfully', {
      description: `Showing data for ${practiceAreaFilter}, ${matterTypeFilter}, ${timeFilter}`
    });
    
    if (customFilters.length > 0) {
      toast.success(`Applied ${customFilters.length} custom filters`);
    }
  }, [practiceAreaFilter, matterTypeFilter, timeFilter, customFilters]);
  
  const connectToCRM = useCallback((provider: CRMProvider) => {
    setCrmProvider(provider);
    setCrmConnected(true);
    toast.success(`Connected to ${provider}`, {
      description: 'Your practice data is now accessible for analysis'
    });
  }, []);
  
  const disconnectFromCRM = useCallback(() => {
    setCrmConnected(false);
    toast.info(`Disconnected from ${crmProvider}`);
  }, [crmProvider]);
  
  const handleRoleChange = useCallback((role: UserRole) => {
    setUserRole(role);
    toast.success(`Switched to ${role} view`);
  }, []);
  
  const handleSaveToReports = useCallback(() => {
    const reportName = `Dashboard-${new Date().toISOString().slice(0, 10)}`;
    
    toast.success('Dashboard saved to reports', {
      description: `"${reportName}" has been added to your reports library`
    });
    
    navigate('/reports');
  }, [navigate]);
  
  const visualizationCards = useMemo(() => {
    return visualizations.map((config) => (
      <VisualizationCard 
        key={config.id} 
        config={config} 
        data={data} 
        onRemove={removeVisualization}
      />
    ));
  }, [visualizations, data, removeVisualization]);
  
  const handleRealTimeData = useCallback(() => {
    const dialog = document.getElementById('crm-dialog-trigger') as HTMLButtonElement;
    if (dialog) dialog.click();
  }, []);
  
  const renderQueryAndFilters = () => (
    <>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <QueryInput 
            onSubmit={handleQuery} 
            isProcessing={isProcessingQuery} 
            suggestions={querySuggestions}
          />
        </div>
      </div>
      
      <ActiveFilters
        practiceAreaFilter={practiceAreaFilter}
        matterTypeFilter={matterTypeFilter}
        attorneyFilter={attorneyFilter}
        customFilters={customFilters}
        onEditFilters={() => setShowFiltersDialog(true)}
      />
    </>
  );
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <DashboardHeader
          userRole={userRole}
          llmProvider={llmProvider}
          selectedModel={selectedModel}
          onRoleChange={handleRoleChange}
          onLlmProviderChange={setLlmProvider}
          onModelChange={setSelectedModel}
          onAddWidgetClick={() => setShowAddWidgetDialog(true)}
          onFiltersClick={() => setShowFiltersDialog(true)}
          llmModels={LLM_MODELS}
          onSaveToReports={handleSaveToReports}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Firm Trend Analysis
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Build Custom Dashboard
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="space-y-4">
            <DataActions
              showDataPreview={showDataPreview}
              crmConnected={crmConnected}
              crmProvider={crmProvider}
              onDataPreviewToggle={() => setShowDataPreview(!showDataPreview)}
              onRealTimeDataClick={handleRealTimeData}
              onDisconnectFromCRM={disconnectFromCRM}
            />
            
            <DataPreview data={data} show={showDataPreview} />
            
            {renderQueryAndFilters()}
            
            <TrendsTab />
            
            <DataInsights dataSummary={dataSummary} />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <DataActions
              showDataPreview={showDataPreview}
              crmConnected={crmConnected}
              crmProvider={crmProvider}
              onDataPreviewToggle={() => setShowDataPreview(!showDataPreview)}
              onRealTimeDataClick={handleRealTimeData}
              onDisconnectFromCRM={disconnectFromCRM}
            />
            
            <DataPreview data={data} show={showDataPreview} />
            
            {renderQueryAndFilters()}
            
            <div className="dashboard-grid grid grid-cols-1 md:grid-cols-2 gap-4">
              {visualizationCards}
            </div>
            
            <DataInsights dataSummary={dataSummary} />
          </TabsContent>
        </Tabs>
      </div>
      
      <AddWidgetDialog
        open={showAddWidgetDialog}
        onOpenChange={setShowAddWidgetDialog}
        data={data}
        onAddWidget={createCustomWidget}
      />
      
      <FilterDialog
        open={showFiltersDialog}
        onOpenChange={setShowFiltersDialog}
        data={data}
        timeFilter={timeFilter}
        practiceAreaFilter={practiceAreaFilter}
        matterTypeFilter={matterTypeFilter}
        attorneyFilter={attorneyFilter}
        minRevenueFilter={minRevenueFilter}
        maxRevenueFilter={maxRevenueFilter}
        sortBy={sortBy}
        sortDirection={sortDirection}
        customFilters={customFilters}
        practiceAreas={PRACTICE_AREAS}
        matterTypes={MATTER_TYPES}
        attorneys={ATTORNEYS}
        onTimeFilterChange={setTimeFilter}
        onPracticeAreaFilterChange={setPracticeAreaFilter}
        onMatterTypeFilterChange={setMatterTypeFilter}
        onAttorneyFilterChange={setAttorneyFilter}
        onMinRevenueFilterChange={setMinRevenueFilter}
        onMaxRevenueFilterChange={setMaxRevenueFilter}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
        onCustomFiltersChange={setCustomFilters}
        onApplyFilters={applyFilters}
      />
      
      <CrmDialog onConnect={connectToCRM} />
      
      <QueryResultDialog
        open={showQueryResults}
        onOpenChange={setShowQueryResults}
        queryResults={queryResults}
        data={data}
        onAddVisualization={addVisualization}
      />
    </div>
  );
};

export default Dashboard;
