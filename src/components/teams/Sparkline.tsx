import type { MetricTone } from '../../utils/teamMetrics';

interface SparklineProps {
  values: number[];
  tone: MetricTone;
  width?: number;
  height?: number;
}

const TONE_COLOR: Record<MetricTone, string> = {
  good: '#3dff8b',
  warn: '#ffb020',
  bad: '#ff5c5c',
  neutral: '#9aa39c',
};

export function Sparkline({ values, tone, width = 72, height = 22 }: SparklineProps) {
  if (values.length < 2) {
    return <svg width={width} height={height} aria-hidden />;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 0.0001);
  const stepX = width / (values.length - 1);

  const points = values
    .map((value, index) => {
      const x = index * stepX;
      const y = height - ((value - min) / span) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg className="sparkline" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <polyline
        fill="none"
        stroke={TONE_COLOR[tone]}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}
