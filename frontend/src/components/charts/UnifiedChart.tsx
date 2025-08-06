import React, { useCallback, memo, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { WellDataPoint } from '../../types/well';
import { useDebouncedDepth } from '../../hooks/useDebouncedDepth';
import { useChartData } from '../../hooks/useChartData';
import { useChartHeight } from '../../hooks/useChartHeight';
import { useTooltipCache } from '../../hooks/useTooltipCache';
import { getCompositionColors, getLegendName } from '../../utils/chartUtils';
import { COMPOSITION_LEGENDS, CHART_MARGINS, AXIS_CONFIG } from '../../constants/chartConstants';
import { OptimizedTooltip } from './OptimizedTooltip';

interface UnifiedChartProps {
  data: WellDataPoint[];
  selectedDepth?: number;
  onDepthSelect?: (depth: number) => void;
  onParameterSelect?: (parameter: string) => void;
  selectedParameter?: string | null;
  zoomLevel?: number;
}

const UnifiedChart: React.FC<UnifiedChartProps> = memo(({ 
  data, 
  onDepthSelect,
  onParameterSelect,
  selectedParameter,
  zoomLevel = 1
}) => {
  const [filteredParameter, setFilteredParameter] = useState<string | null>(selectedParameter || null);
  const chartData = useChartData({ data, zoomLevel, dataKey: 'unified' });
  const chartHeight = useChartHeight({ dataLength: chartData.length, zoomLevel });
  const compositionColors = getCompositionColors();
  
  const { getTooltipData, isReady } = useTooltipCache({ data: chartData });

  const yAxisInterval = useMemo(() => {
    return Math.max(1, Math.floor(chartData.length / 100));
  }, [chartData.length]);

  const debouncedDepthSelect = useDebouncedDepth(
    useCallback((depth: number) => {
      if (onDepthSelect) {
        onDepthSelect(depth);
      }
    }, [onDepthSelect]),
    400
  );

  const handleChartClick = useCallback((data: any) => {
    if (data?.activePayload?.[0]?.payload) {
      const payload = data.activePayload[0].payload;
      
      if (onDepthSelect) {
        debouncedDepthSelect(payload.depth);
      }
      
      if (onParameterSelect && data.activePayload[0].dataKey !== 'depth') {
        onParameterSelect(data.activePayload[0].dataKey);
        setFilteredParameter(data.activePayload[0].dataKey);
      }
    }
  }, [onDepthSelect, onParameterSelect, debouncedDepthSelect]);

  const barsToRender = filteredParameter && !['SH', 'SS'].includes(filteredParameter)
    ? []
    : filteredParameter 
      ? ['SH', 'SS'].filter(key => key === filteredParameter)
      : ['SH', 'SS'];

  const CustomTooltip = useCallback((props: any) => {
    const tooltipData = isReady && props.label ? getTooltipData(Number(props.label)) : null;
    return (
      <OptimizedTooltip 
        {...props} 
        tooltipData={tooltipData}
      />
    );
  }, [getTooltipData, isReady]);

  return (
    <div className="w-full h-full outline-none" style={{ maxHeight: 800, overflowY: 'auto' }}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Rock Composition</h3>
        {zoomLevel > 1 && (
          <span className="text-sm text-gray-500">Zoom: {zoomLevel}x</span>
        )}
      </div>
      
      <div className="flex gap-2 flex-row">
        {COMPOSITION_LEGENDS.map(({ key, color, label }) => (
          <div key={key} className='flex items-center gap-2'>
            <div className='h-3 w-8 rounded' style={{ backgroundColor: color }}></div>
            <p className='text-sm'>{label}</p>
          </div>
        ))}
      </div>
      
      <ResponsiveContainer width="100%" height={chartHeight} className="outline-none">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={CHART_MARGINS.unified}
          onClick={handleChartClick}
        >
          <XAxis 
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            orientation="top"
            width={80}
            allowDataOverflow={false}
            interval={0}
            minTickGap={50}
            tickCount={7}
            tickFormatter={(index) => {
              const targetValues = [0, 20, 40, 60, 80, 100];
              return targetValues[index]?.toString() || '';
            }}
          />
          <YAxis 
            {...AXIS_CONFIG.unified.yAxis}
            interval={yAxisInterval}
          />
          <Tooltip 
            content={CustomTooltip}
            animationDuration={0}
            isAnimationActive={false}
          />
          {barsToRender.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={compositionColors[key as keyof typeof compositionColors]}
              name={getLegendName(key)}
              isAnimationActive={false}
              strokeWidth={0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

UnifiedChart.displayName = 'UnifiedChart';

export default UnifiedChart;