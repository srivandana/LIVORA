import React, { useState } from 'react';
import {
  User,
  Wallet,
  BookOpen,
  PlusCircle,
  Bookmark,
  Award,
  Zap,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Plus,
  CheckCircle
} from 'lucide-react';
import { UserProfile, LifeExperience } from '../types';

interface ProfilePageProps {
  userProfile: UserProfile;
  allLives: LifeExperience[];
  onSelectLife: (lifeId: string) => void;
  onOpenCreate: () => void;
  onOpenPassport: () => void;
  onAddWalletFunds: (amount: number) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userProfile,
  allLives,
  onSelectLife,
  onOpenCreate,
  onOpenPassport,
  onAddWalletFunds,
}) => {
  const [activeTab, setActiveTab] = useState<'passport' | 'created' | 'saved'>('passport');
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [fundsSuccess, setFundsSuccess] = useState(false);

  const stamps = userProfile.completedStamps;
  const livesExperiencedCount = stamps.length;
  const livesCreatedCount = userProfile.customCreatedLives.length;
  const hoursBorrowed = stamps.reduce((acc, s) => acc + s.hoursSpent, 0);
  const twistsSurvived = stamps.reduce((acc, s) => acc + s.twistsSurvived, 0);

  // Saved lives objects
  const savedLivesList = allLives.filter((l) =>
    userProfile.savedLives.includes(l.id)
  );

  const handleTopup = (amt: number) => {
    onAddWalletFunds(amt);
    setFundsSuccess(true);
    setTimeout(() => {
      setFundsSuccess(false);
      setShowAddFunds(false);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-28">
      
      {/* Profile Header Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/8 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          {/* Avatar and Bio */}
          <div className="flex items-center gap-5">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-indigo-500/50 shadow-xl"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {userProfile.name}
                </h1>
                <span className="text-xs font-mono text-indigo-400">
                  {userProfile.handle}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-md font-light leading-relaxed">
                {userProfile.bio}
              </p>
            </div>
          </div>

          {/* Fictional Wallet Card (Startup Business Model) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#111322] border border-indigo-500/30 shrink-0">
            <div className="flex items-center justify-between gap-6 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Borrow Wallet</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Active INR
              </span>
            </div>

            <div className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums mb-3">
              ₹{userProfile.walletBalance}
            </div>

            <button
              onClick={() => setShowAddFunds(true)}
              className="w-full py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Top-up Demo Funds</span>
            </button>
          </div>
        </div>

        {/* 4 Quantitative Profile Stats adhering to Section 13 */}
        <div className="mt-8 pt-8 border-t border-white/6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-center">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums block">
              {livesExperiencedCount}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Lives Experienced
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-center">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-indigo-300 tabular-nums block">
              {livesCreatedCount}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Lives Created
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-center">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-sky-300 tabular-nums block">
              {hoursBorrowed}h
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Hours Borrowed
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-center">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-amber-300 tabular-nums block">
              {twistsSurvived}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Life Twists Survived
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: Life Passport / Created Lives / Saved Lives */}
      <div className="flex items-center gap-2 border-b border-white/8 pb-4 mb-8">
        <button
          onClick={() => setActiveTab('passport')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'passport'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>My Life Passport ({stamps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('created')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'created'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Lives I Created ({userProfile.customCreatedLives.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Experiences ({savedLivesList.length})</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'passport' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Recent stamps earned by following creator protocols.
            </p>
            <button
              onClick={onOpenPassport}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>Open Full Passport Dossier</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stamps.map((stamp) => (
              <div
                key={stamp.id}
                className="p-5 rounded-3xl bg-[#0f111d] border border-white/8 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-indigo-300 font-bold">
                    {stamp.completedAt}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    {stamp.perspectiveRating} shift
                  </span>
                </div>
                <h3 className="font-display font-bold text-white text-base">
                  {stamp.title}
                </h3>
                <p className="text-xs text-slate-300 italic">
                  "{stamp.stolenHabit}"
                </p>
                <div className="pt-2 border-t border-white/6 text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>{stamp.hoursSpent}h borrowed</span>
                  <span>+{stamp.postScore - stamp.preScore} mood</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'created' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Experiences you have authored and published to the marketplace.
            </p>
            <button
              onClick={onOpenCreate}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Create New Life
            </button>
          </div>

          {userProfile.customCreatedLives.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-white/[0.01] border border-white/6">
              <PlusCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-300">You haven't published a Life yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Share your daily rituals or mindset with the world.
              </p>
              <button
                onClick={onOpenCreate}
                className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Launch Life Builder
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProfile.customCreatedLives.map((life) => (
                <div
                  key={life.id}
                  onClick={() => onSelectLife(life.id)}
                  className="group cursor-pointer rounded-2xl bg-white/[0.02] border border-white/8 hover:border-indigo-500/40 p-4 transition-all"
                >
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-slate-900">
                    <img
                      src={life.coverImage}
                      alt={life.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 font-mono text-[11px] text-emerald-300">
                      {life.price === 0 ? 'FREE' : `₹${life.price}`}
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-white text-sm truncate">
                    {life.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {life.tagline}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="space-y-6">
          <p className="text-xs text-slate-400">
            Experiences you bookmarked to borrow later.
          </p>
          {savedLivesList.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-white/[0.01] border border-white/6">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-300">No saved experiences yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedLivesList.map((life) => (
                <div
                  key={life.id}
                  onClick={() => onSelectLife(life.id)}
                  className="group cursor-pointer rounded-2xl bg-white/[0.02] border border-white/8 hover:border-indigo-500/40 p-4 transition-all"
                >
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-slate-900">
                    <img
                      src={life.coverImage}
                      alt={life.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="font-display font-bold text-white text-sm truncate">
                    {life.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {life.tagline}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Top-up Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-[#0e101d] border border-white/12 p-6 text-center">
            <h3 className="font-display font-bold text-lg text-white mb-1">
              Add Demo Wallet Funds
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Simulate paid creator experiences (in INR).
            </p>

            {fundsSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>₹200 Added to Wallet!</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[100, 200, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleTopup(amt)}
                    className="py-3 rounded-xl bg-white/5 hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-500/40 font-mono text-sm font-bold text-white transition-all cursor-pointer"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowAddFunds(false)}
              className="text-xs text-slate-500 hover:text-slate-300 mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
