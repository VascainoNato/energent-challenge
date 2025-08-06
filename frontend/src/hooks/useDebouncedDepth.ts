import { useCallback, useRef } from 'react';

export function useDebouncedDepth(
  onDepthChange: (depth: number) => void, 
  delay: number = 300
) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastDepthRef = useRef<number | null>(null);

  const debouncedDepthChange = useCallback((depth: number) => {
    // Se é a mesma profundidade, ignorar
    if (lastDepthRef.current === depth) {
      return;
    }
    
    lastDepthRef.current = depth;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      onDepthChange(depth);
    }, delay);
  }, [onDepthChange, delay]);

  return debouncedDepthChange;
} 