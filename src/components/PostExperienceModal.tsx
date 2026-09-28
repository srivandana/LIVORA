import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  Award,
  CheckCircle,
  BookOpen,
  Quote
} from 'lucide-react';
import {
  LifeExperience,
  ActiveLifeSession,
  UserMoodAssessment,
  PassportStamp,
} from '../types';
import { sound } from '../utils/audio';

interface PostExperienceModalProps {
  life: LifeExperience;
  session: ActiveLifeSession;
  onFinishAndStamp: (stamp: PassportStamp, stealText: string, perspective: any) => void;
}

const POST_MOOD_OPTIONS = [
  { emoji: '😴', label: 'Tired', score: 35 },
  { emoji: '😐', label: 'Neutral', score: 55 },
  { emoji: '😄', label: 'Content', score: 75 },
  { emoji: '🔥', label: 'Energized', score: 88 },
  { emoji: '🤩', label: 'Inspired', score: 95 },
  { emoji: '🧘', label: 'Centered', score: 85 },
];

const STEAL_SUGGESTIONS = [
  'I started waking up earlier with zero phone time.',
  'I realized I love creating tactile things with my hands.',
  'I want to spend 3 hours a day completely disconnected.',
  'I discovered that moving slower actually increases focus.',
  'I learned to walk through the city without headphones.',
  'I will make hard decisions in 10 minutes from now on.',
];

const STAMP_COLORS = [
  '#818cf8', // Indigo
  '#34d399', // Emerald
  '#f43f5e', // Rose
  '#38bdf8', // Sky
  '#fbbf24', // Amber
  '#c084fc', // Purple
];

export const PostExperienceModal: React.FC<PostExperienceModalProps> = ({
  life,
  session,
  onFinishAndStamp,
}) => {
  const [selectedPostMood, setSelectedPostMood] = useState(POST_MOOD_OPTIONS[3]);
  const [postScore, setPostScore] = useState<number>(85);
  const [perspectiveRating, setPerspectiveRating] = useState<
    'Not really' | 'A little' | 'Surprisingly' | 'Completely'
  >('Completely');
  const [stolenHabit, setStolenHabit] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const preScore = session.preMood.score;
  const delta = postScore - preScore;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playStampThud();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#38bdf8', '#fb7185', '#34d399', '#f59e0b'],
      });
    } catch {
      // ignore
    }

    const randomColor =
      STAMP_COLORS[Math.floor(Math.random() * STAMP_COLORS.length)];

    const stamp: PassportStamp = {
      id: `stamp-${Date.now()}`,
      experienceId: life.id,
      title: life.title,
      creatorName: life.creator.name,
      category: life.category,
      mood: life.mood,
      completedAt: new Date().toISOString().split('T')[0],
      hoursSpent: life.duration === '30 minutes' ? 0.5 : life.duration === '2 hours' ? 2 : life.duration === 'Half day' ? 5 : 8,
      stolenHabit: stolenHabit || 'Adopted the daily intentional mindset.',
      perspectiveRating,
      preScore,
      postScore,
      twistsSurvived: session.revealedTwists.length || 1,
      stampColor: randomColor,
    };

    setIsSubmitted(true);
    setTimeout(() => {
      onFinishAndStamp(stamp, stolenHabit, perspectiveRating);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-[#0e101c] border border-white/12 shadow-2xl p-6 sm:p-8 my-8 relative">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono tracking-widest uppercase text-indigo-400 font-semibold block mb-1">
            EXPERIENCE COMPLETED
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            You Borrowed {life.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Take a moment to reflect before receiving your permanent Life Passport Stamp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Post-Mood Check */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              How are you feeling right now?
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {POST_MOOD_OPTIONS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setSelectedPostMood(item);
                    setPostScore(item.score);
                  }}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedPostMood.label === item.label
                      ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500'
                      : 'bg-white/[0.02] border-white/6 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="text-xl">{item.emoji}</div>
                  <div className="text-[10px] text-slate-300 mt-1 truncate">
                    {item.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* BEFORE vs AFTER Visual Comparison */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>What Changed? (Self-Reflection)</span>
              <span className="text-[10px] text-slate-500 lowercase">
                *not a medical diagnosis
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-xl bg-black/40 border border-white/6">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">
                  BEFORE STARTING
                </span>
                <div className="text-2xl mb-1">{session.preMood.emoji}</div>
                <div className="font-mono text-base font-bold text-slate-300 tabular-nums">
                  {preScore} / 100
                </div>
                <span className="text-[11px] text-slate-400">
                  {session.preMood.label}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
                <span className="text-[10px] font-mono text-indigo-300 block mb-1">
                  AFTER EXPERIENCE
                </span>
                <div className="text-2xl mb-1">{selectedPostMood.emoji}</div>
                <div className="font-mono text-base font-bold text-white tabular-nums">
                  {postScore} / 100
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold font-mono">
                  {delta >= 0 ? `+${delta} pts` : `${delta} pts`} shift
                </span>
              </div>
            </div>
          </div>

          {/* Perspective Shift Metric */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              How much did this Life change your perspective?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Not really', 'A little', 'Surprisingly', 'Completely'] as const).map(
                (opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPerspectiveRating(opt)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                      perspectiveRating === opt
                        ? 'bg-indigo-600 text-white border-indigo-500 font-semibold shadow'
                        : 'bg-white/[0.02] border-white/6 text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt}
                  </button>
                )
              )}
            </div>
          </div>

          {/* "What did you steal from this Life?" */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
              <span>What did you steal from this Life?</span>
              <span className="text-[10px] text-indigo-400 font-normal">
                Permanent habit takeaway
              </span>
            </label>
            <textarea
              rows={2}
              value={stolenHabit}
              onChange={(e) => setStolenHabit(e.target.value)}
              placeholder="e.g. 'I started waking up earlier without my phone', 'I realized I love painting'..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-all leading-relaxed"
            />

            {/* Quick Inspiration Chips */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {STEAL_SUGGESTIONS.slice(0, 3).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStolenHabit(s)}
                  className="text-[11px] px-2 py-0.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/6 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  "{s.slice(0, 35)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Submit & Receive Passport Stamp */}
          <button
            type="submit"
            disabled={isSubmitted}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>
              {isSubmitted ? 'Stamping Passport...' : 'Stamp My Life Passport'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
