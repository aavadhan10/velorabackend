import { VisualizationConfig, CSVData } from '../types';

// Optimized chart data preparation with memoization cache
const chartDataCache = new Map();

// Function to clear the cache when needed (e.g., when new data is loaded)
export const clearChartDataCache = () => {
  chartDataCache.clear();
};

export const getChartData = (config: VisualizationConfig, data: CSVData) => {
  const { type, columns } = config;
  const { rows } = data;
  
  // Create cache key - include a timestamp for uniqueness with each dataset
  const cacheKey = `${type}-${columns.join('-')}-${rows.length}-${Date.now()}`;
  
  // Return cached data if available
  if (chartDataCache.has(cacheKey)) {
    return chartDataCache.get(cacheKey);
  }
  
  // For large datasets, limit the number of data points
  const limitedRows = rows.length > 100 ? rows.slice(0, 100) : rows;
  
  let result;
  switch (type) {
    case 'bar': 
      result = prepareBarChartData(columns, limitedRows);
      break;
    case 'line':
      result = prepareLineChartData(columns, limitedRows);
      break;
    case 'pie':
      result = preparePieChartData(columns, limitedRows);
      break;
    case 'area':
      result = prepareAreaChartData(columns, limitedRows);
      break;
    case 'scatter':
      result = prepareScatterChartData(columns, limitedRows);
      break;
    case 'table':
      result = limitedRows.slice(0, 100); // Limit to first 100 rows
      break;
    case 'summary':
      result = prepareSummaryDataEfficient(columns, limitedRows);
      break;
    default:
      result = [];
  }
  
  // Cache the result
  chartDataCache.set(cacheKey, result);
  return result;
};

// Create a more efficient summary data generator
const prepareSummaryDataEfficient = (columns: string[], rows: Record<string, any>[]) => {
  // Pre-allocate summary object
  const summary: Record<string, any> = {
    rowCount: rows.length,
    columns: {}
  };
  
  // Process each column once
  for (let colIndex = 0; colIndex < columns.length; colIndex++) {
    const column = columns[colIndex];
    const columnData: any[] = [];
    let numericCount = 0;
    let missingCount = 0;
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    const uniqueValues = new Set();
    
    // Gather column data in one pass
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const value = rows[rowIndex][column];
      uniqueValues.add(value);
      
      if (value === undefined || value === null || value === '') {
        missingCount++;
        continue;
      }
      
      columnData.push(value);
      
      if (typeof value === 'number') {
        numericCount++;
        sum += value;
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    }
    
    // Determine column type
    const isNumeric = numericCount > rows.length * 0.8;
    
    // Build column stats
    summary.columns[column] = {
      type: isNumeric ? 'numeric' : 'categorical',
      uniqueValueCount: uniqueValues.size,
      missingValueCount: missingCount
    };
    
    // Add numeric stats if needed
    if (isNumeric && numericCount > 0) {
      summary.columns[column].min = min;
      summary.columns[column].max = max;
      summary.columns[column].avg = sum / numericCount;
    }
  }
  
  return summary;
};

// Pre-computed color array to avoid regenerating colors
const baseColors = [
  '#3182CE', // Blue
  '#805AD5', // Purple
  '#D53F8C', // Pink
  '#DD6B20', // Orange
  '#38A169', // Green
  '#E53E3E', // Red
  '#718096', // Gray
  '#975A16', // Brown
  '#2B6CB0', // Darker Blue
  '#6B46C1'  // Darker Purple
];

// Cached extended colors
const extendedColorsCache = new Map();

export const getChartColors = (count: number) => {
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  // Check cache for extended colors
  if (extendedColorsCache.has(count)) {
    return extendedColorsCache.get(count);
  }
  
  // Generate extended colors
  const colors = [...baseColors];
  
  for (let i = baseColors.length; i < count; i++) {
    // Generate deterministic colors based on index
    const hue = (i * 137) % 360;
    const saturation = 70 + (i % 3) * 10;
    const lightness = 50 + (i % 5) * 5;
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  
  // Cache the extended colors
  extendedColorsCache.set(count, colors);
  return colors;
};

// Use WeakMap to avoid memory leaks
const groupCache = new WeakMap();

// Optimized grouping function with early type checking
const groupAndAggregate = (
  rows: Record<string, any>[], 
  groupBy: string, 
  valueColumn: string,
  aggregation: 'sum' | 'avg' | 'count' = 'sum'
) => {
  // Early type checking for performance
  const isValueColumnNumeric = rows.length > 0 && typeof rows[0][valueColumn] === 'number';
  
  const groupedData: Record<string, { sum: number; count: number }> = {};
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const key = String(row[groupBy] || 'Unknown');
    
    // Fast path for numeric values
    const value = isValueColumnNumeric ? row[valueColumn] : 
                 (typeof row[valueColumn] === 'number' ? row[valueColumn] : 0);
    
    if (!groupedData[key]) {
      groupedData[key] = { sum: value, count: 1 };
    } else {
      groupedData[key].sum += value;
      groupedData[key].count += 1;
    }
  }
  
  // Convert to final format based on aggregation type
  const result = [];
  for (const [name, data] of Object.entries(groupedData)) {
    let finalValue;
    
    switch (aggregation) {
      case 'avg':
        finalValue = data.count > 0 ? data.sum / data.count : 0;
        break;
      case 'count':
        finalValue = data.count;
        break;
      case 'sum':
      default:
        finalValue = data.sum;
    }
    
    result.push({ name, value: finalValue });
  }
  
  return result;
};

// Optimized data preparation functions
const prepareBarChartData = (columns: string[], rows: Record<string, any>[]) => {
  if (columns.length < 2) {
    // If only one column provided, count occurrences
    return groupAndAggregate(rows, columns[0], columns[0], 'count');
  }
  
  // Group by first column and aggregate the second
  return groupAndAggregate(rows, columns[0], columns[1]);
};

const prepareLineChartData = (columns: string[], rows: Record<string, any>[]) => {
  if (columns.length < 2) return [];
  
  // Check if first column looks like dates
  const firstColSample = rows.length > 0 ? rows[0][columns[0]] : null;
  const isDateLike = typeof firstColSample === 'string' && !isNaN(new Date(firstColSample).getTime());
  
  // Optimize sort based on data type
  const sortedData = [...rows].sort((a, b) => {
    const aVal = a[columns[0]];
    const bVal = b[columns[0]];
    
    if (isDateLike) {
      return new Date(aVal).getTime() - new Date(bVal).getTime();
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return aVal - bVal;
    }
    
    return String(aVal).localeCompare(String(bVal));
  });
  
  // Map directly to the required format
  return sortedData.map(row => ({
    name: row[columns[0]],
    value: row[columns[1]]
  }));
};

const preparePieChartData = (columns: string[], rows: Record<string, any>[]) => {
  // Reuse bar chart logic
  return prepareBarChartData(columns, rows);
};

const prepareAreaChartData = (columns: string[], rows: Record<string, any>[]) => {
  // Reuse line chart logic
  return prepareLineChartData(columns, rows);
};

const prepareScatterChartData = (columns: string[], rows: Record<string, any>[]) => {
  if (columns.length < 2) return [];
  
  // Direct mapping without intermediate arrays
  return rows.map(row => ({
    x: row[columns[0]],
    y: row[columns[1]],
    name: `${row[columns[0]]}, ${row[columns[1]]}`
  }));
};

const prepareSummaryData = (columns: string[], rows: Record<string, any>[]) => {
  const summary: Record<string, any> = {
    rowCount: rows.length,
    columns: {}
  };
  
  columns.forEach(column => {
    // Calculate values in a single pass
    let numericCount = 0;
    let missingCount = 0;
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    const uniqueValues = new Set();
    
    for (let i = 0; i < rows.length; i++) {
      const value = rows[i][column];
      uniqueValues.add(value);
      
      if (value === undefined || value === null || value === '') {
        missingCount++;
        continue;
      }
      
      if (typeof value === 'number') {
        numericCount++;
        sum += value;
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    }
    
    summary.columns[column] = {
      type: numericCount > 0.8 * rows.length ? 'numeric' : 'categorical',
      uniqueValueCount: uniqueValues.size,
      missingValueCount: missingCount
    };
    
    if (numericCount > 0) {
      summary.columns[column].min = min;
      summary.columns[column].max = max;
      summary.columns[column].avg = sum / numericCount;
    }
  });
  
  return summary;
};
