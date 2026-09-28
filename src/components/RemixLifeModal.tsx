import React, { useState } from 'react';
import {
  X,
  Shuffle,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  LifeExperience,
  DurationType,
  MoodType,
  DifficultyType,
  TimelineActivity,
  UserProfile,
} from '../types';

interface RemixLifeModalProps {
  originalLife: LifeExperience;
  onClose: () => void;
  onPublishRemix: (remixedLife: LifeExperience) => void;
  userProfile: UserProfile;
}

export const RemixLifeModal: React.FC<RemixLifeModalProps> = ({
  originalLife,
  onClose,
  onPublishRemix,
  userProfile,
}) => {
  const [title, setTitle] = useState(`${originalLife.title} (Remix)`);
  const [tagline, setTagline] = useState(
    `Adapted from @${originalLife.creator.name}'s protocol with personalized rituals.`
  );
  const [mood, setMood] = useState<MoodType>(originalLife.mood);
  const [duration, setDuration] = useState<DurationType>(originalLife.duration);
  const [difficulty, setDifficulty] = useState<DifficultyType>(originalLife.difficulty);
  const [timeline, setTimeline] = useState<TimelineActivity[]>([
    ...originalLife.timeline,
  ]);

  const handleUpdateActivity = (index: number, field: keyof TimelineActivity, val: any) => {
    const updated = [...timeline];
    updated[index] = { ...updated[index], [field]: val };
    setTimeline(updated);
  };

  const handlePublish = () => {
    const remixed: LifeExperience = {
      id: `remix-${Date.now()}`,
      title,
      tagline,
      description: `A community remix of ${originalLife.title}, originally crafted by ${originalLife.creator.name}. Tailored with altered pacing and new challenges.`,
      creator: {
        name: userProfile.name,
        handle: userProfile.handle,
        avatar: userProfile.avatar,
        bio: userProfile.bio,
        verified: false,
        livesCreatedCount: userProfile.customCreatedLives.length + 1,
      },
      duration,
      mood,
      difficulty,
      category: originalLife.category,
      price: 0, // Community remixes free by default
      experiencedCount: 1,
      rating: 5.0,
      coverImage: originalLife.coverImage,
      timeline,
      lifeTwists: originalLife.lifeTwists,
      reflectionQuestions: originalLife.reflectionQuestions,
      whatPeopleStole: [],
      remixFrom: {
        originalId: originalLife.id,
        originalTitle: originalLife.title,
        originalCreator: originalLife.creator.name,
      },
      createdAt: new Date().toISOString().split('T')[0],
    };

    onPublishRemix(remixed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-[#0e101d] border border-white/12 shadow-2xl p-6 sm:p-8 my-auto relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/8 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-indigo-400" />
              <span className="font-display font-bold text-lg text-white">
                Remix This Life
              </span>
            </div>
            <p className="text-xs text-indigo-300 mt-0.5 font-mono">
              Credit given to original creator: @{originalLife.creator.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5 pr-1">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Remix Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Remix Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Timeline Activity Adjustments */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Customize Activities ({timeline.length})
            </label>
            <div className="space-y-3">
              {timeline.map((act, idx) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/8 space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={act.time}
                      onChange={(e) => handleUpdateActivity(idx, 'time', e.target.value)}
                      className="w-20 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-indigo-300 font-mono text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={act.title}
                      onChange={(e) => handleUpdateActivity(idx, 'title', e.target.value)}
                      className="flex-1 px-3 py-1 rounded bg-white/5 border border-white/10 text-white text-xs font-semibold"
                    />
                  </div>
                  <input
                    type="text"
                    value={act.challenge}
                    onChange={(e) => handleUpdateActivity(idx, 'challenge', e.target.value)}
                    placeholder="Custom challenge for this moment..."
                    className="w-full px-3 py-1.5 rounded-lg bg-amber-500/[0.04] border border-amber-500/20 text-slate-200 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/8 flex items-center justify-between gap-4 shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            Original: {originalLife.title}
          </span>

          <button
            onClick={handlePublish}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wide transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Publish Remix</span>
          </button>
        </div>
      </div>
    </div>
  );
};
