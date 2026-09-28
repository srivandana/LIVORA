import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  FastForward,
  CheckCircle2,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  AlertCircle,
  X,
  Compass,
  Zap,
  Quote,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import {
  LifeExperience,
  ActiveLifeSession,
  LifeTwist,
  TimelineActivity,
} from '../types';
import { sound } from '../utils/audio';

interface LiveExperienceModeProps {
  life: LifeExperience;
  session: ActiveLifeSession;
  onUpdateSession: (updated: ActiveLifeSession) => void;
  onCompleteExperience: () => void;
  onExitLiveMode: () => void;
}

export const LiveExperienceMode: React.FC<LiveExperienceModeProps> = ({
  life,
  session,
  onUpdateSession,
  onCompleteExperience,
  onExitLiveMode,
}) => {
  const currentActivityIndex = session.currentActivityIndex;
  const currentActivity: TimelineActivity | undefined = life.timeline[currentActivityIndex];

  // Seconds countdown for current activity (default to 600s or stored remaining)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    session.secondsRemainingInCurrent || 600
  );
  const [isPaused, setIsPaused] = useState<boolean>(session.isPaused || false);
  const [currentMoodSlider, setCurrentMoodSlider] = useState<number>(
    session.currentMoodSlider ?? session.preMood.score
  );
  const [activeTwistModal, setActiveTwistModal] = useState<LifeTwist | null>(null);
  const [isCompletedAnimation, setIsCompletedAnimation] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Ticking countdown effect
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  // Sync state back to session storage periodically
  useEffect(() => {
    onUpdateSession({
      ...session,
      secondsRemainingInCurrent: secondsRemaining,
      isPaused,
      currentMoodSlider,
    });
  }, [secondsRemaining, isPaused, currentMoodSlider]);

  // Check for random or scheduled twists during session
  useEffect(() => {
    // If there is an unrevealed twist for this life, schedule an encounter
    const unrevealed = life.lifeTwists.filter(
      (t) => !session.revealedTwists.includes(t.id)
    );
    if (unrevealed.length > 0 && Math.random() < 0.25 && !activeTwistModal) {
      const timer = setTimeout(() => {
        const twistToTrigger = unrevealed[0];
        triggerTwist(twistToTrigger);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [currentActivityIndex]);

  const triggerTwist = (twist: LifeTwist) => {
    sound.playTwistAlert();
    setActiveTwistModal(twist);
    onUpdateSession({
      ...session,
      revealedTwists: [...session.revealedTwists, twist.id],
    });
  };

  const handleCompleteCurrentActivity = () => {
    sound.playChime();
    setIsCompletedAnimation(true);

    const completedIds = [
      ...session.completedActivityIds,
      currentActivity?.id || '',
    ];

    setTimeout(() => {
      setIsCompletedAnimation(false);
      const nextIndex = currentActivityIndex + 1;

      if (nextIndex >= life.timeline.length) {
        // Complete the entire life experience!
        onCompleteExperience();
      } else {
        // Advance to next activity
        setSecondsRemaining(600); // 10 minutes default
        onUpdateSession({
          ...session,
          currentActivityIndex: nextIndex,
          completedActivityIds: completedIds,
          secondsRemainingInCurrent: 600,
        });
      }
    }, 600);
  };

  const handleFastForwardDemo = () => {
    // Demo speed accelerator: jumps time down to 5 seconds
    setSecondsRemaining(5);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const completedCount = session.completedActivityIds.length;
  const totalCount = life.timeline.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-[85vh] flex flex-col justify-between max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
      
      {/* Top Bar: LIFE MODE: ACTIVE */}
      <div className="rounded-2xl p-4 bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-4 mb-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
                LIFE MODE: ACTIVE
              </span>
              <span aria-hidden="true" className="text-white/20">·</span>
              <span className="text-xs text-indigo-300 font-medium truncate max-w-[140px] sm:max-w-xs">
                {life.title}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tabular-nums">
              Moment {currentActivityIndex + 1} of {totalCount} ({progressPercent}% completed)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={() => {
              const muted = sound.toggleMute();
              setIsMuted(muted);
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Test Surprise Twist Trigger Button */}
          <button
            onClick={() => {
              const twist = life.lifeTwists[0] || {
                id: 'tw-spont',
                triggerMinute: 10,
                title: 'Spontaneous Phone Lockdown',
                description: 'Lock your phone and place it upside down across the room for the next 15 minutes.',
                actionText: 'I locked my phone',
              };
              triggerTwist(twist);
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/40 border border-purple-500/30 text-[11px] font-mono text-purple-200 transition-colors cursor-pointer"
            title="Demonstrate surprise Life Twist"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Surprise Twist</span>
          </button>

          {/* Exit / Pause Session */}
          <button
            onClick={onExitLiveMode}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/8 transition-colors cursor-pointer"
          >
            Exit Live Mode
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Moment Cinematic Interface */}
      {currentActivity && (
        <div className={`p-6 sm:p-10 rounded-3xl bg-[#0e101c] border border-white/10 shadow-2xl relative overflow-hidden transition-all duration-300 ${
          isCompletedAnimation ? 'scale-[0.98] opacity-60' : 'scale-100 opacity-100'
        }`}>
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Current Activity Timecode & Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="font-mono text-indigo-400 font-bold text-sm tracking-wider block mb-1">
                CURRENT ACTIVITY · {currentActivity.time}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {currentActivity.title}
              </h2>
            </div>

            {/* Countdown Clock with Fast-Forward Demo & Pause */}
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex items-center gap-3 shrink-0">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Next Activity In
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
                  {formatTime(secondsRemaining)}
                </span>
              </div>

              <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                  title={isPaused ? 'Resume timer' : 'Pause timer'}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                </button>
                <button
                  onClick={handleFastForwardDemo}
                  className="p-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 transition-colors cursor-pointer"
                  title="Fast-forward timer (Demo mode: 5s remaining)"
                >
                  <FastForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Description & Concrete Instructions */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/6 mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Instructions
            </h3>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
              {currentActivity.description}
            </p>
          </div>

          {/* Creator Advice and Challenge Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20">
              <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold mb-1">
                <Quote className="w-3.5 h-3.5 text-indigo-400" />
                <span>{life.creator.name}'s Personal Advice</span>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{currentActivity.advice}"
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20">
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Moment Challenge</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentActivity.challenge}
              </p>
            </div>
          </div>

          {/* "How are you feeling?" Real-Time Mood Slider */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/6 mb-8">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>How are you feeling in this moment?</span>
              </span>
              <span className="font-mono text-indigo-300 font-bold tabular-nums">
                {currentMoodSlider} / 100
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentMoodSlider}
              onChange={(e) => setCurrentMoodSlider(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>Resistance / Fatigue</span>
              <span>In The Flow</span>
              <span>Transformation</span>
            </div>
          </div>

          {/* Action Complete Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/6">
            <div className="text-xs text-slate-400">
              {currentActivityIndex + 1 === totalCount ? (
                <span className="text-emerald-400 font-semibold">
                  Final moment! Completing this unlocks your Life Passport Stamp.
                </span>
              ) : (
                <span>
                  Next up:{' '}
                  <strong className="text-slate-300">
                    {life.timeline[currentActivityIndex + 1]?.title}
                  </strong>
                </span>
              )}
            </div>

            <button
              onClick={handleCompleteCurrentActivity}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {currentActivityIndex + 1 === totalCount
                  ? 'Complete Experience'
                  : 'Done / Unlock Next Moment'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* LIFE TWIST SURPRISE MODAL */}
      {activeTwistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#1b1226] to-[#0c0d16] border-2 border-purple-500/50 shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center mx-auto mb-4 text-purple-300 animate-bounce">
              <Zap className="w-6 h-6 fill-current text-purple-400" />
            </div>

            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[11px] font-bold tracking-widest uppercase inline-block mb-3">
              UNEXPECTED LIFE TWIST
            </span>

            <h3 className="font-display text-2xl font-extrabold text-white tracking-tight mb-3">
              {activeTwistModal.title}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
              {activeTwistModal.description}
            </p>

            <button
              onClick={() => setActiveTwistModal(null)}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-600/40 transition-all cursor-pointer"
            >
              {activeTwistModal.actionText || 'Challenge Accepted'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
