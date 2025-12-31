import type { ProgramStats } from '../types/workout';

interface ProgramStatsProps {
  stats: ProgramStats;
}

export default function ProgramStatsCard({ stats }: ProgramStatsProps) {
  const statItems = [
    { label: 'Current Stats', value: `${stats.currentWeight} / ${stats.currentHeight}`, icon: '📊' },
    { label: 'Target Weight', value: stats.targetWeight, icon: '🎯' },
    { label: 'Target Body Fat', value: stats.targetBodyFat, icon: '💧' },
    { label: 'Timeline', value: stats.timeline, icon: '⏱️' },
    { label: 'Training Days', value: stats.trainingDays, icon: '📅' }
  ];

  return (
    <div className="fighter-card border-fighter-ring mb-8 shadow-brutal">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-fighter-ring flex items-center gap-2">
          <span>👑</span>
          Program Overview
        </h2>
        <div className="px-3 py-1 bg-fighter-ring/20 border border-fighter-ring rounded-full">
          <span className="text-fighter-ring text-xs font-bold uppercase">Imai Cosmo</span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {statItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-arena-floor rounded-lg border border-arena-cage hover:border-fighter-ring transition-colors group"
          >
            <span className="text-arena-chalk text-sm flex items-center gap-2 group-hover:text-arena-tape transition-colors">
              <span className="text-base">{item.icon}</span>
              {item.label}
            </span>
            <span className="text-white font-bold text-sm">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Motivational banner */}
      <div className="mt-4 p-3 bg-gradient-to-r from-fighter-ring/20 to-transparent border-l-4 border-fighter-ring rounded">
        <p className="text-xs text-arena-tape italic">
          "The King of Stranglers doesn't rely on brute strength alone - technique, conditioning, and discipline are everything."
        </p>
      </div>
    </div>
  );
}
