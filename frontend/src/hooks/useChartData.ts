import { useMemo, useRef } from 'react';
import type { WellDataPoint } from '../types/well';

interface UseChartDataProps {
  data: WellDataPoint[];
  zoomLevel: number;
  dataKey?: string;
}

export const useChartData = ({ data, zoomLevel, dataKey = 'default' }: UseChartDataProps) => {
  const dataCache = useRef<Map<string, any[]>>(new Map());
  
  const cacheKey = useMemo(() => {
    if (data.length === 0) return 'empty';
    return `${dataKey}-${data.length}-${data[0].depth}-${data[data.length - 1].depth}-${zoomLevel}`;
  }, [data, dataKey, zoomLevel]);
  const processedData = useMemo(() => {
    const cached = dataCache.current.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    const sortedData = [...data].sort((a, b) => b.depth - a.depth);
    let limitedData = sortedData;
    if (zoomLevel > 1) {
      const reductionFactor = zoomLevel === 1.5 ? 0.85 : 0.7; 
      const step = Math.max(1, Math.floor(sortedData.length / (sortedData.length * reductionFactor)));
      limitedData = sortedData.filter((_, index) => index % step === 0);
    } else {
      limitedData = sortedData.length > 500 ? sortedData.slice(0, 500) : sortedData;
    }
    
    const processed = limitedData.map(point => ({
      depth: point.depth,
      SH: point.SH * 100,
      SS: point.SS * 100,
      DT: point.DT,
      GR: point.GR,
      MINFINAL: point.MINFINAL,
      UCS: point.UCS,
      FA: point.FA,
      RAT: point.RAT,
      ROP: point.ROP,
    }));
    
    dataCache.current.set(cacheKey, processed);
    return processed;
  }, [data, cacheKey, zoomLevel]);

  return processedData;
}; 