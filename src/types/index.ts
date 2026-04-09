export interface User {
  fname: string;
  lname: string;
  email: string;
  sport: string;
  level: string;
  program: string;
}

export interface Program {
  name: string;
  desc: string;
  meta: string;
  level: 'amateur' | 'pro';
  sport: 'running' | 'swimming' | 'cycling';
  icon: string;
  bg: string;
  weeks: number;
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
