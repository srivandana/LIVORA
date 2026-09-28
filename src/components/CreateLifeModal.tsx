import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  Eye,
  Zap,
  Clock,
  Wand2,
  DollarSign
} from 'lucide-react';
import {
  LifeExperience,
  DurationType,
  MoodType,
  DifficultyType,
  CategoryType,
  TimelineActivity,
  LifeTwist,
  UserProfile,
} from '../types';

interface CreateLifeModalProps {
  onClose: () => void;
  onPublish: (newLife: LifeExperience) => void;
  userProfile: UserProfile;
}

const DURATIONS: DurationType[] = [
  '30 minutes',
  '2 hours',
  'Half day',
  'Full day',
  'Weekend',
];

const MOODS: MoodType[] = [
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

const DIFFICULTIES: DifficultyType[] = ['Easy', 'Medium', 'Hard', 'Extreme'];

const CATEGORIES: CategoryType[] = [
  'Student Life',
  'Creative Life',
  'Fitness Life',
  'Career Life',
  'Luxury Life',
  'Minimalist Life',
  'Travel Life',
  'Cultural Life',
  'Digital Detox',
  'Weird & Experimental',
  'Self-Discovery',
  'Night Life',
  'Slow Living',
  'Productivity',
  'Adventure',
];

const PRESET_COVERS = [
  '/src/assets/images/hero_borrow_life_1790578280497.jpg',
  '/src/assets/images/athlete_dawn_run_1790578295352.jpg',
  '/src/assets/images/artist_creative_loft_1790578312737.jpg',
  '/src/assets/images/street_photographer_1790578327345.jpg',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
];

export const CreateLifeModal: React.FC<CreateLifeModalProps> = ({
  onClose,
  onPublish,
  userProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'steps'>('ai');
  const [aiPrompt, setAiPrompt] = useState(
    'My ideal Sunday is waking up late, making pour-over coffee, oil painting in daylight, a long walk with no phone, reading a novel, and cooking fresh pasta.'
  );
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // 10-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<DurationType>('Half day');
  const [mood, setMood] = useState<MoodType>('Creative');
  const [difficulty, setDifficulty] = useState<DifficultyType>('Medium');
  const [category, setCategory] = useState<CategoryType>('Creative Life');
  const [price, setPrice] = useState<number>(0);
  const [coverImage, setCoverImage] = useState<string>(PRESET_COVERS[0]);

  // Timeline activities
  const [timeline, setTimeline] = useState<TimelineActivity[]>([
    {
      id: 'act-new-1',
      time: '09:00',
      title: 'Morning Unplugged Brew',
      description: 'Brew coffee or tea with deliberate manual focus. No screens.',
      advice: 'The quality of your brew mirrors the quality of your attention.',
      challenge: 'Stare out the window while sipping.',
      durationMinutes: 30,
      ambientSoundHint: 'morning-birds',
    },
    {
      id: 'act-new-2',
      time: '10:00',
      title: 'The Deep Craft Session',
      description: 'Engage in your chosen craft without checking analytics or notifications.',
      advice: 'Give yourself permission to make something imperfect.',
      challenge: 'No phone within arm’s reach.',
      durationMinutes: 90,
      ambientSoundHint: 'focus-drone',
    },
  ]);

  // Life Twists
  const [lifeTwists, setLifeTwists] = useState<LifeTwist[]>([
    {
      id: 'twist-new-1',
      triggerMinute: 45,
      title: 'The Silence Twist',
      description: 'Spend the next 20 minutes in 100% verbal silence without touching any screen.',
      actionText: 'Maintained total silence',
    },
  ]);

  const [reflectionQuestions, setReflectionQuestions] = useState<string[]>([
    'How much did this Life change your perspective?',
    'What habit from today do you want to keep permanently?',
    'What felt most surprising?',
  ]);

  // AI Life Builder generation handler
  const handleGenerateWithAi = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch('/api/ai/generate-life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const d = resData.data;
        setTitle(d.title || 'The Curated Lifestyle');
        setTagline(d.tagline || 'Experience another perspective.');
        setDescription(d.description || '');
        if (d.duration) setDuration(d.duration);
        if (d.mood) setMood(d.mood);
        if (d.difficulty) setDifficulty(d.difficulty);
        if (d.category) setCategory(d.category);
        if (d.price !== undefined) setPrice(d.price);
        if (d.timeline && Array.isArray(d.timeline)) setTimeline(d.timeline);
        if (d.lifeTwists && Array.isArray(d.lifeTwists)) setLifeTwists(d.lifeTwists);
        if (d.reflectionQuestions && Array.isArray(d.reflectionQuestions)) {
          setReflectionQuestions(d.reflectionQuestions);
        }

        // Switch to the step-by-step editor for fine tuning
        setActiveTab('steps');
        setCurrentStep(1);
      } else {
        setAiError(resData.error || 'Failed to generate life. Please try again.');
      }
    } catch (e: any) {
      console.warn('AI generation error:', e);
      setAiError('Network error. Switched to manual builder mode.');
      setActiveTab('steps');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddActivity = () => {
    const newAct: TimelineActivity = {
      id: `act-${Date.now()}`,
      time: '12:00',
      title: 'New Activity',
      description: 'Describe what the person should do.',
      advice: 'Share your personal recommendation.',
      challenge: 'Give them a micro challenge.',
      durationMinutes: 45,
      ambientSoundHint: 'focus-drone',
    };
    setTimeline([...timeline, newAct]);
  };

  const handleUpdateActivity = (index: number, field: keyof TimelineActivity, value: any) => {
    const updated = [...timeline];
    updated[index] = { ...updated[index], [field]: value };
    setTimeline(updated);
  };

  const handleDeleteActivity = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index));
  };

  const handleAddTwist = () => {
    const newTwist: LifeTwist = {
      id: `twist-${Date.now()}`,
      triggerMinute: 30,
      title: 'Unexpected Twist',
      description: 'Surprise challenge to reveal to the borrower.',
      actionText: 'Completed challenge',
    };
    setLifeTwists([...lifeTwists, newTwist]);
  };

  const handlePublish = () => {
    const newLife: LifeExperience = {
      id: `life-${Date.now()}`,
      title: title || 'My Unique Life Experience',
      tagline: tagline || 'Step into my world for a day.',
      description: description || 'Experience the daily rituals that define my life.',
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
      category,
      price,
      experiencedCount: 1,
      rating: 5.0,
      coverImage,
      timeline,
      lifeTwists,
      reflectionQuestions,
      whatPeopleStole: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    onPublish(newLife);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl bg-[#0e101d] border border-white/12 shadow-2xl p-6 sm:p-8 my-auto relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/8 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg sm:text-xl text-white">
                Create Your Life
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                Creator Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Turn your routine or mindset into an experience for others to borrow.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: AI Assistant vs 10-Step Builder */}
        <div className="mt-4 flex items-center gap-2 p-1 rounded-2xl bg-white/[0.03] border border-white/6 shrink-0">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Life Builder (Instant)</span>
          </button>

          <button
            onClick={() => setActiveTab('steps')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'steps'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Step-by-Step Builder ({currentStep}/10)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-6">
          
          {/* TAB 1: AI ASSISTED LIFE BUILDER */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/30 to-purple-950/20 border border-indigo-500/20">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>AI Architecture Engine</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">
                  Describe your ideal routine in natural words
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Type what you love doing, feeling, or practicing. Gemini will automatically structure it into a complete chronological timeline, activities, creator advice, challenges, unexpected twists, and reflection metrics.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Your Routine or Mindset Description
                </label>
                <textarea
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. 'My ideal Sunday is waking up late, making coffee, painting, going for a walk, reading and watching a movie.'"
                  className="w-full p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-all leading-relaxed"
                />
              </div>

              {aiError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {aiError}
                </div>
              )}

              <div className="flex items-center justify-between gap-4 pt-2">
                <span className="text-xs text-slate-500">
                  You can edit every activity, twist, and price before publishing.
                </span>

                <button
                  type="button"
                  onClick={handleGenerateWithAi}
                  disabled={isAiLoading || !aiPrompt.trim()}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>{isAiLoading ? 'Synthesizing Life Experience...' : 'Generate Structured Life'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: STEP-BY-STEP BUILDER (Steps 1–10) */}
          {activeTab === 'steps' && (
            <div className="space-y-6">
              
              {/* Step Navigation Indicator */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/6 pb-3">
                <span>STEP {currentStep} OF 10</span>
                <span className="text-indigo-300">
                  {currentStep === 1 && 'Name & Identity'}
                  {currentStep === 2 && 'Duration & Pace'}
                  {currentStep === 3 && 'Mood & Atmosphere'}
                  {currentStep === 4 && 'Category & Domain'}
                  {currentStep === 5 && 'Timeline & Activities'}
                  {currentStep === 6 && 'Creator Advice'}
                  {currentStep === 7 && 'Life Twists'}
                  {currentStep === 8 && 'Visual Cover'}
                  {currentStep === 9 && 'Pricing (INR)'}
                  {currentStep === 10 && 'Live Customer Preview'}
                </span>
              </div>

              {/* Step 1: Name Your Experience */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Title of Your Experience
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. 'A Day as a Fashion Student', 'The 5 AM Athlete'"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Tagline (One Punchy Sentence)
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. 'Trade morning fog for cold water and relentless discipline.'"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Philosophy / Backstory
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Why do you live this way? What will the borrower feel?"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Choose Duration */}
              {currentStep === 2 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Choose Duration
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {DURATIONS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                          duration === d
                            ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500'
                            : 'bg-white/[0.02] border-white/6 hover:bg-white/[0.06]'
                        }`}
                      >
                        <Clock className="w-5 h-5 mx-auto mb-2 text-indigo-400" />
                        <span className="text-sm font-semibold text-white block">{d}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Choose Mood */}
              {currentStep === 3 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Choose The Dominant Mood
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {MOODS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMood(m)}
                        className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          mood === m
                            ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500'
                            : 'bg-white/[0.02] border-white/6 hover:bg-white/[0.06]'
                        }`}
                      >
                        <span className="text-xs font-semibold text-white block">{m}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Category & Difficulty */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-[#121422] text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Difficulty Level
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {DIFFICULTIES.map((dif) => (
                        <button
                          key={dif}
                          type="button"
                          onClick={() => setDifficulty(dif)}
                          className={`py-2.5 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                            difficulty === dif
                              ? 'bg-indigo-600 text-white border-indigo-500'
                              : 'bg-white/[0.02] border-white/6 text-slate-400'
                          }`}
                        >
                          {dif}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Timeline & Activities */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Chronological Activities ({timeline.length})
                    </label>
                    <button
                      type="button"
                      onClick={handleAddActivity}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Moment</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {timeline.map((act, idx) => (
                      <div
                        key={act.id}
                        className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <input
                            type="text"
                            value={act.time}
                            onChange={(e) => handleUpdateActivity(idx, 'time', e.target.value)}
                            placeholder="08:00"
                            className="w-20 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-indigo-300 text-xs font-mono font-bold"
                          />
                          <input
                            type="text"
                            value={act.title}
                            onChange={(e) => handleUpdateActivity(idx, 'title', e.target.value)}
                            placeholder="Activity Title"
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-semibold"
                          />
                          {timeline.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteActivity(idx)}
                              className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <textarea
                          rows={2}
                          value={act.description}
                          onChange={(e) =>
                            handleUpdateActivity(idx, 'description', e.target.value)
                          }
                          placeholder="Instructions for this moment..."
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-slate-200 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: Personal Advice & Challenges */}
              {currentStep === 6 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    Add your personal candid insider tips and moment challenges for each activity.
                  </p>
                  <div className="space-y-3">
                    {timeline.map((act, idx) => (
                      <div
                        key={act.id}
                        className="p-4 rounded-2xl bg-white/[0.02] border border-white/8 space-y-2"
                      >
                        <span className="text-xs font-bold text-white font-mono">
                          {act.time} — {act.title}
                        </span>

                        <input
                          type="text"
                          value={act.advice}
                          onChange={(e) => handleUpdateActivity(idx, 'advice', e.target.value)}
                          placeholder="Your personal advice/pro-tip for this moment"
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-slate-300 text-xs italic"
                        />

                        <input
                          type="text"
                          value={act.challenge}
                          onChange={(e) => handleUpdateActivity(idx, 'challenge', e.target.value)}
                          placeholder="Specific micro challenge (e.g. 'No phone for 30 minutes')"
                          className="w-full px-3 py-2 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 text-slate-200 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 7: Life Twists */}
              {currentStep === 7 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-purple-400" />
                        <span>Unexpected Life Twists</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Surprise challenges revealed spontaneously during the experience.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddTwist}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Twist</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {lifeTwists.map((twist, idx) => (
                      <div
                        key={twist.id}
                        className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <input
                            type="text"
                            value={twist.title}
                            onChange={(e) => {
                              const updated = [...lifeTwists];
                              updated[idx].title = e.target.value;
                              setLifeTwists(updated);
                            }}
                            placeholder="Twist Title (e.g. 'The 0-Spend Rule')"
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-bold"
                          />
                          {lifeTwists.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setLifeTwists(lifeTwists.filter((_, i) => i !== idx))
                              }
                              className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <textarea
                          rows={2}
                          value={twist.description}
                          onChange={(e) => {
                            const updated = [...lifeTwists];
                            updated[idx].description = e.target.value;
                            setLifeTwists(updated);
                          }}
                          placeholder="What does the borrower have to do right now?"
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/8 text-slate-200 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 8: Visual Cover */}
              {currentStep === 8 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Select Cinematic Cover Artwork
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PRESET_COVERS.map((cov, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCoverImage(cov)}
                        className={`relative aspect-[16/10] rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                          coverImage === cov
                            ? 'border-indigo-500 ring-2 ring-indigo-500/50 scale-[1.02]'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img
                          src={cov}
                          alt="Cover preset"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {coverImage === cov && (
                          <div className="absolute top-2 right-2 p-1 rounded-full bg-indigo-600 text-white">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 9: Choose Price */}
              {currentStep === 9 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Set Experience Price (Indian Rupees ₹)
                  </label>
                  <p className="text-xs text-slate-500 mb-4">
                    Creators keep 85% of paid experience earnings.
                  </p>

                  <div className="grid grid-cols-5 gap-3">
                    {[0, 49, 99, 199, 499].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrice(p)}
                        className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                          price === p
                            ? 'bg-emerald-600/20 border-emerald-500 ring-1 ring-emerald-500 text-emerald-300'
                            : 'bg-white/[0.02] border-white/6 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span className="font-mono text-base font-bold tabular-nums block">
                          {p === 0 ? 'FREE' : `₹${p}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 10: Live Customer Preview */}
              {currentStep === 10 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    <span>All 9 Steps Configured! Review Customer Experience Card:</span>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/[0.02] overflow-hidden max-w-md mx-auto">
                    <div className="relative aspect-[16/10] bg-slate-900">
                      <img
                        src={coverImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 font-mono text-xs text-emerald-300">
                        {price === 0 ? 'FREE' : `₹${price}`}
                      </div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="text-[10px] text-indigo-300 uppercase font-mono">
                          {category}
                        </span>
                        <h3 className="font-display font-bold text-base text-white truncate">
                          {title || 'Untitled Life'}
                        </h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-xs text-slate-300">{tagline || 'No tagline'}</p>
                      <div className="pt-2 border-t border-white/6 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>{duration}</span>
                        <span>·</span>
                        <span>{mood}</span>
                        <span>·</span>
                        <span>{timeline.length} Moments</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="pt-4 border-t border-white/8 flex items-center justify-between gap-4 shrink-0">
          {activeTab === 'steps' ? (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {currentStep < 10 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.min(10, currentStep + 1))}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePublish}
                  className="px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Publish to Marketplace</span>
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTab('steps')}
                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                Manual Step Builder
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
