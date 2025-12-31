import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { calculatePersonalRecords, formatPRDate } from '../utils/personalRecords';
import type { WorkoutSession } from '../types/workout';

interface PersonalRecordsProps {
  sessions: WorkoutSession[];
}

type SortBy = 'name' | 'weight' | 'date';

export default function PersonalRecords({ sessions }: PersonalRecordsProps) {
  const [sortBy, setSortBy] = useState<SortBy>('weight');
  const [filterText, setFilterText] = useState('');

  const records = useMemo(() => {
    const recordsMap = calculatePersonalRecords(sessions);
    return Array.from(recordsMap.values());
  }, [sessions]);

  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;

    // Filter by exercise name
    if (filterText) {
      filtered = records.filter((r) =>
        r.exerciseName.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.exerciseName.localeCompare(b.exerciseName);
        case 'weight':
          return b.maxWeight - a.maxWeight;
        case 'date':
          return new Date(b.lastPerformed).getTime() - new Date(a.lastPerformed).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [records, sortBy, filterText]);

  if (records.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-white mb-2">No Records Yet</h3>
        <p className="text-arena-chalk">
          Complete some workouts to start tracking your personal records!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-4 bg-arena-darker rounded-lg border border-fighter-ring text-center">
          <div className="text-arena-chalk text-xs mb-1">Total PRs</div>
          <div className="text-fighter-ring font-bold text-2xl">{records.length}</div>
        </div>
        <div className="p-4 bg-arena-darker rounded-lg border border-fighter-home text-center">
          <div className="text-arena-chalk text-xs mb-1">Total Sets</div>
          <div className="text-fighter-home font-bold text-2xl">
            {records.reduce((sum, r) => sum + r.totalSets, 0)}
          </div>
        </div>
        <div className="p-4 bg-arena-darker rounded-lg border border-fighter-gym text-center">
          <div className="text-arena-chalk text-xs mb-1">Exercises</div>
          <div className="text-fighter-gym font-bold text-2xl">{records.length}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search exercises..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="flex-1 px-4 py-2 bg-arena-darker border border-arena-cage rounded-lg text-white placeholder:text-arena-chalk focus:outline-none focus:ring-2 focus:ring-fighter-ring"
        />

        {/* Sort */}
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'weight' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('weight')}
            className={sortBy === 'weight' ? 'bg-fighter-ring text-white' : 'text-arena-chalk'}
          >
            💪 Weight
          </Button>
          <Button
            variant={sortBy === 'name' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('name')}
            className={sortBy === 'name' ? 'bg-fighter-ring text-white' : 'text-arena-chalk'}
          >
            🔤 Name
          </Button>
          <Button
            variant={sortBy === 'date' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSortBy('date')}
            className={sortBy === 'date' ? 'bg-fighter-ring text-white' : 'text-arena-chalk'}
          >
            📅 Recent
          </Button>
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-3">
        {filteredAndSortedRecords.map((record) => (
          <div
            key={record.exerciseName}
            className="bg-arena-darker border-2 border-arena-cage rounded-lg p-4 hover:border-fighter-ring/50 transition-colors"
          >
            {/* Exercise Name */}
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-bold text-white">{record.exerciseName}</h4>
              <div className="text-xs text-arena-chalk">
                {record.totalSessions} sessions • {record.totalSets} sets
              </div>
            </div>

            {/* PR Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Max Weight PR */}
              <div className="p-3 bg-gradient-to-br from-fighter-ring/10 to-arena-floor border border-fighter-ring/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🏋️</span>
                  <span className="text-arena-chalk text-xs font-bold uppercase">Max Weight</span>
                </div>
                <div className="text-fighter-ring font-bold text-2xl mb-1">
                  {record.maxWeight} kg
                </div>
                <div className="text-white text-sm mb-1">
                  {record.maxWeightReps} reps
                </div>
                <div className="text-arena-chalk text-xs">
                  {formatPRDate(record.maxWeightDate)}
                </div>
              </div>

              {/* Max Reps PR */}
              <div className="p-3 bg-gradient-to-br from-fighter-home/10 to-arena-floor border border-fighter-home/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🔥</span>
                  <span className="text-arena-chalk text-xs font-bold uppercase">Max Reps</span>
                </div>
                <div className="text-fighter-home font-bold text-2xl mb-1">
                  {record.maxReps} reps
                </div>
                <div className="text-white text-sm mb-1">
                  @ {record.maxRepsWeight} kg
                </div>
                <div className="text-arena-chalk text-xs">
                  {formatPRDate(record.maxRepsDate)}
                </div>
              </div>
            </div>

            {/* Last Performed */}
            <div className="mt-3 pt-3 border-t border-arena-cage">
              <div className="flex justify-between items-center text-xs">
                <span className="text-arena-chalk">Last performed</span>
                <span className="text-white">{formatPRDate(record.lastPerformed)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedRecords.length === 0 && filterText && (
        <div className="p-8 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-arena-chalk">No exercises found matching "{filterText}"</p>
        </div>
      )}
    </div>
  );
}
