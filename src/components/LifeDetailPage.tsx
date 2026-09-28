import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Zap,
  Users,
  Bookmark,
  Share2,
  Play,
  Shuffle,
  Quote,
  Sparkles,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { LifeExperience } from '../types';

interface LifeDetailPageProps {
  life: LifeExperience;
  onBack: () => void;
  onStartExperience: (life: LifeExperience) => void;
  onRemixLife: (life: LifeExperience) => void;
  onShare: (life: LifeExperience) => void;
  isSaved: boolean;
  onToggleSave: (lifeId: string) => void;
  isCreatorFollowed: boolean;
  onToggleFollowCreator: (handle: string) => void;
}

export const LifeDetailPage: React.FC<LifeDetailPageProps> = ({
  life,
  onBack,
  onStartExperience,
  onRemixLife,
  onShare,
  isSaved,
  onToggleSave,
  isCreatorFollowed,
  onToggleFollowCreator,
}) => {
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(
    life.timeline[0]?.id || null
  );

  const toggleActivity = (id: string) => {
    setExpandedActivityId(expandedActivityId === id ? null : id);
  };

  return (
    <div className="pb-24">
      {/* Back button and Top Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lives</span>
        </button>
      </div>

      {/* Cinematic Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-slate-900 border border-white/10 shadow-2xl">
          <img
            src={life.coverImage}
            alt={life.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-black/40 to-black/30" />

          {/* Top Actions on Hero */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => onToggleSave(life.id)}
              className={`p-2.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                isSaved
                  ? 'bg-indigo-600/80 border-indigo-400 text-white'
                  : 'bg-black/50 border-white/10 text-slate-300 hover:text-white'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save experience'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={() => onShare(life)}
              className="p-2.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Share experience"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Hero Bottom Info */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-300 font-mono mb-2">
              <span>{life.category}</span>
              {life.remixFrom && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-300">Remixed from @{life.remixFrom.originalCreator}</span>
                </>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
              {life.title}
            </h1>

            <p className="mt-2 text-slate-200 text-sm sm:text-base max-w-2xl font-light">
              {life.tagline}
            </p>
          </div>
        </div>

        {/* Quick Meta Bar adhering to Zero-Pill Discipline */}
        <div className="mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono tabular-nums text-slate-300">
            <div>
              <span className="text-slate-500 uppercase text-[10px] block">Duration</span>
              <span className="font-semibold text-white">{life.duration}</span>
            </div>
            <span aria-hidden="true" className="text-white/10">|</span>
            <div>
              <span className="text-slate-500 uppercase text-[10px] block">Mood</span>
              <span className="font-semibold text-white">{life.mood}</span>
            </div>
            <span aria-hidden="true" className="text-white/10">|</span>
            <div>
              <span className="text-slate-500 uppercase text-[10px] block">Difficulty</span>
              <span className={`font-semibold ${life.difficulty === 'Extreme' ? 'text-rose-400' : life.difficulty === 'Hard' ? 'text-amber-400' : 'text-slate-200'}`}>
                {life.difficulty}
              </span>
            </div>
            <span aria-hidden="true" className="text-white/10">|</span>
            <div>
              <span className="text-slate-500 uppercase text-[10px] block">Experienced</span>
              <span className="font-semibold text-white">{life.experiencedCount} people</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onRemixLife(life)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Remix Life</span>
            </button>

            <button
              onClick={() => onStartExperience(life)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold tracking-wide transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {life.price === 0 ? 'START EXPERIENCE (FREE)' : `START EXPERIENCE (₹${life.price})`}
              </span>
            </button>
          </div>
        </div>

        {/* Creator Bar */}
        <div className="mt-8 p-5 rounded-2xl bg-white/[0.02] border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={life.creator.avatar}
              alt={life.creator.name}
              className="w-12 h-12 rounded-full object-cover border border-white/15"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-white text-base">
                  {life.creator.name}
                </span>
                {life.creator.verified && (
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                )}
              </div>
              <p className="text-xs text-slate-400">{life.creator.bio}</p>
            </div>
          </div>

          <button
            onClick={() => onToggleFollowCreator(life.creator.handle)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              isCreatorFollowed
                ? 'bg-white/10 text-slate-300 border border-white/15'
                : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30'
            }`}
          >
            {isCreatorFollowed ? 'Following Creator' : `Follow ${life.creator.handle}`}
          </button>
        </div>

        {/* The Philosophy / Description */}
        <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
            THE PHILOSOPHY
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            {life.description}
          </p>
        </div>

        {/* WHAT YOU WILL EXPERIENCE (INTERACTIVE TIMELINE) */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                WHAT YOU WILL EXPERIENCE
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                A structured chronological timeline. Click any moment to preview advice and challenges.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {life.timeline.length} Moments
            </span>
          </div>

          <div className="space-y-3">
            {life.timeline.map((activity, idx) => {
              const isExpanded = expandedActivityId === activity.id;
              return (
                <div
                  key={activity.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? 'bg-[#121422] border-indigo-500/40 shadow-xl'
                      : 'bg-white/[0.02] border-white/6 hover:border-white/15'
                  }`}
                >
                  <button
                    onClick={() => toggleActivity(activity.id)}
                    className="w-full p-4.5 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 font-mono font-bold text-sm text-indigo-400">
                        {activity.time}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base text-white">
                          {activity.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {activity.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                        {activity.durationMinutes}m
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-white/6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/6">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300 block mb-1">
                          Creator's Personal Advice
                        </span>
                        <p className="text-xs text-slate-300 italic leading-relaxed">
                          "{activity.advice}"
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-500/[0.05] border border-amber-500/20">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block mb-1">
                          Moment Challenge
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {activity.challenge}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* LIFE TWISTS TEASER */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-purple-950/20 via-black/40 to-indigo-950/20 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2 text-purple-400">
            <Sparkles className="w-4 h-4" />
            <h3 className="font-display text-base font-bold uppercase tracking-wider">
              INCLUDES UNEXPECTED LIFE TWISTS
            </h3>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            During this experience, the app will randomly reveal surprise micro-challenges designed to shatter your automated reflexes (e.g. "Your phone is locked for 30 minutes", "Spend ₹0 for 3 hours").
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {life.lifeTwists.map((twist, idx) => (
              <span
                key={twist.id}
                className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-400"
              >
                Twist #{idx + 1}: Locked Until Trigger
              </span>
            ))}
          </div>
        </div>

        {/* WHAT PEOPLE STOLE (COMMUNITY REFLECTIONS) */}
        <div className="mt-12 border-t border-white/6 pt-10">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">
              WHAT PEOPLE STOLE FROM THIS LIFE
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real reflections left by travelers who borrowed this routine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {life.whatPeopleStole.map((steal) => (
              <div
                key={steal.id}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/8 relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={steal.avatar}
                      alt={steal.user}
                      className="w-6 h-6 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs font-medium text-white">{steal.user}</span>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-300">
                    Changed perspective: {steal.perspectiveChange}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{steal.stoleText}"
                </p>
                <span className="block mt-2 text-[10px] text-slate-500 font-mono">
                  {steal.createdAt}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM STICKY/INVITATION CTA */}
        <div className="mt-14 p-8 rounded-3xl bg-indigo-950/20 border border-indigo-500/30 text-center">
          <h3 className="font-display text-xl font-bold text-white mb-2">
            Ready to live {life.title}?
          </h3>
          <p className="text-xs text-slate-300 mb-6 max-w-md mx-auto">
            You will do a quick 10-second mood check before entering "LIFE MODE: ACTIVE".
          </p>
          <button
            onClick={() => onStartExperience(life)}
            className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-indigo-600/30 cursor-pointer"
          >
            {life.price === 0 ? 'Start Free Experience' : `Unlock & Start (₹${life.price})`}
          </button>
        </div>
      </div>
    </div>
  );
};
