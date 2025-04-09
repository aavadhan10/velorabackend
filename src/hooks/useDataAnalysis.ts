
import { useState, useCallback } from 'react';
import { CSVData, DataSummary, VisualizationConfig, NLQueryResult, ColumnStats, VisualizationType } from '../types';

export function useDataAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSummary, setDataSummary] = useState<DataSummary | null>(null);

  // Analyze data to generate initial summary and insights
  const analyzeData = useCallback(async (data: CSVData): Promise<DataSummary> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Analyze column types and statistics
      const columnStats: Record<string, ColumnStats> = {};
      const { headers, rows } = data;

      headers.forEach(header => {
        const values = rows.map(row => row[header]);
        
        // Determine column type
        let type: 'numeric' | 'categorical' | 'date' | 'text' = 'text';
        
        // Check if column is numeric
        const numericValues = values.filter(v => typeof v === 'number');
        if (numericValues.length > 0.8 * values.length) {
          type = 'numeric';
        } 
        // Check if column might be categorical (few unique values)
        else {
          const uniqueValues = new Set(values);
          if (uniqueValues.size < Math.min(10, values.length * 0.2)) {
            type = 'categorical';
          }
          // Check if column might be a date
          else if (values.some(v => typeof v === 'string' && !isNaN(Date.parse(v as string)))) {
            type = 'date';
          }
        }
        
        // Calculate statistics based on column type
        const stats: ColumnStats = {
          type,
          missingValues: values.filter(v => v === undefined || v === null || v === '').length
        };
        
        if (type === 'numeric') {
          const numerics = values.filter(v => typeof v === 'number') as number[];
          stats.min = Math.min(...numerics);
          stats.max = Math.max(...numerics);
          stats.mean = numerics.reduce((sum, v) => sum + v, 0) / numerics.length;
          
          // Calculate median
          const sorted = [...numerics].sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          stats.median = sorted.length % 2 === 0 
            ? (sorted[mid - 1] + sorted[mid]) / 2 
            : sorted[mid];
        } else {
          // For categorical and other types, find most common values
          const valueCounts: Record<string, number> = {};
          values.forEach(v => {
            const key = String(v);
            valueCounts[key] = (valueCounts[key] || 0) + 1;
          });
          
          stats.uniqueValues = Object.keys(valueCounts).length;
          
          // Get top 5 most common values
          stats.mostCommonValues = Object.entries(valueCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([value, count]) => ({ value, count }));
        }
        
        columnStats[header] = stats;
      });

      // Determine possible visualizations based on column types
      const possibleVisualizations: Set<VisualizationType> = new Set(['table', 'summary']);
      
      // If we have numeric columns
      const numericColumns = headers.filter(h => columnStats[h].type === 'numeric');
      if (numericColumns.length > 0) {
        possibleVisualizations.add('bar');
        possibleVisualizations.add('pie');
      }
      
      // If we have numeric columns and date/categorical columns
      const dateOrCategoricalColumns = headers.filter(h => 
        columnStats[h].type === 'date' || columnStats[h].type === 'categorical'
      );
      
      if (numericColumns.length > 0 && dateOrCategoricalColumns.length > 0) {
        possibleVisualizations.add('line');
        possibleVisualizations.add('area');
      }
      
      // If we have at least 2 numeric columns
      if (numericColumns.length >= 2) {
        possibleVisualizations.add('scatter');
      }

      // Generate suggested insights
      const suggestedInsights = generateSuggestedInsights(data, columnStats);

      const summary: DataSummary = {
        totalRows: rows.length,
        totalColumns: headers.length,
        columnTypes: Object.fromEntries(headers.map(h => [h, columnStats[h].type])),
        columnStats,
        possibleVisualizations: Array.from(possibleVisualizations),
        suggestedInsights
      };

      setDataSummary(summary);
      setIsAnalyzing(false);
      
      return summary;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze data';
      setError(errorMessage);
      setIsAnalyzing(false);
      throw new Error(errorMessage);
    }
  }, []);

  // Generate initial visualizations based on data analysis
  const generateInitialVisualizations = useCallback((summary: DataSummary): VisualizationConfig[] => {
    const visualizations: VisualizationConfig[] = [];
    const { columnStats, possibleVisualizations } = summary;
    const columns = Object.keys(columnStats);
    
    // Add data summary card
    visualizations.push({
      id: 'summary-1',
      type: 'summary',
      title: 'Data Overview',
      columns: columns,
      position: { x: 0, y: 0, w: 6, h: 8 }
    });
    
    // Find a numeric column for basic visualizations
    const numericColumns = columns.filter(col => columnStats[col].type === 'numeric');
    const categoricalColumns = columns.filter(col => columnStats[col].type === 'categorical');
    
    // If we have both numeric and categorical columns, create a bar chart
    if (numericColumns.length > 0 && categoricalColumns.length > 0) {
      visualizations.push({
        id: 'bar-1',
        type: 'bar',
        title: `${categoricalColumns[0]} by ${numericColumns[0]}`,
        columns: [categoricalColumns[0], numericColumns[0]],
        position: { x: 0, y: 8, w: 6, h: 8 }
      });
    }
    
    // If we have multiple numeric columns, create a pie chart
    if (numericColumns.length >= 1 && categoricalColumns.length > 0) {
      visualizations.push({
        id: 'pie-1',
        type: 'pie',
        title: `Distribution of ${numericColumns[0]} by ${categoricalColumns[0]}`,
        columns: [categoricalColumns[0], numericColumns[0]],
        position: { x: 6, y: 0, w: 6, h: 8 }
      });
    }
    
    // If we have date columns and numeric columns, create a line chart
    const dateColumns = columns.filter(col => columnStats[col].type === 'date');
    if (dateColumns.length > 0 && numericColumns.length > 0) {
      visualizations.push({
        id: 'line-1',
        type: 'line',
        title: `${numericColumns[0]} Over Time`,
        columns: [dateColumns[0], numericColumns[0]],
        position: { x: 6, y: 8, w: 6, h: 8 }
      });
    }
    
    // Add a data table
    visualizations.push({
      id: 'table-1',
      type: 'table',
      title: 'Data Table',
      columns: columns.slice(0, 5), // First 5 columns
      position: { x: 0, y: 16, w: 12, h: 8 }
    });
    
    return visualizations;
  }, []);

  // Process natural language queries to generate insights
  const processNaturalLanguageQuery = useCallback(async (
    query: string, 
    data: CSVData, 
    summary: DataSummary
  ): Promise<NLQueryResult> => {
    // This is a simplified implementation - in a real app, this would use an API
    // to process natural language queries
    
    // For this example, we'll parse simple queries and generate canned responses
    const queryLowerCase = query.toLowerCase();
    const result: NLQueryResult = {
      query: query,
      queryText: query,
      result: "I've analyzed your question and generated the following visualizations.",
      answer: "I've analyzed your question and generated the following visualizations.",
      visualizations: []
    };
    
    const { headers, rows } = data;
    const numericColumns = headers.filter(h => summary.columnStats[h].type === 'numeric');
    const categoryColumns = headers.filter(h => summary.columnStats[h].type === 'categorical');
    const dateColumns = headers.filter(h => summary.columnStats[h].type === 'date');
    
    // Handle various query types
    if (queryLowerCase.includes('show') && queryLowerCase.includes('distribution')) {
      // Find the column that might be mentioned in the query
      const mentionedColumn = headers.find(h => queryLowerCase.includes(h.toLowerCase()));
      const columnToUse = mentionedColumn || (numericColumns.length > 0 ? numericColumns[0] : headers[0]);
      
      if (summary.columnStats[columnToUse].type === 'numeric') {
        // For numeric columns, create a bar chart with distribution
        result.visualizations?.push({
          id: `query-chart-${Date.now()}`,
          type: 'bar',
          title: `Distribution of ${columnToUse}`,
          columns: [columnToUse],
          description: `Shows the distribution of values in the ${columnToUse} column.`,
          position: { x: 0, y: 0, w: 6, h: 8 }
        });
      } else {
        // For categorical columns, create a pie chart
        result.visualizations?.push({
          id: `query-chart-${Date.now()}`,
          type: 'pie',
          title: `Distribution of ${columnToUse}`,
          columns: [columnToUse],
          description: `Shows the distribution of categories in the ${columnToUse} column.`,
          position: { x: 0, y: 0, w: 6, h: 8 }
        });
      }
    } 
    else if (queryLowerCase.includes('compare') || queryLowerCase.includes('correlation')) {
      // Try to find two columns that might be mentioned
      const mentionedColumns = headers.filter(h => queryLowerCase.includes(h.toLowerCase()));
      
      if (mentionedColumns.length >= 2) {
        result.visualizations?.push({
          id: `query-chart-${Date.now()}`,
          type: 'scatter',
          title: `${mentionedColumns[0]} vs ${mentionedColumns[1]}`,
          columns: [mentionedColumns[0], mentionedColumns[1]],
          description: `Comparison between ${mentionedColumns[0]} and ${mentionedColumns[1]}.`,
          position: { x: 0, y: 0, w: 6, h: 8 }
        });
      } else if (numericColumns.length >= 2) {
        result.visualizations?.push({
          id: `query-chart-${Date.now()}`,
          type: 'scatter',
          title: `${numericColumns[0]} vs ${numericColumns[1]}`,
          columns: [numericColumns[0], numericColumns[1]],
          description: `Comparison between ${numericColumns[0]} and ${numericColumns[1]}.`,
          position: { x: 0, y: 0, w: 6, h: 8 }
        });
      }
    }
    else if (queryLowerCase.includes('trend') || queryLowerCase.includes('time')) {
      if (dateColumns.length > 0 && numericColumns.length > 0) {
        // Find the mentioned column if any
        const mentionedNumericColumn = numericColumns.find(h => queryLowerCase.includes(h.toLowerCase())) 
          || numericColumns[0];
          
        result.visualizations?.push({
          id: `query-chart-${Date.now()}`,
          type: 'line',
          title: `${mentionedNumericColumn} Over Time`,
          columns: [dateColumns[0], mentionedNumericColumn],
          description: `Shows how ${mentionedNumericColumn} changes over time.`,
          position: { x: 0, y: 0, w: 6, h: 8 }
        });
      }
    }
    else if (queryLowerCase.includes('summary') || queryLowerCase.includes('overview')) {
      result.visualizations?.push({
        id: `query-chart-${Date.now()}`,
        type: 'summary',
        title: 'Data Summary',
        columns: headers,
        description: 'Provides a statistical summary of the data.',
        position: { x: 0, y: 0, w: 6, h: 8 }
      });
    }
    else {
      // Default response for queries we can't parse
      result.answer = "I'm not sure how to answer that specific question. Here are some general insights about your data:";
      
      // Add a random visualization from possible types
      const { possibleVisualizations } = summary;
      
      if (possibleVisualizations.includes('bar') && numericColumns.length > 0 && categoryColumns.length > 0) {
        result.visualizations?.push({
          id: `query-chart-${Date.now()}`,
          type: 'bar',
          title: `${categoryColumns[0]} by ${numericColumns[0]}`,
          columns: [categoryColumns[0], numericColumns[0]],
          description: `Analysis of ${numericColumns[0]} grouped by ${categoryColumns[0]}.`,
          position: { x: 0, y: 0, w: 6, h: 8 }
        });
      } else if (possibleVisualizations.includes('pie') && numericColumns.length > 0) {
        result.visualizations?.push({
          id: `query-chart-${Date.now()}`,
          type: 'pie',
          title: `Distribution of ${numericColumns[0]}`,
          columns: [numericColumns[0]],
          description: `Shows the distribution of values in ${numericColumns[0]}.`,
          position: { x: 0, y: 0, w: 6, h: 8 }
        });
      } else {
        result.visualizations?.push({
          id: `query-chart-${Date.now()}`,
          type: 'table',
          title: 'Data Sample',
          columns: headers,
          description: 'A sample of the data for exploration.',
          position: { x: 0, y: 0, w: 6, h: 8 }
        });
      }
    }
    
    return result;
  }, []);

  // Helper function to generate insights
  const generateSuggestedInsights = (data: CSVData, columnStats: Record<string, ColumnStats>): string[] => {
    const insights: string[] = [];
    const { headers, rows } = data;
    
    // Simple insights based on data shape
    insights.push(`Your dataset contains ${rows.length} records with ${headers.length} fields.`);
    
    // Find missing data
    const columnsWithMissing = headers.filter(h => columnStats[h].missingValues > 0);
    if (columnsWithMissing.length > 0) {
      insights.push(`${columnsWithMissing.length} columns have missing values.`);
    }
    
    // Insights for numeric columns
    const numericColumns = headers.filter(h => columnStats[h].type === 'numeric');
    if (numericColumns.length > 0) {
      // Find column with highest value
      const maxValues = numericColumns.map(col => ({
        col,
        max: columnStats[col].max
      })).sort((a, b) => (b.max || 0) - (a.max || 0));
      
      if (maxValues.length > 0 && maxValues[0].max !== undefined) {
        insights.push(`The highest ${maxValues[0].col} value is ${maxValues[0].max}.`);
      }
    }
    
    // Insights for categorical columns
    const categoricalColumns = headers.filter(h => columnStats[h].type === 'categorical');
    if (categoricalColumns.length > 0) {
      const col = categoricalColumns[0];
      const mostCommon = columnStats[col].mostCommonValues?.[0];
      if (mostCommon) {
        insights.push(`The most common ${col} is "${mostCommon.value}" (${mostCommon.count} occurrences).`);
      }
    }
    
    return insights;
  };

  return {
    analyzeData,
    generateInitialVisualizations,
    processNaturalLanguageQuery,
    dataSummary,
    isAnalyzing,
    error
  };
}
