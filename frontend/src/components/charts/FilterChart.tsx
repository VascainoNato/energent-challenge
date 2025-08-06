import React, { memo, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { WellDataPoint } from '../../types/well';
import { useFilterChartData } from '../../hooks/useFilterChartData';
import { useChartHeight } from '../../hooks/useChartHeight';
import { getParameterName, getParameterColor } from '../../utils/chartUtils';
import { CHART_MARGINS, AXIS_CONFIG } from '../../constants/chartConstants';

interface FilterChartProps {
  data: WellDataPoint[];
  parameter: string;
  onRemove: (parameter: string) => void;
  zoomLevel?: number;
}

const FilterTooltip = memo(({ active, payload, label, parameter }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-3 border rounded shadow-lg pointer-events-none">
      <p className="font-semibold mb-2">Depth: {label} ft</p>
      <p className="text-xs mb-1">
        <span className="font-semibold">{parameter}:</span> {
          typeof payload[0].value === 'number' 
            ? payload[0].value.toFixed(3) 
            : payload[0].value
        }
      </p>
    </div>
  );
});

FilterTooltip.displayName = 'FilterTooltip';

const FilterChart: React.FC<FilterChartProps> = memo(({ 
  data, 
  parameter, 
  onRemove,
  zoomLevel = 1
}) => {
  const chartData = useFilterChartData({ data, parameter, zoomLevel });
  const chartHeight = useChartHeight({ dataLength: chartData.length, zoomLevel });

  const yAxisInterval = useMemo(() => {
    return Math.max(1, Math.floor(chartData.length / 100));
  }, [chartData.length]);

  const handleRemove = useCallback(() => {
    onRemove(parameter);
  }, [onRemove, parameter]);

  const CustomTooltip = useCallback((props: any) => (
    <FilterTooltip {...props} parameter={parameter} />
  ), [parameter]);

  return (
    <div className="w-full h-full outline-none" style={{ maxHeight: 800, overflowY: 'auto' }}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{getParameterName(parameter)}</h3>
        <div className="flex items-center gap-2">
          {zoomLevel > 1 && (
            <span className="text-sm text-gray-500">Zoom: {zoomLevel}x</span>
          )}
          <button
            onClick={handleRemove}
            className="text-red-600 font-semibold cursor-pointer hover:text-red-800"
          >
            ×
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={chartHeight} className="outline-none">
        <LineChart
          data={chartData}
          layout="vertical"
          margin={CHART_MARGINS.unified}
        >
          <XAxis {...AXIS_CONFIG.unified.xAxis} />
          <YAxis 
            dataKey="depth"
            type="category"
            tick={{ fontSize: 10 }}
            width={80}
            reversed={true}
            interval={yAxisInterval}
            hide={true}
          />
          <Tooltip 
            content={CustomTooltip}
            animationDuration={0}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey={parameter}
            stroke={getParameterColor(parameter)}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, stroke: getParameterColor(parameter), strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

FilterChart.displayName = 'FilterChart';

export default FilterChart; 