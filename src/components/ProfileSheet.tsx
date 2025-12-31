import { useState } from 'react';
import { Button } from './ui/button';
import WeightProgressChart from './WeightProgressChart';
import PersonalRecords from './PersonalRecords';
import type { UserProfile } from '../types/user';
import type { WorkoutSession } from '../types/workout';

interface ProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onAddWeighIn: (weighIn: { date: string; weight: number; waist?: number; notes?: string }) => void;
  weightProgress: {
    startWeight: number;
    currentWeight: number;
    targetWeight: number;
    lostSoFar: number;
    remaining: number;
    percentComplete: number;
  };
  sessions: WorkoutSession[];
}

export default function ProfileSheet({
  open,
  onOpenChange,
  profile,
  onUpdateProfile,
  onAddWeighIn,
  weightProgress,
  sessions
}: ProfileSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showWeighInForm, setShowWeighInForm] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [weighInData, setWeighInData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: profile.currentWeight,
    waist: undefined as number | undefined,
    notes: ''
  });

  if (!open) return null;

  const handleSaveProfile = () => {
    onUpdateProfile(editedProfile);
    setIsEditing(false);
  };

  const handleAddWeighIn = () => {
    onAddWeighIn(weighInData);
    setWeighInData({
      date: new Date().toISOString().split('T')[0],
      weight: profile.currentWeight,
      waist: undefined,
      notes: ''
    });
    setShowWeighInForm(false);
  };

  const getBMI = () => {
    const bmi = profile.currentWeight / (profile.height * profile.height);
    return bmi.toFixed(1);
  };

  const getDaysInProgram = () => {
    const start = new Date(profile.startDate);
    const now = new Date();
    const days = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="fixed inset-0 z-50 bg-arena-dark">
      {/* Header */}
      <div className="sticky top-0 bg-arena-darker/95 backdrop-blur-sm border-b-2 border-arena-cage p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-white"
            >
              ←
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-white">Profile</h2>
              <p className="text-arena-chalk text-sm">Track your progress</p>
            </div>
          </div>
          {!isEditing && (
            <Button
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="text-fighter-ring"
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto p-6 space-y-6" style={{ maxHeight: 'calc(100vh - 80px)' }}>
        {/* Personal Info Card */}
        <div className="bg-gradient-to-br from-arena-darker to-arena-floor border-2 border-fighter-ring/30 rounded-2xl p-6 shadow-brutal">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>👤</span>
            Personal Info
          </h3>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-arena-chalk text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-ring"
                />
              </div>
              <div>
                <label className="block text-arena-chalk text-sm mb-2">Height (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editedProfile.height}
                  onChange={(e) => setEditedProfile({ ...editedProfile, height: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-ring"
                />
              </div>
              <div>
                <label className="block text-arena-chalk text-sm mb-2">Age (optional)</label>
                <input
                  type="number"
                  value={editedProfile.age || ''}
                  onChange={(e) => setEditedProfile({ ...editedProfile, age: parseInt(e.target.value) || undefined })}
                  placeholder="Your age"
                  className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-ring"
                />
              </div>
              <div>
                <label className="block text-arena-chalk text-sm mb-2">Target Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={editedProfile.targetWeight}
                  onChange={(e) => setEditedProfile({ ...editedProfile, targetWeight: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-arena-floor border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-ring"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setEditedProfile(profile);
                    setIsEditing(false);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-gradient-to-r from-fighter-ring to-purple-600 text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-arena-chalk">Name</span>
                <span className="text-white font-bold">{profile.name || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-arena-chalk">Height</span>
                <span className="text-white font-bold">{profile.height}m</span>
              </div>
              {profile.age && (
                <div className="flex justify-between items-center">
                  <span className="text-arena-chalk">Age</span>
                  <span className="text-white font-bold">{profile.age} years</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-arena-chalk">BMI</span>
                <span className="text-white font-bold">{getBMI()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-arena-chalk">Days in Program</span>
                <span className="text-white font-bold">{getDaysInProgram()} days</span>
              </div>
            </div>
          )}
        </div>

        {/* Weight Progress Card */}
        <div className="bg-gradient-to-br from-arena-darker to-arena-floor border-2 border-fighter-home/30 rounded-2xl p-6 shadow-brutal">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>⚖️</span>
              Weight Progress
            </h3>
            <Button
              onClick={() => setShowWeighInForm(!showWeighInForm)}
              size="sm"
              className="bg-fighter-home text-white"
            >
              {showWeighInForm ? 'Cancel' : '+ Log Weight'}
            </Button>
          </div>

          {showWeighInForm ? (
            <div className="space-y-4 mb-4 p-4 bg-arena-floor rounded-lg">
              <div>
                <label className="block text-arena-chalk text-sm mb-2">Date</label>
                <input
                  type="date"
                  value={weighInData.date}
                  onChange={(e) => setWeighInData({ ...weighInData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-arena-darker border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-home"
                />
              </div>
              <div>
                <label className="block text-arena-chalk text-sm mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weighInData.weight || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow typing decimals by not parsing immediately
                    setWeighInData({ 
                      ...weighInData, 
                      weight: value === '' ? 0 : Number(value)
                    });
                  }}
                  className="w-full px-4 py-2 bg-arena-darker border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-home"
                />
              </div>
              <div>
                <label className="block text-arena-chalk text-sm mb-2">Waist (cm) - Optional</label>
                <input
                  type="number"
                  step="0.5"
                  value={weighInData.waist || ''}
                  onChange={(e) => setWeighInData({ ...weighInData, waist: parseFloat(e.target.value) || undefined })}
                  placeholder="Optional"
                  className="w-full px-4 py-2 bg-arena-darker border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-home"
                />
              </div>
              <div>
                <label className="block text-arena-chalk text-sm mb-2">Notes</label>
                <textarea
                  value={weighInData.notes}
                  onChange={(e) => setWeighInData({ ...weighInData, notes: e.target.value })}
                  placeholder="How are you feeling?"
                  className="w-full px-4 py-2 bg-arena-darker border border-arena-cage rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fighter-home resize-none"
                  rows={2}
                />
              </div>
              <Button
                onClick={handleAddWeighIn}
                className="w-full bg-gradient-to-r from-fighter-home to-green-600 text-white"
              >
                Save Weigh-In
              </Button>
            </div>
          ) : null}

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-arena-chalk text-xs mb-1">Start</div>
                <div className="text-white font-bold text-lg">{weightProgress.startWeight.toFixed(1)}kg</div>
              </div>
              <div>
                <div className="text-arena-chalk text-xs mb-1">Current</div>
                <div className="text-fighter-home font-bold text-2xl">{weightProgress.currentWeight.toFixed(1)}kg</div>
              </div>
              <div>
                <div className="text-arena-chalk text-xs mb-1">Target</div>
                <div className="text-white font-bold text-lg">{weightProgress.targetWeight.toFixed(1)}kg</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-arena-chalk">Progress</span>
                <span className="text-fighter-home font-bold">{weightProgress.percentComplete.toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-arena-cage rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-fighter-home to-green-600 transition-all duration-500"
                  style={{ width: `${weightProgress.percentComplete}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-arena-floor rounded-lg">
                <div className="text-arena-chalk text-xs mb-1">Lost</div>
                <div className="text-fighter-home font-bold">{weightProgress.lostSoFar.toFixed(1)}kg</div>
              </div>
              <div className="p-3 bg-arena-floor rounded-lg">
                <div className="text-arena-chalk text-xs mb-1">Remaining</div>
                <div className="text-white font-bold">{weightProgress.remaining.toFixed(1)}kg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weight Progress Chart */}
        {profile.weeklyWeighIns.length > 0 && (
          <div className="bg-gradient-to-br from-arena-darker to-arena-floor border-2 border-fighter-home/30 rounded-2xl p-6 shadow-brutal">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📈</span>
              Progress Chart
            </h3>
            <WeightProgressChart
              weighIns={profile.weeklyWeighIns.map(w => ({
                date: w.date,
                weight: w.weight,
                notes: w.notes
              }))}
              startWeight={profile.startWeight}
              targetWeight={profile.targetWeight}
            />
          </div>
        )}

        {/* Recent Weigh-Ins */}
        {profile.weeklyWeighIns.length > 0 && (
          <div className="bg-gradient-to-br from-arena-darker to-arena-floor border-2 border-arena-cage rounded-2xl p-6 shadow-brutal">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📊</span>
              Recent Weigh-Ins
            </h3>
            <div className="space-y-3">
              {profile.weeklyWeighIns.slice(-5).reverse().map((weighIn) => (
                <div key={weighIn.id} className="p-3 bg-arena-floor rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-bold">{weighIn.weight.toFixed(1)}kg</div>
                      <div className="text-arena-chalk text-xs">
                        {new Date(weighIn.date).toLocaleDateString()}
                      </div>
                    </div>
                    {weighIn.waist && (
                      <div className="text-arena-chalk text-sm">
                        Waist: {weighIn.waist}cm
                      </div>
                    )}
                  </div>
                  {weighIn.notes && (
                    <p className="text-arena-chalk text-xs mt-2 italic">{weighIn.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal Records */}
        {sessions.length > 0 && (
          <div className="bg-gradient-to-br from-arena-darker to-arena-floor border-2 border-fighter-ring/30 rounded-2xl p-6 shadow-brutal">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🏆</span>
              Personal Records
            </h3>
            <PersonalRecords sessions={sessions} />
          </div>
        )}
      </div>
    </div>
  );
}
