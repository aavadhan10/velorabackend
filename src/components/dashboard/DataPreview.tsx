
import React from 'react';
import { CSVData } from '../../types';

interface DataPreviewProps {
  data: CSVData;
  show: boolean;
}

const DataPreview: React.FC<DataPreviewProps> = ({ data, show }) => {
  if (!show) return null;
  
  return (
    <div className="border rounded-lg overflow-hidden mt-2">
      <div className="bg-secondary/50 py-2 px-4 font-medium">Data Preview</div>
      <div className="overflow-x-auto max-h-[200px]">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-secondary/30">
            <tr>
              {data.headers.map(header => (
                <th key={header} className="px-3 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {data.rows.slice(0, 5).map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white/50' : 'bg-secondary/20'}>
                {data.headers.map(header => (
                  <td key={`${idx}-${header}`} className="px-3 py-2 text-sm whitespace-nowrap">
                    {String(row[header] !== undefined ? row[header] : '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPreview;
