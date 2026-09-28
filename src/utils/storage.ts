import { LifeExperience, UserProfile, ActiveLifeSession, PassportStamp, CommunitySteal } from '../types';
import { INITIAL_LIVES } from '../data/mockLives';

const STORAGE_KEYS = {
  USER_PROFILE: 'borrow_life_user_profile',
  CUSTOM_LIVES: 'borrow_life_custom_lives',
  ACTIVE_SESSION: 'borrow_life_active_session',
  SAVED_LIVES: 'borrow_life_saved_lives',
  FOLLOWED_CREATORS: 'borrow_life_followed_creators',
  STOLEN_REVIEWS: 'borrow_life_stolen_reviews',
  WALLET_BALANCE: 'borrow_life_wallet_balance',
};

// Initial starter passport stamps to show rich passport history right away!
const INITIAL_PASSPORT_STAMPS: PassportStamp[] = [
  {
    id: 'stamp-init-1',
    experienceId: 'become-a-street-photographer',
    title: 'Tokyo Street Eyes',
    creatorName: 'Kenji Sato',
    category: 'Cultural Life',
    mood: 'Mysterious',
    completedAt: '2026-09-22',
    hoursSpent: 2,
    stolenHabit: 'Walking without headphones to hear the city pulse.',
    perspectiveRating: 'Completely',
    preScore: 48,
    postScore: 88,
    twistsSurvived: 2,
    stampColor: '#818cf8',
  },
  {
    id: 'stamp-init-2',
    experienceId: 'a-sunday-without-your-phone',
    title: 'Offline Sanctuary',
    creatorName: 'Maya Chen',
    category: 'Digital Detox',
    mood: 'Peaceful',
    completedAt: '2026-09-15',
    hoursSpent: 8,
    stolenHabit: 'Phone stays in desk drawer during dinner and bed.',
    perspectiveRating: 'Surprisingly',
    preScore: 35,
    postScore: 82,
    twistsSurvived: 1,
    stampColor: '#34d399',
  },
  {
    id: 'stamp-init-3',
    experienceId: 'luxury-day-on-student-budget',
    title: 'Velvet on a Dime',
    creatorName: 'Rohan Verma',
    category: 'Luxury Life',
    mood: 'Luxurious',
    completedAt: '2026-09-08',
    hoursSpent: 4,
    stolenHabit: 'Walking into grand lobbies without apologizing for existing.',
    perspectiveRating: 'Completely',
    preScore: 50,
    postScore: 92,
    twistsSurvived: 1,
    stampColor: '#f43f5e',
  },
];

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-primary-me',
  name: 'Alex Rivera',
  handle: '@alex.explores',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  bio: 'Borrowing minds, routines, and days. 3 lives completed this month. Chasing unexpected friction.',
  walletBalance: 450,
  followingCreators: ['@kenji.streets', '@aarav.runs'],
  savedLives: ['the-5-am-athlete', 'live-like-an-artist'],
  customCreatedLives: [],
  completedStamps: INITIAL_PASSPORT_STAMPS,
};

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading user profile:', e);
  }
  return DEFAULT_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.warn('Error saving user profile:', e);
  }
}

export function getAllLives(): LifeExperience[] {
  let custom: LifeExperience[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_LIVES);
    if (raw) {
      custom = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading custom lives:', e);
  }
  return [...custom, ...INITIAL_LIVES];
}

export function getLifeById(id: string): LifeExperience | undefined {
  const all = getAllLives();
  return all.find((l) => l.id === id);
}

export function addCustomLife(newLife: LifeExperience): void {
  try {
    const allCustomRaw = localStorage.getItem(STORAGE_KEYS.CUSTOM_LIVES);
    const customList: LifeExperience[] = allCustomRaw ? JSON.parse(allCustomRaw) : [];
    customList.unshift(newLife);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_LIVES, JSON.stringify(customList));

    const profile = getUserProfile();
    profile.customCreatedLives.unshift(newLife);
    saveUserProfile(profile);
  } catch (e) {
    console.warn('Error adding custom life:', e);
  }
}

export function getActiveSession(): ActiveLifeSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading active session:', e);
  }
  return null;
}

export function saveActiveSession(session: ActiveLifeSession | null): void {
  try {
    if (!session) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    } else {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
    }
  } catch (e) {
    console.warn('Error saving active session:', e);
  }
}

export function addPassportStamp(stamp: PassportStamp): void {
  const profile = getUserProfile();
  // Avoid duplicate stamps for same session ID
  profile.completedStamps = [stamp, ...profile.completedStamps.filter((s) => s.id !== stamp.id)];
  saveUserProfile(profile);
}

export function toggleSaveLife(lifeId: string): boolean {
  const profile = getUserProfile();
  const exists = profile.savedLives.includes(lifeId);
  if (exists) {
    profile.savedLives = profile.savedLives.filter((id) => id !== lifeId);
  } else {
    profile.savedLives.push(lifeId);
  }
  saveUserProfile(profile);
  return !exists;
}

export function toggleFollowCreator(handle: string): boolean {
  const profile = getUserProfile();
  const exists = profile.followingCreators.includes(handle);
  if (exists) {
    profile.followingCreators = profile.followingCreators.filter((h) => h !== handle);
  } else {
    profile.followingCreators.push(handle);
  }
  saveUserProfile(profile);
  return !exists;
}

export function deductWallet(amount: number): boolean {
  const profile = getUserProfile();
  if (profile.walletBalance < amount) {
    return false;
  }
  profile.walletBalance -= amount;
  saveUserProfile(profile);
  return true;
}

export function addWalletCredit(amount: number): void {
  const profile = getUserProfile();
  profile.walletBalance += amount;
  saveUserProfile(profile);
}

export function addCommunitySteal(lifeId: string, steal: CommunitySteal): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STOLEN_REVIEWS);
    const map: Record<string, CommunitySteal[]> = raw ? JSON.parse(raw) : {};
    if (!map[lifeId]) {
      map[lifeId] = [];
    }
    map[lifeId].unshift(steal);
    localStorage.setItem(STORAGE_KEYS.STOLEN_REVIEWS, JSON.stringify(map));
  } catch (e) {
    console.warn('Error storing community steal:', e);
  }
}

export function getCommunityStealsForLife(lifeId: string, defaultSteals: CommunitySteal[] = []): CommunitySteal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STOLEN_REVIEWS);
    if (raw) {
      const map: Record<string, CommunitySteal[]> = JSON.parse(raw);
      if (map[lifeId]) {
        return [...map[lifeId], ...defaultSteals];
      }
    }
  } catch (e) {
    console.warn('Error getting steals:', e);
  }
  return defaultSteals;
}
