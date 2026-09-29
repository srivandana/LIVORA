import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DiscoverPage } from './components/DiscoverPage';
import { LifeDetailPage } from './components/LifeDetailPage';
import { LiveExperienceMode } from './components/LiveExperienceMode';
import { PreExperienceMoodModal } from './components/PreExperienceMoodModal';
import { PostExperienceModal } from './components/PostExperienceModal';
import { LifePassport } from './components/LifePassport';
import { CreateLifeModal } from './components/CreateLifeModal';
import { RemixLifeModal } from './components/RemixLifeModal';
import { ProfilePage } from './components/ProfilePage';
import { AdminDashboard } from './components/AdminDashboard';
import { ShareModal } from './components/ShareModal';
import {
  LifeExperience,
  ActiveLifeSession,
  UserProfile,
  UserMoodAssessment,
  PassportStamp,
} from './types';
import {
  getAllLives,
  getUserProfile,
  saveUserProfile,
  getActiveSession,
  saveActiveSession,
  addPassportStamp,
  toggleSaveLife,
  toggleFollowCreator,
  addWalletCredit,
  deductWallet,
  addCustomLife,
  addCommunitySteal,
} from './utils/storage';
import { sound } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [lives, setLives] = useState<LifeExperience[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(getUserProfile());
  const [selectedLifeId, setSelectedLifeId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveLifeSession | null>(null);

  // Modals state
  const [lifeToStart, setLifeToStart] = useState<LifeExperience | null>(null);
  const [isFinishingSession, setIsFinishingSession] = useState<boolean>(false);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [lifeToRemix, setLifeToRemix] = useState<LifeExperience | null>(null);
  const [lifeToShare, setLifeToShare] = useState<LifeExperience | null>(null);

  // Load lives and active session on mount
  useEffect(() => {
    const loadedLives = getAllLives();
    setLives(loadedLives);

    const savedSession = getActiveSession();
    if (savedSession) {
      setActiveSession(savedSession);
    }

    const profile = getUserProfile();
    setUserProfile(profile);

    // Check query params if any
    const urlParams = new URLSearchParams(window.location.search);
    const lifeParam = urlParams.get('life');
    if (lifeParam) {
      setSelectedLifeId(lifeParam);
      setCurrentTab('life-detail');
    }
  }, []);

  const handleNavigate = (tab: string, param?: string) => {
    if (tab === 'daily-drop') {
      const daily = lives.find((l) => l.featuredToday) || lives[2] || lives[0];
      if (daily) {
        setSelectedLifeId(daily.id);
        setCurrentTab('life-detail');
      }
      return;
    }
    if (param) {
      setSelectedLifeId(param);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLife = (lifeId: string) => {
    setSelectedLifeId(lifeId);
    setCurrentTab('life-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pre-Experience start calibration modal trigger
  const handleOpenStartExperience = (life: LifeExperience) => {
    setLifeToStart(life);
  };

  // Confirm start experience -> deduct wallet if paid, create session, activate Live Mode
  const handleConfirmStartExperience = (
    mood: UserMoodAssessment,
    ambientSound: string
  ) => {
    if (!lifeToStart) return;

    if (lifeToStart.price > 0) {
      const success = deductWallet(lifeToStart.price);
      if (!success) {
        alert('Insufficient wallet funds.');
        return;
      }
      setUserProfile(getUserProfile());
    }

    const newSession: ActiveLifeSession = {
      experienceId: lifeToStart.id,
      startedAt: Date.now(),
      currentActivityIndex: 0,
      completedActivityIds: [],
      preMood: mood,
      revealedTwists: [],
      currentMoodSlider: mood.score,
      secondsRemainingInCurrent: 600, // 10 minutes default
      isPaused: false,
    };

    saveActiveSession(newSession);
    setActiveSession(newSession);
    setLifeToStart(null);
    setCurrentTab('live-mode');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update active session state
  const handleUpdateSession = (updated: ActiveLifeSession) => {
    setActiveSession(updated);
    saveActiveSession(updated);
  };

  // Complete all moments -> trigger post experience modal
  const handleCompleteAllActivities = () => {
    sound.stopAmbient();
    setIsFinishingSession(true);
  };

  // Finish Post Experience & Stamp Passport
  const handleFinishAndStamp = (
    stamp: PassportStamp,
    stealText: string,
    perspective: any
  ) => {
    addPassportStamp(stamp);

    // Save reflection to community steal feed if provided
    if (stealText.trim() && activeSession) {
      addCommunitySteal(activeSession.experienceId, {
        id: `steal-${Date.now()}`,
        user: userProfile.name,
        avatar: userProfile.avatar,
        stoleText: stealText,
        perspectiveChange: perspective,
        createdAt: 'Just now',
      });
    }

    // Clear active session
    saveActiveSession(null);
    setActiveSession(null);
    setIsFinishingSession(false);

    // Refresh profile state
    const refreshedProfile = getUserProfile();
    setUserProfile(refreshedProfile);

    // Refresh lives to reflect new community steals
    setLives(getAllLives());

    // Navigate to Passport to admire new stamp!
    setCurrentTab('passport');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save/Bookmark toggle
  const handleToggleSave = (lifeId: string) => {
    toggleSaveLife(lifeId);
    setUserProfile(getUserProfile());
  };

  // Follow Creator toggle
  const handleToggleFollow = (handle: string) => {
    toggleFollowCreator(handle);
    setUserProfile(getUserProfile());
  };

  // Add Wallet Funds
  const handleAddWalletFunds = (amount: number) => {
    addWalletCredit(amount);
    setUserProfile(getUserProfile());
  };

  // Publish newly created custom life
  const handlePublishCustomLife = (newLife: LifeExperience) => {
    addCustomLife(newLife);
    setLives(getAllLives());
    setUserProfile(getUserProfile());
    setIsCreateOpen(false);
    setSelectedLifeId(newLife.id);
    setCurrentTab('life-detail');
  };

  // Publish remixed life
  const handlePublishRemix = (remixedLife: LifeExperience) => {
    addCustomLife(remixedLife);
    setLives(getAllLives());
    setUserProfile(getUserProfile());
    setLifeToRemix(null);
    setSelectedLifeId(remixedLife.id);
    setCurrentTab('life-detail');
  };

  const selectedLife = lives.find((l) => l.id === selectedLifeId) || lives[0];
  const activeSessionLife = activeSession
    ? lives.find((l) => l.id === activeSession.experienceId) || lives[0]
    : null;
  const dailyDropLife = lives.find((l) => l.featuredToday) || lives[2] || lives[0];

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Global Top Navbar adhering to 3-zone contract */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        activeSession={activeSession}
        userProfile={userProfile}
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenWallet={() => setCurrentTab('profile')}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onExplore={() => handleNavigate('discover')}
            onCreate={() => setIsCreateOpen(true)}
            onSelectLife={handleSelectLife}
            featuredLives={lives}
            dailyDropLife={dailyDropLife}
          />
        )}

        {currentTab === 'discover' && (
          <DiscoverPage
            lives={lives}
            onSelectLife={handleSelectLife}
            savedLifeIds={userProfile.savedLives}
            onToggleSave={handleToggleSave}
          />
        )}

        {currentTab === 'life-detail' && selectedLife && (
          <LifeDetailPage
            life={selectedLife}
            onBack={() => handleNavigate('discover')}
            onStartExperience={handleOpenStartExperience}
            onRemixLife={(l) => setLifeToRemix(l)}
            onShare={(l) => setLifeToShare(l)}
            isSaved={userProfile.savedLives.includes(selectedLife.id)}
            onToggleSave={handleToggleSave}
            isCreatorFollowed={userProfile.followingCreators.includes(
              selectedLife.creator.handle
            )}
            onToggleFollowCreator={handleToggleFollow}
          />
        )}

        {currentTab === 'live-mode' && activeSession && activeSessionLife && (
          <LiveExperienceMode
            life={activeSessionLife}
            session={activeSession}
            onUpdateSession={handleUpdateSession}
            onCompleteExperience={handleCompleteAllActivities}
            onExitLiveMode={() => handleNavigate('discover')}
          />
        )}

        {currentTab === 'passport' && (
          <LifePassport
            userProfile={userProfile}
            onExploreMore={() => handleNavigate('discover')}
            onSelectLife={handleSelectLife}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            userProfile={userProfile}
            allLives={lives}
            onSelectLife={handleSelectLife}
            onOpenCreate={() => setIsCreateOpen(true)}
            onOpenPassport={() => handleNavigate('passport')}
            onAddWalletFunds={handleAddWalletFunds}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard lives={lives} onSelectLife={handleSelectLife} />
        )}
      </main>

      {/* MODALS */}

      {/* Pre-Experience Calibration Modal */}
      {lifeToStart && (
        <PreExperienceMoodModal
          life={lifeToStart}
          onClose={() => setLifeToStart(null)}
          onConfirmStart={handleConfirmStartExperience}
          walletBalance={userProfile.walletBalance}
        />
      )}

      {/* Post-Experience Reflection & Passport Stamper Modal */}
      {isFinishingSession && activeSession && activeSessionLife && (
        <PostExperienceModal
          life={activeSessionLife}
          session={activeSession}
          onFinishAndStamp={handleFinishAndStamp}
        />
      )}

      {/* Create Life Studio Modal (with AI Life Builder) */}
      {isCreateOpen && (
        <CreateLifeModal
          onClose={() => setIsCreateOpen(false)}
          onPublish={handlePublishCustomLife}
          userProfile={userProfile}
        />
      )}

      {/* Remix Life Modal */}
      {lifeToRemix && (
        <RemixLifeModal
          originalLife={lifeToRemix}
          onClose={() => setLifeToRemix(null)}
          onPublishRemix={handlePublishRemix}
          userProfile={userProfile}
        />
      )}

      {/* Share Experience Pass Modal */}
      {lifeToShare && (
        <ShareModal
          life={lifeToShare}
          onClose={() => setLifeToShare(null)}
        />
      )}
    </div>
  );
}
