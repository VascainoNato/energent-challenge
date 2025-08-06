export const COMPOSITION_LEGENDS = [
  { key: 'SH', color: '#FF69B4', label: 'SH' },
  { key: 'SS', color: '#4169E1', label: 'SS' },
  { key: 'LS', color: '#FFD700', label: 'LS' },
  { key: 'DOL', color: '#00CED1', label: 'DOL' },
  { key: 'ANH', color: '#800080', label: 'ANH' },
  { key: 'Coal', color: '#FFA500', label: 'Coal' },
  { key: 'Salt', color: '#D3D3D3', label: 'Salt' },
];

export const CHART_MARGINS = {
  unified: { top: 40, right: 30, left: 5, bottom: 5 },
  filter: { top: 5, right: 30, left: 20, bottom: 5 },
};

export const AXIS_CONFIG = {
  unified: {
    xAxis: {
      type: 'number' as const,
      domain: [0, 100],
      tick: { fontSize: 12 },
      orientation: 'top' as const,
      width: 80,
      ticks: [0, 20, 40, 60, 80, 100],
      allowDataOverflow: false,
    },
    yAxis: {
      dataKey: 'depth',
      type: 'category' as const,
      tick: { fontSize: 10 },
      label: { value: 'Depth (ft)', angle: -90, position: 'insideLeft' as const },
      width: 80,
      reversed: true,
    },
  },
  filter: {
    xAxis: {
      dataKey: 'depth',
      label: { value: 'Depth (ft)', position: 'insideBottom' as const, offset: -10 },
      tick: { fontSize: 12 },
      stroke: '#666',
    },
    yAxis: {
      label: { angle: -90, position: 'insideLeft' as const },
      tick: { fontSize: 12 },
      stroke: '#666',
    },
  },
}; 