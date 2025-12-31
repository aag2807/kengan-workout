import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Button } from './ui/button';

interface WeighIn {
  date: string;
  weight: number;
  notes?: string;
}

interface WeightProgressChartProps {
  weighIns: WeighIn[];
  startWeight?: number;
  targetWeight?: number;
}

type DateRange = '1m' | '3m' | 'all';

export default function WeightProgressChart({
  weighIns,
  startWeight,
  targetWeight,
}: WeightProgressChartProps) {
  const [dateRange, setDateRange] = useState<DateRange>('all');

  // Filter data based on selected range
  const filteredData = useMemo(() => {
    if (!weighIns.length) return [];

    const now = new Date();
    let cutoffDate: Date;

    switch (dateRange) {
      case '1m':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3m':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      default:
        cutoffDate = new Date(0); // All time
    }

    return weighIns
      .filter((w) => new Date(w.date) >= cutoffDate)
      .map((w) => ({
        date: new Date(w.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        weight: w.weight,
        fullDate: w.date,
      }))
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  }, [weighIns, dateRange]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!filteredData.length) return null;

    const weights = filteredData.map((d) => d.weight);
    const currentWeight = weights[weights.length - 1];
    const firstWeight = weights[0];
    const totalLoss = firstWeight - currentWeight;
    const percentChange = ((totalLoss / firstWeight) * 100).toFixed(1);

    return {
      currentWeight,
      totalLoss,
      percentChange,
      firstWeight,
    };
  }, [filteredData]);

  // Calculate Y-axis domain for better visualization
  const yAxisDomain = useMemo(() => {
    if (!filteredData.length) return [0, 100];

    const weights = filteredData.map((d) => d.weight);
    const allValues = [...weights];
    
    if (startWeight) allValues.push(startWeight);
    if (targetWeight) allValues.push(targetWeight);

    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.1 || 5; // 10% padding or 5kg minimum

    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [filteredData, startWeight, targetWeight]);

  if (!weighIns.length) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-white mb-2">No Weight Data Yet</h3>
        <p className="text-arena-chalk text-sm">
          Start logging your weekly weigh-ins to see your progress!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 bg-arena-darker rounded-lg border border-arena-cage text-center">
            <div className="text-arena-chalk text-xs mb-1">Current</div>
            <div className="text-white font-bold text-xl">{stats.currentWeight} kg</div>
          </div>
          <div className="p-3 bg-arena-darker rounded-lg border border-fighter-home text-center">
            <div className="text-arena-chalk text-xs mb-1">Lost</div>
            <div className="text-fighter-home font-bold text-xl">
              {stats.totalLoss > 0 ? '-' : ''}
              {Math.abs(stats.totalLoss).toFixed(1)} kg
            </div>
          </div>
          <div className="p-3 bg-arena-darker rounded-lg border border-fighter-home text-center">
            <div className="text-arena-chalk text-xs mb-1">Change</div>
            <div className="text-fighter-home font-bold text-xl">
              {stats.totalLoss > 0 ? '-' : '+'}
              {Math.abs(parseFloat(stats.percentChange))}%
            </div>
          </div>
        </div>
      )}

      {/* Date Range Selector */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={dateRange === '1m' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setDateRange('1m')}
          className={dateRange === '1m' ? 'bg-fighter-home text-white' : 'text-arena-chalk'}
        >
          1 Month
        </Button>
        <Button
          variant={dateRange === '3m' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setDateRange('3m')}
          className={dateRange === '3m' ? 'bg-fighter-home text-white' : 'text-arena-chalk'}
        >
          3 Months
        </Button>
        <Button
          variant={dateRange === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setDateRange('all')}
          className={dateRange === 'all' ? 'bg-fighter-home text-white' : 'text-arena-chalk'}
        >
          All Time
        </Button>
      </div>

      {/* Chart */}
      <div className="bg-arena-darker rounded-lg border border-arena-cage p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis
              domain={yAxisDomain}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#9ca3af' }}
              label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #4ade80',
                borderRadius: '8px',
                color: '#fff',
              }}
              labelStyle={{ color: '#9ca3af', fontSize: '12px' }}
              itemStyle={{ color: '#4ade80' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}
              iconType="line"
            />

            {/* Reference Lines */}
            {startWeight && (
              <ReferenceLine
                y={startWeight}
                stroke="#6b7280"
                strokeDasharray="5 5"
                label={{
                  value: `Start: ${startWeight}kg`,
                  position: 'right',
                  fill: '#9ca3af',
                  fontSize: 12,
                }}
              />
            )}
            {targetWeight && (
              <ReferenceLine
                y={targetWeight}
                stroke="#f97316"
                strokeDasharray="5 5"
                label={{
                  value: `Target: ${targetWeight}kg`,
                  position: 'right',
                  fill: '#f97316',
                  fontSize: 12,
                }}
              />
            )}

            {/* Main Weight Line */}
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#4ade80"
              strokeWidth={3}
              dot={{ fill: '#4ade80', r: 5 }}
              activeDot={{ r: 7, fill: '#22c55e' }}
              name="Weight"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Progress to Target */}
      {targetWeight && stats && (
        <div className="mt-4 p-4 bg-arena-floor border border-fighter-bag/30 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-arena-chalk text-sm">Progress to Target</span>
            <span className="text-white font-bold">
              {startWeight && targetWeight
                ? Math.round(
                    ((startWeight - stats.currentWeight) / (startWeight - targetWeight)) * 100
                  )
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-arena-cage rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-fighter-home to-green-600 h-full transition-all duration-500"
              style={{
                width: `${
                  startWeight && targetWeight
                    ? Math.min(
                        100,
                        ((startWeight - stats.currentWeight) / (startWeight - targetWeight)) * 100
                      )
                    : 0
                }%`,
              }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-xs">
            <span className="text-arena-chalk">
              {startWeight ? `${startWeight} kg` : 'Start'}
            </span>
            <span className="text-fighter-bag font-bold">
              {targetWeight && stats.currentWeight > targetWeight
                ? `${(stats.currentWeight - targetWeight).toFixed(1)} kg to go`
                : targetWeight && stats.currentWeight <= targetWeight
                ? '🎉 Target Reached!'
                : ''}
            </span>
            <span className="text-arena-chalk">
              {targetWeight ? `${targetWeight} kg` : 'Target'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
