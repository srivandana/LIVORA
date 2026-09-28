import React from 'react';
import {
  ArrowRight,
  Flame,
  Sparkles,
  Compass,
  CheckCircle2,
  Clock,
  Zap,
  Users,
  Eye,
  Shuffle,
  ShieldCheck,
  Award
} from 'lucide-react';
import { LifeExperience } from '../types';

interface LandingPageProps {
  onExplore: () => void;
  onCreate: () => void;
  onSelectLife: (lifeId: string) => void;
  featuredLives: LifeExperience[];
  dailyDropLife?: LifeExperience;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExplore,
  onCreate,
  onSelectLife,
  featuredLives,
  dailyDropLife,
}) => {
  // Floating cards subset for the dynamic hero background/showcase
  const floatingCards = featuredLives.slice(0, 4);

  return (
    <div className="relative overflow-hidden pb-20">
      
      {/* Background ambient lighting subtle gradients (anti-slop restraint: deep obsidian with soft violet glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-32 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[160px]" />
      </div>

      {/* Hero Section */}
      <section className="pt-16 sm:pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Concept Banner */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-indigo-300 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="tracking-wide">A NEW CATEGORY OF HUMAN EXPERIENCE</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] [text-wrap:balance]">
            WHAT IF YOU COULD LIVE SOMEONE ELSE'S LIFE?
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed [text-wrap:balance]">
            Borrow a Life lets you experience real people's routines, rituals, challenges and perspectives — for a day.
          </p>

          <p className="mt-3 text-sm text-indigo-300 font-medium">
            "Don't just watch someone's life. Experience it."
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore Lives</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onCreate}
              className="px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/12 text-slate-200 hover:text-white font-medium text-sm tracking-wide transition-all cursor-pointer"
            >
              Create Your Life
            </button>
          </div>

          {/* Quantitative Proof adjacent */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white font-mono tabular-nums">18,920+</span>
              <span>Lives Experienced</span>
            </div>
            <span aria-hidden="true" className="text-white/20">·</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white font-mono tabular-nums">340+</span>
              <span>Verified Creators</span>
            </div>
            <span aria-hidden="true" className="text-white/20">·</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white font-mono tabular-nums">4.9/5</span>
              <span>Perspective Shift Rating</span>
            </div>
          </div>
        </div>

        {/* Floating Animated Life Cards Showcase */}
        <div className="mt-16 sm:mt-20 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {floatingCards.map((card, idx) => (
              <div
                key={card.id}
                onClick={() => onSelectLife(card.id)}
                className={`group cursor-pointer rounded-2xl p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/8 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1.5 shadow-xl ${
                  idx % 2 === 1 ? 'sm:translate-y-4' : ''
                }`}
              >
                {/* Card Image */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3.5 bg-slate-900">
                  <img
                    src={card.coverImage}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Clean unboxed price overlay */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono tabular-nums text-emerald-300 font-medium">
                    {card.price === 0 ? 'FREE' : `₹${card.price}`}
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <p className="text-[11px] text-indigo-300 font-medium tracking-wide uppercase">
                      {card.category}
                    </p>
                    <h3 className="font-display text-base font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-1">
                      {card.title}
                    </h3>
                  </div>
                </div>

                {/* Creator & Metadata using Zero-Pill Discipline */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={card.creator.avatar}
                      alt={card.creator.name}
                      className="w-4 h-4 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-slate-300 truncate max-w-[90px]">{card.creator.name}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono tabular-nums text-slate-400">
                    <Users className="w-3 h-3 text-slate-500" />
                    <span>{card.experiencedCount}</span>
                  </div>
                </div>

                {/* Clean unboxed metadata row */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-white/6 font-mono tabular-nums">
                  <span>{card.duration}</span>
                  <span aria-hidden="true" className="text-white/20">·</span>
                  <span>{card.mood}</span>
                  <span aria-hidden="true" className="text-white/20">·</span>
                  <span className={card.difficulty === 'Extreme' ? 'text-rose-400' : card.difficulty === 'Hard' ? 'text-amber-400' : 'text-slate-400'}>
                    {card.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE DAILY LIFE DROP SECTION */}
      {dailyDropLife && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 my-12">
          <div className="relative rounded-3xl p-6 sm:p-10 border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-[#11131f] to-indigo-950/20 overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-mono text-amber-300 mb-4">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
                  <span>THE DAILY LIFE DROP · AVAILABLE FOR 24 HOURS</span>
                </div>
                
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {dailyDropLife.title}
                </h2>
                
                <p className="mt-2 text-sm sm:text-base text-slate-300">
                  {dailyDropLife.tagline}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span>Created by {dailyDropLife.creator.name}</span>
                  <span aria-hidden="true">·</span>
                  <span>{dailyDropLife.duration}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-mono font-medium">
                    {dailyDropLife.price === 0 ? 'Free Today' : `₹${dailyDropLife.price}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <button
                  onClick={() => onSelectLife(dailyDropLife.id)}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 cursor-pointer flex items-center gap-2"
                >
                  <span>Experience Today's Life</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* "YOU'VE SEEN THEIR LIVES. NOW TRY ONE." SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10 text-center sm:text-left">
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-2">
            IMMERSIVE PROFILES
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            YOU'VE SEEN THEIR LIVES.
            <br />
            NOW TRY ONE.
          </h2>
          <p className="mt-3 text-slate-400 text-sm max-w-xl">
            Social media let you observe from a glass screen. Borrow A Life places you inside their shoes, their morning tea, their hardest hour, and their unexpected twists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredLives.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectLife(item.id)}
              className="group cursor-pointer rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/8 hover:border-indigo-500/40 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                
                <div className="absolute top-3 left-3 text-[11px] font-mono px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-white">
                  {item.category}
                </div>

                <div className="absolute top-3 right-3 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 font-medium">
                  {item.price === 0 ? 'FREE' : `₹${item.price}`}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {item.tagline}
                  </p>
                  
                  {/* Timeline preview snapshot */}
                  <div className="space-y-1.5 mb-4 border-l-2 border-indigo-500/30 pl-3">
                    {item.timeline.slice(0, 2).map((t) => (
                      <div key={t.id} className="text-[11px] flex items-center gap-2 text-slate-400">
                        <span className="font-mono text-indigo-300 text-[10px]">{t.time}</span>
                        <span className="truncate">{t.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="pt-3 border-t border-white/6 flex items-center justify-between text-xs text-slate-400">
                    <span>By {item.creator.name}</span>
                    <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-medium">
                      Enter Life <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS: THE 4-STEP FRAMEWORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-white/6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-2">
            THE ARCHITECTURE OF BORROWING
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How You Borrow A Life
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Not a passive video. A tactile, temporal contract with another human being's reality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/8 relative">
            <span className="font-mono text-3xl font-extrabold text-indigo-500/40">01</span>
            <h3 className="font-display text-lg font-bold text-white mt-3 mb-2">Choose a Life</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browse lifestyles by mood, duration, or discipline. Select a routine that challenges your existing comfort zone.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/8 relative">
            <span className="font-mono text-3xl font-extrabold text-sky-500/40">02</span>
            <h3 className="font-display text-lg font-bold text-white mt-3 mb-2">Enter the Experience</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your device shifts into "LIFE MODE: ACTIVE". Ambient soundscapes, timers, and creator voice notes activate.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/8 relative">
            <span className="font-mono text-3xl font-extrabold text-amber-500/40">03</span>
            <h3 className="font-display text-lg font-bold text-white mt-3 mb-2">Follow the Journey</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Execute each moment. Survive unexpected "Life Twists" randomly revealed to shatter your automated reflexes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/8 relative">
            <span className="font-mono text-3xl font-extrabold text-emerald-500/40">04</span>
            <h3 className="font-display text-lg font-bold text-white mt-3 mb-2">Reflect on What Changed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log before/after mood shifts. Steal one habit permanently, and earn an indelible stamp in your digital Life Passport.
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM INVITATION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-b from-indigo-950/30 to-black/60 border border-indigo-500/20">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Ready to step out of your own shoes?
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-lg mx-auto">
            Choose an experience right now. It takes 30 seconds to begin.
          </p>
          <div className="mt-6">
            <button
              onClick={onExplore}
              className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Open Discovery Marketplace
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
