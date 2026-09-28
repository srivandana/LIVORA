import React, { useState, useEffect } from 'react';
import {
  Compass,
  BookOpen,
  PlusCircle,
  User,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldAlert,
  Flame,
  Wallet,
  Play
} from 'lucide-react';
import { sound } from '../utils/audio';
import { ActiveLifeSession, UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  activeSession: ActiveLifeSession | null;
  userProfile: UserProfile;
  onOpenCreate: () => void;
  onOpenWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  activeSession,
  userProfile,
  onOpenCreate,
  onOpenWallet,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const handleAudioToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <>
      {/* Desktop Top Bar: Strict 3-zone Top Bar Contract */}
      <header className="sticky top-0 z-40 w-full border-b border-white/8 bg-[#090a0f]/90 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Single text element Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('landing')}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-[1px] shadow-sm shadow-indigo-500/20">
                <div className="w-full h-full bg-[#0d0f18] rounded-[7px] flex items-center justify-center">
                  <span className="font-display font-bold text-base text-white group-hover:scale-105 transition-transform">
                    B
                  </span>
                </div>
              </div>
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                BORROW A LIFE
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => onNavigate('discover')}
              className={`transition-colors relative py-1 text-xs uppercase tracking-wider ${
                currentTab === 'discover'
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Discover
              {currentTab === 'discover' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => onNavigate('daily-drop')}
              className={`transition-colors relative py-1 text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                currentTab === 'daily-drop'
                  ? 'text-sky-300 font-semibold'
                  : 'text-slate-400 hover:text-sky-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Daily Drop
              {currentTab === 'daily-drop' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-sky-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => onNavigate('passport')}
              className={`transition-colors relative py-1 text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                currentTab === 'passport'
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Life Passport
              {currentTab === 'passport' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => onNavigate('admin')}
              className={`transition-colors relative py-1 text-xs uppercase tracking-wider ${
                currentTab === 'admin'
                  ? 'text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Admin
              {currentTab === 'admin' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-400 rounded-full" />
              )}
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions + audio & active indicator */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Ambient Sound Mute/Unmute */}
            <button
              onClick={handleAudioToggle}
              title={isMuted ? 'Unmute Ambient Audio' : 'Mute Ambient Audio'}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Toggle sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Fictional Wallet balance */}
            <button
              onClick={onOpenWallet}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-xs font-mono tabular-nums text-slate-300 transition-colors"
              title="Your Borrow A Life Balance"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>₹{userProfile.walletBalance}</span>
            </button>

            {/* Active Life Session beacon if user is currently experiencing a life */}
            {activeSession && (
              <button
                onClick={() => onNavigate('live-mode')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 text-xs font-medium animate-pulse hover:bg-indigo-500/30 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                <span className="hidden sm:inline">Active Life</span>
                <Play className="w-3 h-3 fill-current" />
              </button>
            )}

            {/* Primary Action: Create Your Life */}
            <button
              onClick={onOpenCreate}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold tracking-wide transition-all shadow-sm shadow-indigo-600/30"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Life</span>
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={() => onNavigate('profile')}
              className={`p-0.5 rounded-full border transition-all ${
                currentTab === 'profile'
                  ? 'border-indigo-400 ring-2 ring-indigo-500/30'
                  : 'border-white/10 hover:border-white/30'
              }`}
              title="Profile & Lives"
            >
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-7 h-7 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (≤ 15% viewport height cap) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#090a0f]/95 backdrop-blur-xl px-2 py-2">
        <div className="grid grid-cols-5 items-center text-center">
          <button
            onClick={() => onNavigate('landing')}
            className={`flex flex-col items-center gap-1 py-1 ${
              currentTab === 'landing' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">Home</span>
          </button>

          <button
            onClick={() => onNavigate('discover')}
            className={`flex flex-col items-center gap-1 py-1 ${
              currentTab === 'discover' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">Discover</span>
          </button>

          <button
            onClick={onOpenCreate}
            className="flex flex-col items-center gap-1 py-1 text-indigo-400"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/50">
              <PlusCircle className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold">Create</span>
          </button>

          <button
            onClick={() => onNavigate('passport')}
            className={`flex flex-col items-center gap-1 py-1 ${
              currentTab === 'passport' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">Passport</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`flex flex-col items-center gap-1 py-1 ${
              currentTab === 'profile' ? 'text-indigo-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">Profile</span>
          </button>
        </div>
      </div>
    </>
  );
};
