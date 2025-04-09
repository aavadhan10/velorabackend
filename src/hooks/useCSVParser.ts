
import { useState, useCallback } from 'react';
import { CSVData } from '../types';
import { toast } from 'sonner';

export function useCSVParser() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = useCallback((file: File): Promise<CSVData> => {
    return new Promise((resolve, reject) => {
      setIsLoading(true);
      setError(null);

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          if (!event.target?.result) {
            throw new Error('Failed to read file');
          }

          const csv = event.target.result as string;
          const lines = csv.split('\n');
          
          if (lines.length < 2) {
            throw new Error('CSV file must contain at least headers and one row of data');
          }
          
          // Parse headers (first line)
          const headers = lines[0].split(',').map(header => header.trim());
          
          if (headers.length === 0) {
            throw new Error('No headers found in CSV file');
          }
          
          // Parse rows
          const rows: Record<string, string | number>[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue; // Skip empty lines
            
            const values = lines[i].split(',').map(value => value.trim());
            const row: Record<string, string | number> = {};
            
            headers.forEach((header, index) => {
              // Try to convert to number if possible
              const value = values[index] || '';
              const numValue = Number(value);
              row[header] = !isNaN(numValue) && value !== '' ? numValue : value;
            });
            
            rows.push(row);
          }
          
          console.log('Parsed CSV data:', { headers, rows: rows.length });
          
          setIsLoading(false);
          resolve({
            headers,
            rows,
            rawData: csv
          });
        } catch (err) {
          setIsLoading(false);
          const errorMessage = err instanceof Error ? err.message : 'Failed to parse CSV file';
          setError(errorMessage);
          toast.error(errorMessage);
          reject(new Error(errorMessage));
        }
      };
      
      reader.onerror = () => {
        setIsLoading(false);
        const errorMessage = 'Failed to read file';
        setError(errorMessage);
        toast.error(errorMessage);
        reject(new Error(errorMessage));
      };
      
      reader.readAsText(file);
    });
  }, []);

  const parseCSVFromDragEvent = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      
      // Validate file type
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        const errorMessage = 'Please upload a CSV file';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      }
      
      try {
        console.log('Processing CSV file:', file.name);
        toast.info(`Processing CSV file: ${file.name}`);
        return await parseCSV(file);
      } catch (err) {
        console.error('Error parsing CSV:', err);
        return null;
      }
    } else {
      console.error('No files in drag event');
      toast.error('No file detected');
      return null;
    }
    
    return null;
  }, [parseCSV]);

  return {
    parseCSV,
    parseCSVFromDragEvent,
    isLoading,
    error
  };
}
