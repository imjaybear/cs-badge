import React, { useState, useCallback } from 'react';
import { Medal, AlertCircle, Clock, Calendar } from 'lucide-react';

interface BadgeProgress {
  level: number;
  weeksLeft: number;
  xpRequired: number;
  weeklyXPNeeded: number;
  achievableThisYear: boolean;
}

const MEDAL_IMAGES = {
  1: "/medals/level1.png",
  2: "/medals/level2.png",
  3: "/medals/level3.png",
  4: "/medals/level4.png"
};

function App() {
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [currentMedal, setCurrentMedal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BadgeProgress[] | null>(null);

  const XP_PER_MEDAL = 195000;

  const getWeeksLeftInYear = () => {
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31); // December 31st
    const diffTime = endOfYear.getTime() - now.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  const calculateProgress = useCallback((level: number, medal: number) => {
    if (level < 1 || level > 39 || isNaN(level)) {
      setError('Level must be between 1 and 39');
      setResults(null);
      return;
    }

    if (medal < 0 || medal > 3 || isNaN(medal)) {
      setError('Current medal must be between 0 and 3');
      setResults(null);
      return;
    }

    setError(null);
    const currentXP = medal > 0 ? XP_PER_MEDAL * medal + ((level - 1) * 5000) : (level - 1) * 5000;
    const weeksLeft = getWeeksLeftInYear();
    
    const remainingMedals = Array.from({ length: 4 - medal }, (_, i) => i + medal + 1);
    
    const results = remainingMedals.map((medalLevel) => {
      const xpForThisMedal = XP_PER_MEDAL * medalLevel - currentXP;
      const weeklyXPNeeded = Math.ceil(xpForThisMedal / weeksLeft);
      const achievableThisYear = weeklyXPNeeded <= 20000;
      
      return {
        level: medalLevel,
        weeksLeft,
        xpRequired: xpForThisMedal,
        weeklyXPNeeded,
        achievableThisYear
      };
    });

    setResults(results);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateProgress(currentLevel, currentMedal);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-4 font-mono selection:bg-blue-500/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={MEDAL_IMAGES[1]} 
              alt="CS:GO Service Medal"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-gray-200 via-blue-200 to-gray-200 bg-clip-text text-transparent">
              CS:GO Service Medal Calculator
            </span>
          </h1>
          <p className="text-gray-400 text-sm">Calculate required XP per week to achieve medals this year</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-12">
          <div className="bg-[#232323] p-8 rounded-2xl border border-white/5 shadow-xl backdrop-blur-sm">
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Current Level (1-39)
                </label>
                <input
                  type="number"
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#2A2A2A] rounded-lg px-4 py-2.5 text-white border border-white/5 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 outline-none transition-all"
                  min="1"
                  max="39"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Current Service Medal (0-3)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    value={currentMedal}
                    onChange={(e) => setCurrentMedal(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer accent-blue-500"
                    min="0"
                    max="3"
                    step="1"
                  />
                  <div className="w-16 h-16 bg-[#2A2A2A] rounded-xl p-2 flex items-center justify-center border border-white/5">
                    {currentMedal === 0 ? (
                      <Medal className="w-8 h-8 text-gray-600" />
                    ) : (
                      <img 
                        src={MEDAL_IMAGES[currentMedal as keyof typeof MEDAL_IMAGES]} 
                        alt={`Level ${currentMedal} Medal`}
                        className="w-12 h-12 object-contain"
                      />
                    )}
                  </div>
                </div>
                <div className="text-center mt-2 text-sm text-gray-500">
                  {currentMedal === 0 ? "No medal yet" : `Current: Level ${currentMedal} Medal`}
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg font-medium transition-colors text-sm text-blue-200"
              >
                Calculate
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </form>

        {results && (
          <div className="grid md:grid-cols-2 gap-6">
            {results.map((badge) => (
              <div 
                key={badge.level} 
                className={`bg-[#232323] p-6 rounded-2xl border shadow-xl transition-colors backdrop-blur-sm ${
                  badge.achievableThisYear 
                    ? 'border-blue-500/20 hover:border-blue-500/30' 
                    : 'border-red-500/20 hover:border-red-500/30'
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-[#2A2A2A] rounded-xl p-2 flex items-center justify-center border border-white/5">
                    <img 
                      src={MEDAL_IMAGES[badge.level as keyof typeof MEDAL_IMAGES]} 
                      alt={`Level ${badge.level} Medal`}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                      Level {badge.level} Medal
                    </h2>
                    <span className={`text-sm ${badge.achievableThisYear ? 'text-blue-400' : 'text-red-400'}`}>
                      {badge.achievableThisYear ? 'Achievable this year' : 'May not be achievable this year'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-[#2A2A2A] rounded-xl border border-white/5">
                    <div className="text-sm text-gray-500 mb-1">Total XP Required</div>
                    <div className="text-2xl font-bold text-gray-200">{badge.xpRequired.toLocaleString()} XP</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#2A2A2A] rounded-xl border border-white/5 flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Weeks Left</div>
                        <div className="text-xl font-bold text-gray-200">{badge.weeksLeft}</div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#2A2A2A] rounded-xl border border-white/5 flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30">
                        <Clock className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">XP Per Week</div>
                        <div className="text-xl font-bold text-gray-200">{badge.weeklyXPNeeded.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;