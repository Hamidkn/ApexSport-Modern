export interface User {
  fname: string;
  lname: string;
  email: string;
  sport: string;
  level: string;
  program: string;
}

export type SportId =
  | 'running' | 'swimming' | 'cycling'
  | 'fitness-men' | 'fitness-women' | 'prenatal'
  | 'yoga' | 'hiit' | 'strength';

export interface Program {
  name: string;
  desc: string;
  meta: string;
  level: 'amateur' | 'pro' | 'all';
  sport: SportId;
  icon: string;
  bg: string;
  weeks: number;
  category: 'endurance' | 'fitness' | 'wellness' | 'strength';
  forWhom?: string;
}

export interface Coach {
  initials: string;
  name: string;
  sport: string;
  tags: string[];
  rating: number;
  athletes: number;
  bio: string;
  avatarBg: string;
  avatarColor: string;
}

export interface ChatMessage {
  id: string;
  from: 'me' | 'coach';
  text: string;
  ts: string;
  day?: string;
}

export interface Conversation {
  id: string;
  initials: string;
  name: string;
  role: string;
  bg: string;
  color: string;
  preview: string;
  time: string;
  unread: number;
  online: boolean;
  messages: ChatMessage[];
}

export interface Notification {
  id: string;
  type: 'message' | 'session' | 'pb' | 'coach' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
  convId?: string;
}

export interface SignupState {
  step: number;
  fname: string;
  lname: string;
  email: string;
  password: string;
  goal: string;
  sport: string;
  level: string;
  program: string;
}
