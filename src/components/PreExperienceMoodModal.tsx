import React, { useState } from 'react';
import { X, Play, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { LifeExperience, UserMoodAssessment } from '../types';
import { sound } from '../utils/audio';

interface PreExperienceMoodModalProps {
  life: LifeExperience;
  onClose: () => void;
  onConfirmStart: (mood: UserMoodAssessment, ambientSound: string) => void;
  walletBalance: number;
}

const MOOD_OPTIONS: { emoji: string; label: string; defaultScore: number }[] = [
  { emoji: '😴', label: 'Tired', defaultScore: 30 },
  { emoji: '😐', label: 'Neutral', defaultScore: 50 },
  { emoji: '😄', label: 'Happy', defaultScore: 75 },
  { emoji: '😵', label: 'Overwhelmed', defaultScore: 35 },
  { emoji: '🔥', label: 'Motivated', defaultScore: 85 },
  { emoji: '🥱', label: 'Bored', defaultScore: 40 },
  { emoji: '❤️', label: 'Emotional', defaultScore: 60 },
  { emoji: '🤩', label: 'Excited', defaultScore: 90 },
];

export const PreExperienceMoodModal: React.FC<PreExperienceMoodModalProps> = ({
  life,
  onClose,
  onConfirmStart,
  walletBalance,
}) => {
  const [selectedMood, setSelectedMood] = useState(MOOD_OPTIONS[1]); // Default Neutral
  const [moodScore, setMoodScore] = useState<number>(50);
  const [selectedAmbient, setSelectedAmbient] = useState<string>(
    life.timeline[0]?.ambientSoundHint || 'focus-drone'
  );

  const handleSelectMood = (item: typeof MOOD_OPTIONS[0]) => {
    setSelectedMood(item);
    setMoodScore(item.defaultScore);
  };

  const handleStart = () => {
    // Start ambient audio
    if (selectedAmbient !== 'silence') {
      sound.startAmbient(selectedAmbient as any);
    }
    onConfirmStart(
      {
        emoji: selectedMood.emoji,
        label: selectedMood.label,
        score: moodScore,
      },
      selectedAmbient
    );
  };

  const canAfford = life.price === 0 || walletBalance >= life.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#0e101a] border border-white/12 shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRE-EXPERIENCE CALIBRATION</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">
            How are you feeling right now?
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            We will record your baseline to measure what shifts after borrowing{' '}
            <span className="text-slate-200 font-medium">{life.title}</span>.
          </p>
        </div>

        {/* Mood Emoji Grid */}
        <div className="grid grid-cols-4 gap-2.5 mb-6">
          {MOOD_OPTIONS.map((item) => {
            const isSelected = selectedMood.label === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSelectMood(item)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                    : 'bg-white/[0.02] border-white/6 hover:bg-white/[0.06]'
                }`}
              >
                <div className="text-2xl mb-1">{item.emoji}</div>
                <div className="text-[11px] font-medium text-slate-300 truncate">
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Baseline Slider */}
        <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Internal State Score</span>
            <span className="font-mono text-indigo-300 font-bold tabular-nums">
              {moodScore} / 100
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={moodScore}
            onChange={(e) => setMoodScore(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>Depleted (0)</span>
            <span>Balanced (50)</span>
            <span>Peak Energy (100)</span>
          </div>
        </div>

        {/* Ambient Sound Selection */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Choose Ambient Soundtrack</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'focus-drone', label: 'Focus Drone' },
              { id: 'rain', label: 'Rain Drops' },
              { id: 'cafe', label: 'Cafe Murmur' },
              { id: 'silence', label: 'Pure Silence' },
            ].map((amb) => (
              <button
                key={amb.id}
                type="button"
                onClick={() => setSelectedAmbient(amb.id)}
                className={`px-2.5 py-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                  selectedAmbient === amb.id
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-white/[0.02] border-white/6 text-slate-400 hover:text-white'
                }`}
              >
                {amb.label}
              </button>
            ))}
          </div>
        </div>

        {/* Wallet check for paid experiences */}
        {life.price > 0 && (
          <div className="mb-6 p-3 rounded-xl bg-white/[0.02] border border-white/8 flex items-center justify-between text-xs">
            <span className="text-slate-400">Experience Fee: ₹{life.price}</span>
            <span className="text-emerald-400 font-mono tabular-nums">
              Wallet Balance: ₹{walletBalance}
            </span>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleStart}
          disabled={!canAfford}
          className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
            canAfford
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>
            {canAfford ? 'Enter Life Mode: Active' : `Insufficient Balance (Need ₹${life.price})`}
          </span>
        </button>
      </div>
    </div>
  );
};
