import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  Users,
  Flame,
  ArrowRight,
  Filter
} from 'lucide-react';
import {
  LifeExperience,
  CategoryType,
  DurationType,
  MoodType,
  DifficultyType,
} from '../types';

interface DiscoverPageProps {
  lives: LifeExperience[];
  onSelectLife: (lifeId: string) => void;
  savedLifeIds: string[];
  onToggleSave: (lifeId: string) => void;
}

const CATEGORIES: ('All' | CategoryType)[] = [
  'All',
  'Fitness Life',
  'Creative Life',
  'Digital Detox',
  'Cultural Life',
  'Luxury Life',
  'Slow Living',
  'Self-Discovery',
  'Career Life',
  'Night Life',
  'Minimalist Life',
  'Weird & Experimental',
  'Adventure',
  'Student Life',
  'Productivity',
];

const DURATIONS: ('All' | DurationType)[] = [
  'All',
  '30 minutes',
  '2 hours',
  'Half day',
  'Full day',
  'Weekend',
];

const MOODS: ('All' | MoodType)[] = [
  'All',
  'Peaceful',
  'Chaotic',
  'Adventurous',
  'Productive',
  'Creative',
  'Social',
  'Luxurious',
  'Mysterious',
  'Challenging',
];

const DIFFICULTIES: ('All' | DifficultyType)[] = [
  'All',
  'Easy',
  'Medium',
  'Hard',
  'Extreme',
];

const PRICE_TIERS = ['All', 'Free', 'Under ₹100', '₹100–₹500', '₹500+'];

const NATURAL_SEARCH_PRESETS = [
  'I want something peaceful',
  'I want to become productive',
  'I want to experience luxury',
  'I want something weird',
  'I only have 30 minutes',
  'Out of my comfort zone',
];

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  lives,
  onSelectLife,
  savedLifeIds,
  onToggleSave,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | CategoryType>('All');
  const [selectedDuration, setSelectedDuration] = useState<'All' | DurationType>('All');
  const [selectedMood, setSelectedMood] = useState<'All' | MoodType>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | DifficultyType>('All');
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('All');
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);

  // Natural language query interpretation and multi-factor filtering
  const filteredLives = useMemo(() => {
    return lives.filter((life) => {
      // Natural language search query parsing
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();

        // Specific natural language intents
        if (q.includes('peaceful') || q.includes('calm') || q.includes('relax')) {
          if (life.mood !== 'Peaceful' && life.category !== 'Slow Living') return false;
        } else if (q.includes('productive') || q.includes('work') || q.includes('focus')) {
          if (life.mood !== 'Productive' && life.category !== 'Career Life') return false;
        } else if (q.includes('luxury') || q.includes('luxurious') || q.includes('rich')) {
          if (life.mood !== 'Luxurious' && life.category !== 'Luxury Life') return false;
        } else if (q.includes('weird') || q.includes('strange') || q.includes('experimental')) {
          if (life.category !== 'Weird & Experimental' && life.mood !== 'Chaotic') return false;
        } else if (q.includes('30 minutes') || q.includes('quick') || q.includes('short')) {
          if (life.duration !== '30 minutes') return false;
        } else if (q.includes('comfort zone') || q.includes('challenge') || q.includes('brave')) {
          if (life.difficulty !== 'Hard' && life.difficulty !== 'Extreme' && life.mood !== 'Challenging') return false;
        } else {
          // General text search matching title, description, creator, tagline, activities
          const textMatch =
            life.title.toLowerCase().includes(q) ||
            life.description.toLowerCase().includes(q) ||
            life.tagline.toLowerCase().includes(q) ||
            life.creator.name.toLowerCase().includes(q) ||
            life.category.toLowerCase().includes(q) ||
            life.mood.toLowerCase().includes(q);
          if (!textMatch) return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && life.category !== selectedCategory) {
        return false;
      }

      // Duration filter
      if (selectedDuration !== 'All' && life.duration !== selectedDuration) {
        return false;
      }

      // Mood filter
      if (selectedMood !== 'All' && life.mood !== selectedMood) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'All' && life.difficulty !== selectedDifficulty) {
        return false;
      }

      // Price Tier filter
      if (selectedPriceTier === 'Free' && life.price !== 0) {
        return false;
      }
      if (selectedPriceTier === 'Under ₹100' && (life.price === 0 || life.price >= 100)) {
        return false;
      }
      if (selectedPriceTier === '₹100–₹500' && (life.price < 100 || life.price > 500)) {
        return false;
      }
      if (selectedPriceTier === '₹500+' && life.price < 500) {
        return false;
      }

      return true;
    });
  }, [
    lives,
    searchQuery,
    selectedCategory,
    selectedDuration,
    selectedMood,
    selectedDifficulty,
    selectedPriceTier,
  ]);

  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedDuration !== 'All' ? 1 : 0) +
    (selectedMood !== 'All' ? 1 : 0) +
    (selectedDifficulty !== 'All' ? 1 : 0) +
    (selectedPriceTier !== 'All' ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedDuration('All');
    setSelectedMood('All');
    setSelectedDifficulty('All');
    setSelectedPriceTier('All');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24">
      
      {/* Header & Title */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Discover Lives
        </h1>
        <p className="mt-1 text-slate-400 text-sm">
          Browse real routines and perspectives available to experience today.
        </p>
      </div>

      {/* Natural Language Search Bar */}
      <div className="mb-6">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search naturally: 'I want something peaceful', '30 minutes', 'Productive founder'..."
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Natural Search Suggestion Quick Chips */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-500 shrink-0 font-medium">Try searching:</span>
          {NATURAL_SEARCH_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => setSearchQuery(preset)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/8 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              "{preset}"
            </button>
          ))}
        </div>
      </div>

      {/* Category Horizontal Filter Bar */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/6'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Toggle and Active Badges Bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFiltersDrawer(!showFiltersDrawer)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
              showFiltersDrawer || activeFiltersCount > 0
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] border border-white/6'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-500 text-[10px] text-white flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="text-xs text-slate-400 font-mono tabular-nums">
          Showing {filteredLives.length} {filteredLives.length === 1 ? 'Life' : 'Lives'}
        </div>
      </div>

      {/* Detailed Filters Drawer */}
      {showFiltersDrawer && (
        <div className="mb-8 p-5 rounded-2xl bg-[#0f111a] border border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-200">
          
          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Duration
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d} className="bg-[#121420] text-slate-200">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Mood
            </label>
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              {MOODS.map((m) => (
                <option key={m} value={m} className="bg-[#121420] text-slate-200">
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              {DIFFICULTIES.map((dif) => (
                <option key={dif} value={dif} className="bg-[#121420] text-slate-200">
                  {dif}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Price Tier
            </label>
            <select
              value={selectedPriceTier}
              onChange={(e) => setSelectedPriceTier(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              {PRICE_TIERS.map((p) => (
                <option key={p} value={p} className="bg-[#121420] text-slate-200">
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Lives Grid */}
      {filteredLives.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-slate-400 text-sm">No Life Experiences match your search criteria.</p>
          <button
            onClick={clearAllFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLives.map((life) => (
            <div
              key={life.id}
              onClick={() => onSelectLife(life.id)}
              className="group cursor-pointer rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/8 hover:border-indigo-500/40 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex flex-col shadow-lg"
            >
              {/* Media Slot */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={life.coverImage}
                  alt={life.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                
                {/* Remixed origin badge if applicable */}
                {life.remixFrom && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-indigo-950/80 backdrop-blur-md border border-indigo-500/40 text-[10px] font-mono text-indigo-300">
                    Remix: {life.remixFrom.originalTitle}
                  </div>
                )}

                {/* Price in INR */}
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono tabular-nums text-emerald-300 font-semibold">
                  {life.price === 0 ? 'FREE' : `₹${life.price}`}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-[11px] text-indigo-300 font-semibold tracking-wide uppercase">
                    {life.category}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-indigo-200 transition-colors leading-snug">
                    {life.title}
                  </h3>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {life.tagline}
                  </p>

                  {/* Creator details */}
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={life.creator.avatar}
                      alt={life.creator.name}
                      className="w-5 h-5 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-xs text-slate-300 font-medium">{life.creator.name}</span>
                    <span className="text-[11px] text-slate-500">{life.creator.handle}</span>
                  </div>
                </div>

                {/* Metadata Row obeying Zero-Pill rule */}
                <div className="pt-3 border-t border-white/6 flex items-center justify-between text-[11px] text-slate-400 font-mono tabular-nums">
                  <div className="flex items-center gap-2">
                    <span>{life.duration}</span>
                    <span aria-hidden="true" className="text-white/20">·</span>
                    <span>{life.mood}</span>
                    <span aria-hidden="true" className="text-white/20">·</span>
                    <span className={life.difficulty === 'Extreme' ? 'text-rose-400' : life.difficulty === 'Hard' ? 'text-amber-400' : 'text-slate-400'}>
                      {life.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <Users className="w-3 h-3 text-slate-500" />
                    <span>{life.experiencedCount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
