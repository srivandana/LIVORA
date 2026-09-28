import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Sparkles,
  Clock,
  Compass,
  Zap,
  Flame,
  CheckCircle,
  X,
  Share2
} from 'lucide-react';
import { PassportStamp, UserProfile } from '../types';

interface LifePassportProps {
  userProfile: UserProfile;
  onExploreMore: () => void;
  onSelectLife: (lifeId: string) => void;
}

interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const LifePassport: React.FC<LifePassportProps> = ({
  userProfile,
  onExploreMore,
  onSelectLife,
}) => {
  const [selectedStamp, setSelectedStamp] = useState<PassportStamp | null>(null);

  const stamps = userProfile.completedStamps;
  const totalLives = stamps.length;
  const totalHours = stamps.reduce((acc, s) => acc + s.hoursSpent, 0);
  const totalTwists = stamps.reduce((acc, s) => acc + s.twistsSurvived, 0);

  // Derive favorite mood
  const moodCounts: Record<string, number> = {};
  stamps.forEach((s) => {
    moodCounts[s.mood] = (moodCounts[s.mood] || 0) + 1;
  });
  let favoriteMood = 'None yet';
  let maxCount = 0;
  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > maxCount) {
      maxCount = count;
      favoriteMood = mood;
    }
  });

  const uniqueCategories = new Set(stamps.map((s) => s.category)).size;

  // Badges
  const badges: AchievementBadge[] = [
    {
      id: 'first-life',
      name: 'FIRST LIFE',
      description: 'Completed your maiden lifestyle borrowing experience.',
      icon: '🌱',
      unlocked: totalLives >= 1,
    },
    {
      id: 'ten-lives',
      name: '10 LIVES',
      description: 'Lived 10 distinctly separate human routines.',
      icon: '👑',
      unlocked: totalLives >= 10,
    },
    {
      id: 'chaos-seeker',
      name: 'CHAOS SEEKER',
      description: 'Survived high-difficulty twists with spontaneous grit.',
      icon: '⚡',
      unlocked: totalTwists >= 3,
    },
    {
      id: 'early-riser',
      name: 'EARLY RISER',
      description: 'Mastered dawn protocols before the world awoke.',
      icon: '🌅',
      unlocked: stamps.some((s) => s.title.includes('5 AM') || s.title.includes('Morning')),
    },
    {
      id: 'creative-soul',
      name: 'CREATIVE SOUL',
      description: 'Spent deep unbroken hours painting, writing, or shooting.',
      icon: '🎨',
      unlocked: stamps.some((s) => s.category === 'Creative Life'),
    },
    {
      id: 'comfort-breaker',
      name: 'COMFORT ZONE BREAKER',
      description: 'Pushed past social or physical friction with courage.',
      icon: '🛡️',
      unlocked: stamps.some((s) => s.perspectiveRating === 'Completely'),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28">
      
      {/* Passport Cover Header */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-300 mb-3">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>OFFICIAL CITIZENSHIP DOSSIER</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Digital Life Passport
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl">
            Every completed experience stamps your permanent ledger. These are the routines, minds, and habits you have borrowed.
          </p>
        </div>

        {/* Passport Serial Badge */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 text-right font-mono tabular-nums text-xs">
          <span className="text-slate-500 block uppercase text-[10px]">PASSPORT HOLDER</span>
          <span className="text-white font-bold text-sm">{userProfile.name}</span>
          <span className="text-indigo-400 block text-[11px] mt-0.5">ID: BAL-2026-X98</span>
        </div>
      </div>

      {/* Signature Passport Statistics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
            Lives Experienced
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
            {totalLives}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
            Hours Borrowed
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-indigo-300 tabular-nums">
            {totalHours}h
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
            Cultures / Genres
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-sky-300 tabular-nums">
            {uniqueCategories}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 text-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
            Twists Survived
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-300 tabular-nums">
            {totalTwists}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1">
            Favorite Mood
          </span>
          <span className="font-display text-lg sm:text-xl font-bold text-emerald-300 truncate block mt-1">
            {favoriteMood}
          </span>
        </div>
      </div>

      {/* ACHIEVEMENT BADGES CAROUSEL / GRID */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Achievement Badges</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3.5 rounded-2xl border transition-all text-center ${
                badge.unlocked
                  ? 'bg-indigo-950/20 border-indigo-500/30'
                  : 'bg-white/[0.01] border-white/5 opacity-40'
              }`}
            >
              <div className="text-2xl mb-1.5">{badge.icon}</div>
              <h3 className="font-display text-xs font-bold text-white tracking-wide truncate">
                {badge.name}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                {badge.description}
              </p>
              <span className="block mt-2 text-[9px] font-mono uppercase tracking-wider">
                {badge.unlocked ? (
                  <span className="text-emerald-400 font-semibold">Unlocked</span>
                ) : (
                  <span className="text-slate-600">Locked</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* THE PASSPORT STAMPS GRID */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">
              Verified Passport Stamps
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any stamp to review the habit you stole and your perspective shift.
            </p>
          </div>

          <button
            onClick={onExploreMore}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          >
            Borrow Another Life
          </button>
        </div>

        {stamps.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/[0.01] border border-white/6">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-300 font-medium">Your Passport has no stamps yet.</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Start your first experience in the Discover catalog to earn your opening stamp.
            </p>
            <button
              onClick={onExploreMore}
              className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Browse Discovery
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stamps.map((stamp) => (
              <div
                key={stamp.id}
                onClick={() => setSelectedStamp(stamp)}
                className="group cursor-pointer p-6 rounded-3xl bg-[#0f111d] hover:bg-[#141624] border border-white/10 hover:border-indigo-500/40 transition-all duration-300 relative overflow-hidden shadow-xl hover:-translate-y-1"
              >
                {/* Circular physical ink stamp simulation */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-full border-2 border-dashed flex flex-col items-center justify-center text-center p-1 shrink-0 rotate-[-8deg] group-hover:rotate-0 transition-transform duration-300"
                    style={{ borderColor: stamp.stampColor, color: stamp.stampColor }}
                  >
                    <span className="text-[8px] font-mono tracking-widest font-extrabold uppercase">
                      BORROWED
                    </span>
                    <span className="text-[10px] font-bold uppercase leading-none truncate max-w-[50px]">
                      {stamp.category.split(' ')[0]}
                    </span>
                    <span className="text-[8px] font-mono tabular-nums opacity-80 mt-0.5">
                      {stamp.completedAt}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">
                      PERSPECTIVE SHIFT
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {stamp.perspectiveRating}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                    {stamp.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Original routine by {stamp.creatorName}
                  </p>
                </div>

                {/* Stolen takeaway quote */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/6 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 block mb-1">
                    Stolen Habit
                  </span>
                  <p className="text-xs text-slate-300 italic line-clamp-2">
                    "{stamp.stolenHabit}"
                  </p>
                </div>

                {/* Bottom stats row */}
                <div className="pt-3 border-t border-white/6 flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-400">
                  <span>{stamp.hoursSpent} Hours</span>
                  <span aria-hidden="true" className="text-white/20">·</span>
                  <span>{stamp.mood}</span>
                  <span aria-hidden="true" className="text-white/20">·</span>
                  <span className="text-indigo-300">
                    +{stamp.postScore - stamp.preScore} Mood
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stamp Inspection Detail Modal */}
      {selectedStamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-[#0e101d] border border-white/12 shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setSelectedStamp(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div
                className="w-20 h-20 rounded-full border-2 border-dashed flex flex-col items-center justify-center mx-auto mb-3"
                style={{ borderColor: selectedStamp.stampColor, color: selectedStamp.stampColor }}
              >
                <span className="text-[10px] font-mono tracking-widest font-extrabold">
                  VERIFIED STAMP
                </span>
                <span className="text-xs font-bold uppercase">
                  {selectedStamp.category.split(' ')[0]}
                </span>
                <span className="text-[9px] font-mono tabular-nums opacity-80">
                  {selectedStamp.completedAt}
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                {selectedStamp.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Routine designed by {selectedStamp.creatorName}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 block mb-1">
                  What You Stole Permanently
                </span>
                <p className="text-sm text-slate-200 italic leading-relaxed">
                  "{selectedStamp.stolenHabit}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-black/40 border border-white/6">
                  <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                    PERSPECTIVE SHIFT
                  </span>
                  <span className="text-sm font-bold text-emerald-400">
                    {selectedStamp.perspectiveRating}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/6">
                  <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                    MOOD EVOLUTION
                  </span>
                  <span className="text-sm font-bold text-indigo-300 font-mono">
                    {selectedStamp.preScore} → {selectedStamp.postScore} (+
                    {selectedStamp.postScore - selectedStamp.preScore})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onSelectLife(selectedStamp.experienceId);
                  setSelectedStamp(null);
                }}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide transition-colors text-center"
              >
                View Experience Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
