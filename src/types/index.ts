
export type LLMProvider = 'OpenAI' | 'ChatGPT' | 'Claude' | 'Velora' | 'Velora AI (beta)';

// Add any other types needed by the system here
export type CRMProvider = 'Clio' | 'PracticePanther' | 'Smokeball' | 'MyCase' | 'LexisNexis' | 'Lawmatics' | 'None';
export type UserRole = 'attorney' | 'paralegal' | 'admin' | 'partner' | 'managingPartner' | 'Law Partner' | 'Attorney' | 'Operations Manager';
export type VisualizationType = 'bar' | 'line' | 'pie' | 'table' | 'summary' | 'scatter' | 'area';

export interface CSVData {
  headers: string[];
  rows: Record<string, any>[];
  rawData: string;
}

export interface ColumnStats {
  type: 'numeric' | 'categorical' | 'date' | 'text';
  missingValues: number;
  uniqueValues?: number;
  mostCommonValues?: Array<{value: string, count: number}>;
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
}

export interface DataSummary {
  totalRows: number;
  totalColumns: number;
  columnTypes: Record<string, string>;
  columnStats: Record<string, ColumnStats>;
  possibleVisualizations: string[];
  suggestedInsights: string[];
}

export interface VisualizationConfig {
  id: string;
  type: VisualizationType;
  title: string;
  columns: string[];
  description?: string;
  colorScheme?: string; // Added this line for widget color scheme
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface NLQueryResult {
  query: string;
  queryText?: string;
  result: any;
  visualization?: VisualizationConfig;
  visualizations?: VisualizationConfig[];
  error?: string;
  answer?: string;
  llmProvider?: string;
  llmModel?: string;
}

export interface MessageAction {
  type: 'visualize' | 'export' | 'save' | 'download';
  label: string;
  visualizationType?: VisualizationType;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  provider?: LLMProvider;
  actions?: MessageAction[];
  awaitingResponse?: boolean;
  visualization?: VisualizationConfig;
  isFollowUp?: boolean;
}
