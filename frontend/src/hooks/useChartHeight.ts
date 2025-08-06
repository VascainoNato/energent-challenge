import { useMemo } from 'react';

interface UseChartHeightProps {
  dataLength: number;
  zoomLevel: number;
  baseMultiplier?: number;
}

export const useChartHeight = ({ 
  dataLength, 
  zoomLevel, 
  baseMultiplier = 4 
}: UseChartHeightProps) => {
  const chartHeight = useMemo(() => {
    const baseHeight = Math.max(2000, dataLength * baseMultiplier);
    if (zoomLevel === 1) {
      return baseHeight;
    } else if (zoomLevel === 1.5) {
      return Math.min(baseHeight * 1.5, 6000); 
    } else {
      return Math.min(baseHeight * 2.5, 10000); 
    }
  }, [dataLength, zoomLevel, baseMultiplier]);

  return chartHeight;
}; 