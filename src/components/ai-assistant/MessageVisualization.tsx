
import React, { useState, useEffect } from 'react';
import { FileText, Download, Save, Check, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import VisualizationCard from '@/components/VisualizationCard';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VisualizationConfig } from '@/types';
import { 
  LineChart, 
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

interface MessageVisualizationProps {
  visualization: VisualizationConfig;
}

// Enhanced data for growth line chart - showing growth progression
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

const MessageVisualization: React.FC<MessageVisualizationProps> = ({ visualization }) => {
  const [exportedItems, setExportedItems] = useState<{[key: string]: boolean}>({});
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [animatedData, setAnimatedData] = useState<typeof growthChartData>([]);

  // Animate data loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      // Start with first data point
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
      }, 300); // Add a new data point every 300ms

      return () => clearTimeout(timer);
    }
  }, [animatedData]);

  const handleExport = () => {
    setExportedItems(prev => ({...prev, export: true}));
    toast.success("Chart exported successfully!", {
      description: "The visualization has been exported to your reports"
    });
    
    // Reset the button state after a delay
    setTimeout(() => {
      setExportedItems(prev => ({...prev, export: false}));
    }, 2000);
  };

  const handleSave = () => {
    setExportedItems(prev => ({...prev, save: true}));
    toast.success("Chart saved to your reports!", {
      description: "You can access it anytime from the Reports section"
    });
    
    // Reset the button state after a delay
    setTimeout(() => {
      setExportedItems(prev => ({...prev, save: false}));
    }, 2000);
  };

  const handleDownload = () => {
    setExportedItems(prev => ({...prev, download: true}));
    toast.success("Chart downloaded successfully!", {
      description: "The file has been saved to your downloads folder"
    });
    
    // Reset the button state after a delay
    setTimeout(() => {
      setExportedItems(prev => ({...prev, download: false}));
    }, 2000);
  };

  // Custom line chart
  const renderEnhancedLineChart = () => {
    return (
      <div className="w-full h-full p-4">
        <h3 className="text-lg font-semibold mb-2">Law Practice Growth</h3>
        <div className="text-sm text-muted-foreground mb-4">Growth trends across practice areas (percentage)</div>
        
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={animatedData} 
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              onMouseMove={(e) => {
                if (e.activeTooltipIndex !== undefined) {
                  setActiveIndex(e.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setActiveIndex(null)}
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
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
    );
  };

  return (
    <div className="mt-4 overflow-hidden">
      <Card className="p-3 relative overflow-hidden">
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Export Chart</span>
                {exportedItems.export && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Save to Reports</span>
                {exportedItems.save && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDownload} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Download</span>
                {exportedItems.download && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="w-full h-auto">
          {renderEnhancedLineChart()}
        </div>
      </Card>
    </div>
  );
};

export default MessageVisualization;
