import { useMemo } from 'react';
import type { WellDataPoint } from '../types/well';

interface TooltipData {
  depth: string;
  entries: Array<{
    key: string;
    displayValue: string;
  }>;
}

interface UseTooltipCacheProps {
  data: WellDataPoint[];
}

export const useTooltipCache = ({ data }: UseTooltipCacheProps) => {
  const tooltipCache = useMemo(() => {
    const cache = new Map<number, TooltipData>();
    
    data.forEach((point) => {
      const entries = Object.entries(point)
        .filter(([key]) => key !== 'depth')
        .map(([key, value]) => ({
          key,
          displayValue: typeof value === 'number' 
            ? value.toFixed(3)
            : value !== undefined && value !== null 
            ? String(value)
            : ''
        }));

      cache.set(point.depth, {
        depth: `${point.depth} ft`,
        entries
      });
    });
    
    return cache;
  }, [data]);

  const getTooltipData = (depth: number): TooltipData | null => {
    return tooltipCache.get(depth) || null;
  };

  return {
    getTooltipData,
    isReady: tooltipCache.size > 0
  };
}; 