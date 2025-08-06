import { useMemo } from 'react';
import type { WellDataPoint } from '../types/well';

interface UseFilterChartDataProps {
  data: WellDataPoint[];
  parameter: string;
  zoomLevel: number;
}

export const useFilterChartData = ({ data, parameter, zoomLevel }: UseFilterChartDataProps) => {
  const chartData = useMemo(() => {
    const sortedData = [...data].sort((a, b) => b.depth - a.depth);
    
    let limitedData = sortedData;
    if (zoomLevel > 1) {
      const reductionFactor = zoomLevel === 1.5 ? 0.85 : 0.7; 
      const step = Math.max(1, Math.floor(sortedData.length / (sortedData.length * reductionFactor)));
      limitedData = sortedData.filter((_, index) => index % step === 0);
    }
    
    return limitedData.map(point => ({
      depth: point.depth,
      [parameter]: point[parameter as keyof WellDataPoint]
    }));
  }, [data, parameter, zoomLevel]);

  return chartData;
}; 