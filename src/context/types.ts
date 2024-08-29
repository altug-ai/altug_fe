import { Current, FormIndex } from '@/features/Onboarding/lib/types';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';

export type AuthProps = {
  jwt?: string | null;
  profileId?: number;
  loading?: boolean;
  profileEmail?: string;
  setRole: Dispatch<SetStateAction<string>>;
  role: string;
  userId?: number;
  setRoleId: Dispatch<any>;
  roleId: any;
  profile?: Profile;
  coachIds: Set<unknown>;
  setCoachIds: Dispatch<SetStateAction<Set<unknown>>>;
  playerIds: Set<unknown>;
  setPlayerIds: Dispatch<SetStateAction<Set<unknown>>>;
  setPosition: Dispatch<SetStateAction<string>>;
  position: string;
  setStats: Dispatch<
    SetStateAction<{
      shooting: number;
      defense: number;
      strength: number;
      stamina: number;
      passing: number;
      accuracy: number;
    }>
  >;
  stats: {
    shooting: number;
    defense: number;
    strength: number;
    stamina: number;
    passing: number;
    accuracy: number;
  };
  reload: boolean;
  setReload: Dispatch<SetStateAction<boolean>>;
  reloadRead: boolean;
  setReloadRead: Dispatch<SetStateAction<boolean>>;
  setPublished: Dispatch<any>;
  published: any;
  user?: UserData;
  setUser?: Dispatch<SetStateAction<UserData | undefined>>;
  setProfile?: Dispatch<SetStateAction<Profile | undefined>>;
  pref?: PreferenceSettings;
  setPref?: Dispatch<SetStateAction<PreferenceSettings | undefined>>;
  setLeagues: Dispatch<SetStateAction<any[]>>;
  leagues: any[];
  profilepic?: string;
  tier?: Tier;
  setTier?: Dispatch<SetStateAction<Tier>>;
  setUnRead: Dispatch<SetStateAction<number>>;
  unRead: number;
  messagesLeft: number;
  coaches?: Coaches;
  setCoaches: Dispatch<SetStateAction<Coaches | undefined>>;
  players?: Players;
  setPlayers: Dispatch<SetStateAction<Players | undefined>>;
  handleSubscribe: (url?: string, chatId?: string) => Promise<void>;
  setMessagesLeft: Dispatch<SetStateAction<number>>;
  country: string;
  setCountry: Dispatch<SetStateAction<string>>;
  setTotalPoint: Dispatch<SetStateAction<string>>;
  totalPoint: string;
};

export type LeaderboardProps = {
  setCountry: Dispatch<SetStateAction<string>>;
  country: string;
  setleague: Dispatch<SetStateAction<string>>;
  league: string;
};

export type Coaches = {
  data?: Coach[];
};

export type Players = {
  data?: Player[];
};

interface Player {
  attributes?: {
    name?: string;
    height?: string;
    weight?: string;
    age?: string;
    point?: number;
    foot?: string;
    club?: {
      data?: {
        attributes?: {
          name?: string;
          logo?: {
            data?: {
              attributes?: {
                url?: string;
              };
              id?: number;
            };
          };
        };
        id?: number;
      };
    };
    pic_url?: string;
    profile?: {
      data?: {
        attributes?: {
          url: string;
        };

        id?: number;
      };
    };
  };
  id: number;
}

// Define the Coach interface (optional)
interface Coach {
  attributes?: {
    name?: string;
    height?: string;
    weight?: string;
    age?: string;
    point?: number;
    club?: {
      data?: {
        attributes?: {
          name?: string;
          logo?: {
            data?: {
              attributes?: {
                url?: string;
              };
              id?: number;
            };
          };
        };
        id?: number;
      };
    };
    pic_url?: string;
    profile?: {
      data?: {
        attributes?: {
          url: string;
        };

        id?: number;
      };
    };
  };
  id: number;
}

export interface PreferenceSettings {
  data?: {
    attributes: {
      age?: string | null;
      client_profile?: Profile;
      experience?: string | null;
      position?: string | null;
      team_participation?: any;
      training_frequency?: string | null;
      goals?: string[] | null;
      favorite_footballers?: any;
      content_preference?: string[] | null;
    };
    id?: number;
  };
}

interface ProfileAttributes {
  username?: string | null;
  DOB?: string | null;
  height?: string | null;
  weight?: string | null;
  foot?: ['right', 'left', 'both'] | null;
  rank?: string | null;
  preference?: any;
  role?: ['player', 'coach'];
  profile_pic?: any;
  country?: string | null;
}

export interface UserData {
  data?: {
    attributes: {
      createdAt?: string | null;
      email?: string | null;
      name?: string | null;
      username?: string | null;
      phone?: string | null;
    };
    id?: number;
  };
}

export type Profile = {
  id: number;
  attributes: ProfileAttributes;
};

export type Tier = undefined | '' | 'free' | 'premium';
export type CoachProps = {
  coachLoader: boolean;
  setCoachLoader: Dispatch<SetStateAction<boolean>>;
  audioEnabled: boolean;
  setAudioEnabled: Dispatch<SetStateAction<boolean>>;
};

export type ChallengeProps = {
  challengeLoader: boolean;
  setChallengeLoader: Dispatch<SetStateAction<boolean>>;
  recording: boolean;
  setRecording: Dispatch<SetStateAction<boolean>>;
  videoBlob: any;
  setChal: Dispatch<any>;
  chal: any;
  setVideoBlob: Dispatch<SetStateAction<any>>;
  videoUrl: string;
  setVideoUrl: Dispatch<SetStateAction<string>>;
  urlVideo: string;
  setUrlVideo: Dispatch<SetStateAction<string>>;
  videoRef: MutableRefObject<any>;
  mediaRecorderRef: MutableRefObject<any>;
  handleStartCaptureClick: () => void;
  handleStopCaptureClick: () => void;
  pauseRecording: () => void;
  setGoal: Dispatch<SetStateAction<string>>;
  goal: string;
  resumeRecording: () => void;
  userPoint: string;
  paused: boolean;
  setPaused: Dispatch<SetStateAction<boolean>>;
  route: number;
  setRoute: Dispatch<SetStateAction<number>>;
  error: boolean;
  point: string;
  setPoint: Dispatch<SetStateAction<string>>;
  stat: string;
  setStat: Dispatch<SetStateAction<string>>;
  header: string;
  setHeader: Dispatch<SetStateAction<string>>;
  descriptionn: string;
  setDescriptionn: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<boolean>>;
  handleUploadChallengeVideo: (point: string) => Promise<void>;
  handleShare: (id: number) => Promise<void>;
  facingMode: string;
  setFacingMode: Dispatch<SetStateAction<string>>;
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;
  progress: number;
  response: any[];
  setResponse: Dispatch<SetStateAction<any[]>>;
  handleChat: () => Promise<void>;
  setProgress: Dispatch<SetStateAction<number>>;
  refetch: boolean;
  score: any;
  setScore: Dispatch<any>;
  explanation: string;
  setExplanation: Dispatch<SetStateAction<string>>;
  setRefetch: Dispatch<SetStateAction<boolean>>;
};

export type Stat = {
  accuracy: number;
  shooting: number;
  defense: number;
  strength: number;
  stamina: number;
  passing: number;
};

export type OnboardingProps = {
  loading: boolean;
  form: {
    age: string;
    experience: string;
    position: string;
    team_participation: null;
    training_frequency: string;
    goals: string[];
    favorite_footballers: string;
    content_preference: string[];
  };
  setForm: Dispatch<
    SetStateAction<{
      age: string;
      experience: string;
      position: string;
      team_participation: null;
      training_frequency: string;
      goals: string[];
      favorite_footballers: string;
      content_preference: string[];
    }>
  >;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  current: Current | undefined;
  setCurrent: Dispatch<SetStateAction<Current | undefined>>;
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  load: boolean;
  updatePreferences: () => Promise<void>;
  length: number;
  enteredQuestions: any[];
  setEnteredQuestions: Dispatch<SetStateAction<any[]>>;
  formIndex: FormIndex;
  setFormIndex: Dispatch<SetStateAction<FormIndex>>;
};
