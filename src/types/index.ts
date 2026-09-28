export type DurationType = '30 minutes' | '2 hours' | 'Half day' | 'Full day' | 'Weekend';

export type MoodType =
  | 'Peaceful'
  | 'Chaotic'
  | 'Adventurous'
  | 'Productive'
  | 'Creative'
  | 'Social'
  | 'Luxurious'
  | 'Mysterious'
  | 'Challenging';

export type DifficultyType = 'Easy' | 'Medium' | 'Hard' | 'Extreme';

export type CategoryType =
  | 'Student Life'
  | 'Creative Life'
  | 'Fitness Life'
  | 'Career Life'
  | 'Luxury Life'
  | 'Minimalist Life'
  | 'Travel Life'
  | 'Cultural Life'
  | 'Digital Detox'
  | 'Weird & Experimental'
  | 'Self-Discovery'
  | 'Night Life'
  | 'Slow Living'
  | 'Productivity'
  | 'Adventure';

export interface Creator {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  verified?: boolean;
  livesCreatedCount: number;
}

export interface TimelineActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  advice: string;
  challenge: string;
  durationMinutes: number;
  ambientSoundHint?: 'rain' | 'focus-drone' | 'cafe' | 'morning-birds' | 'silence';
}

export interface LifeTwist {
  id: string;
  triggerMinute: number;
  title: string;
  description: string;
  actionText: string;
}

export interface CommunitySteal {
  id: string;
  user: string;
  avatar: string;
  stoleText: string;
  perspectiveChange: 'Not really' | 'A little' | 'Surprisingly' | 'Completely';
  createdAt: string;
}

export interface LifeExperience {
  id: string;
  title: string;
  tagline: string;
  description: string;
  creator: Creator;
  duration: DurationType;
  mood: MoodType;
  difficulty: DifficultyType;
  category: CategoryType;
  price: number; // in INR (0 = Free)
  experiencedCount: number;
  rating: number;
  coverImage: string;
  timeline: TimelineActivity[];
  lifeTwists: LifeTwist[];
  reflectionQuestions: string[];
  whatPeopleStole: CommunitySteal[];
  remixFrom?: {
    originalId: string;
    originalTitle: string;
    originalCreator: string;
  };
  featuredToday?: boolean;
  createdAt: string;
}

export interface UserMoodAssessment {
  emoji: string;
  label: string;
  score: number; // 0 - 100
}

export interface ActiveLifeSession {
  experienceId: string;
  startedAt: number;
  currentActivityIndex: number;
  completedActivityIds: string[];
  preMood: UserMoodAssessment;
  revealedTwists: string[];
  currentMoodSlider: number;
  secondsRemainingInCurrent: number;
  isPaused: boolean;
}

export interface PassportStamp {
  id: string;
  experienceId: string;
  title: string;
  creatorName: string;
  category: CategoryType;
  mood: MoodType;
  completedAt: string;
  hoursSpent: number;
  stolenHabit: string;
  perspectiveRating: 'Not really' | 'A little' | 'Surprisingly' | 'Completely';
  preScore: number;
  postScore: number;
  twistsSurvived: number;
  stampColor: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  walletBalance: number; // In INR
  followingCreators: string[];
  savedLives: string[];
  customCreatedLives: LifeExperience[];
  completedStamps: PassportStamp[];
}
