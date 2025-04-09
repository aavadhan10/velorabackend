
import { useState, useRef } from 'react';
import { VisualizationConfig, CSVData } from '../types';
import { getChartData, getChartColors } from '../utils/chartUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Grip, X, Maximize2, Minimize2, MoreHorizontal, Settings } from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface VisualizationCardProps {
  config: VisualizationConfig;
  data: CSVData;
  onRemove: (id: string) => void;
  onMove?: (id: string, direction: 'up' | 'down' | 'left' | 'right') => void;
}

// Define color schemes
const COLOR_SCHEMES = {
  default: ['#3182CE', '#805AD5', '#D53F8C', '#DD6B20', '#38A169', '#E53E3E', '#718096'],
  pastel: ['#E5DEFF', '#FFDEE2', '#FDE1D3', '#F2FCE2', '#D3E4FD', '#FEF7CD', '#F1F0FB'],
  vibrant: ['#8B5CF6', '#EC4899', '#F97316', '#10B981', '#0EA5E9', '#D946EF', '#F59E0B'],
  cool: ['#0EA5E9', '#06B6D4', '#14B8A6', '#10B981', '#047857', '#0F766E', '#0369A1'],
  warm: ['#F97316', '#F59E0B', '#FBBF24', '#F43F5E', '#D946EF', '#FB7185', '#E11D48']
};

const VisualizationCard: React.FC<VisualizationCardProps> = ({ 
  config, 
  data, 
  onRemove,
  onMove 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const chartData = getChartData(config, data);
  
  // Use color scheme from config or default to the 'default' scheme
  const colorScheme = config.colorScheme && COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES] 
    ? COLOR_SCHEMES[config.colorScheme as keyof typeof COLOR_SCHEMES] 
    : COLOR_SCHEMES.default;
    
  const renderVisualization = () => {
    switch (config.type) {
      case 'bar':
        return (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Array.isArray(chartData) ? chartData : []} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" dy={5} tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis dx={-5} tick={{ fill: '#888', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', marginTop: '5px' }} />
                <Bar dataKey="value" fill={colorScheme[0]} radius={[4, 4, 0, 0]}>
                  {Array.isArray(chartData) && chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colorScheme[index % colorScheme.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'line':
        return (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Array.isArray(chartData) ? chartData : []} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                <defs>
                  <linearGradient id={`lineGradient-${config.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorScheme[0]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={colorScheme[0]} stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" dy={5} tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis dx={-5} tick={{ fill: '#888', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                  cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', marginTop: '5px' }} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={colorScheme[0]} 
                  strokeWidth={2}
                  dot={{ fill: colorScheme[0], r: 3, strokeWidth: 2 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'pie':
        return (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Pie
                  data={Array.isArray(chartData) ? chartData : []}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={35}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {Array.isArray(chartData) && chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colorScheme[index % colorScheme.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', marginTop: '5px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'area':
        return (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={Array.isArray(chartData) ? chartData : []} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                <defs>
                  <linearGradient id={`areaGradient-${config.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colorScheme[0]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={colorScheme[0]} stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" dy={5} tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis dx={-5} tick={{ fill: '#888', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                  cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', marginTop: '5px' }} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  fill={`url(#areaGradient-${config.id})`}
                  stroke={colorScheme[0]} 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'scatter':
        return (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="x" name="x" dy={5} tick={{ fill: '#888', fontSize: 11 }} />
                <YAxis dataKey="y" name="y" dx={-5} tick={{ fill: '#888', fontSize: 11 }} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', marginTop: '5px' }} />
                <Scatter name="Values" data={Array.isArray(chartData) ? chartData : []} fill={colorScheme[0]}>
                  {Array.isArray(chartData) && chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colorScheme[index % colorScheme.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'table':
        return (
          <div className="overflow-auto max-h-[250px] border rounded-md">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-secondary sticky top-0">
                <tr>
                  {config.columns.map((column) => (
                    <th 
                      key={column} 
                      className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {data.rows.slice(0, 8).map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-secondary/30'}>
                    {config.columns.map((column) => (
                      <td key={column} className="px-4 py-2 text-xs">
                        {String(row[column] !== undefined ? row[column] : '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'summary':
        if (config.type === 'summary' && typeof chartData === 'object') {
          const summary = chartData as any;
          return (
            <div className="space-y-2 p-2">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Records</p>
                  <p className="text-xl font-semibold">{summary.rowCount}</p>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Fields</p>
                  <p className="text-xl font-semibold">{Object.keys(summary.columns).length}</p>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Data Quality</p>
                  <p className="text-xl font-semibold">
                    {Object.values(summary.columns).some((col: any) => col.missingValueCount > 0) 
                      ? 'Has missing values' 
                      : 'Complete'}
                  </p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Column types: {Object.entries(summary.columns).map(([col, stats]: [string, any]) => 
                  `${col} (${stats.type})`).join(', ')}
                </p>
              </div>
            </div>
          );
        }
        return null;
        
      default:
        return <div className="p-4 text-muted-foreground">Unsupported visualization type</div>;
    }
  };
  
  // Drag handling (basic implementation)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragHandleRef.current?.contains(e.target as Node)) return;
    
    setIsDragging(true);
    
    const initialX = e.clientX;
    const initialY = e.clientY;
    const initialLeft = cardRef.current?.offsetLeft || 0;
    const initialTop = cardRef.current?.offsetTop || 0;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging || !cardRef.current) return;
      
      const dx = moveEvent.clientX - initialX;
      const dy = moveEvent.clientY - initialY;
      
      // Simple drag implementation (for a more robust solution, use react-dnd or similar)
      cardRef.current.style.position = 'relative';
      cardRef.current.style.left = `${initialLeft + dx}px`;
      cardRef.current.style.top = `${initialTop + dy}px`;
      cardRef.current.style.zIndex = '10';
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Reset positioning
      if (cardRef.current) {
        cardRef.current.style.zIndex = '';
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  return (
    <Card 
      ref={cardRef}
      className={`transition-all duration-300 overflow-hidden ${
        isExpanded ? 'absolute inset-4 z-50 shadow-xl' : 'shadow-md hover:shadow-lg'
      } ${isDragging ? 'opacity-70' : 'opacity-100'}`}
      onMouseDown={handleMouseDown}
    >
      <CardHeader className="pb-1 pt-2 px-3 relative">
        <div 
          ref={dragHandleRef}
          className="absolute top-2 left-2 p-1 cursor-move hover:bg-secondary/50 rounded"
        >
          <Grip className="h-3 w-3 text-muted-foreground" />
        </div>
        
        <div className="absolute top-2 right-2 flex items-center space-x-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Edit Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onRemove(config.id)} className="text-destructive">
                <X className="mr-2 h-4 w-4" />
                <span>Remove</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <CardTitle className="text-base pl-6 pr-14 truncate">{config.title}</CardTitle>
        {config.description && (
          <CardDescription className="text-xs truncate">{config.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-1">
        {renderVisualization()}
      </CardContent>
    </Card>
  );
};

export default VisualizationCard;
