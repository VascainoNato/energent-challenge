import { memo } from 'react';

interface OptimizedTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
  tooltipData?: {
    depth: string;
    entries: Array<{
      key: string;
      displayValue: string;
    }>;
  } | null;
}

export const OptimizedTooltip = memo(({ active, tooltipData }: OptimizedTooltipProps) => {
  if (!active || !tooltipData) return null;

  return (
    <div className="bg-white p-3 border rounded shadow-lg pointer-events-none">
      <p className="font-semibold mb-2">Depth: {tooltipData.depth}</p>
      {tooltipData.entries.map((entry) => (
        <p key={entry.key} className="text-xs mb-1">
          <span className="font-semibold">{entry.key}:</span> {entry.displayValue}
        </p>
      ))}
    </div>
  );
});

OptimizedTooltip.displayName = 'OptimizedTooltip'; 