import type { Program, Coach } from '../types';

export const programs: Program[] = [
  { name: '5K Starter Plan',            desc: 'Build your aerobic base and cross your first finish line with confidence.',           meta: '8 weeks · 3 days/week',  level: 'amateur', sport: 'running',  icon: '🏃', bg: '#E6F1FB', weeks: 8  },
  { name: 'Half-Marathon Prep',          desc: 'A balanced 10-week journey to your first half-marathon. Structured and achievable.',  meta: '10 weeks · 4 days/week', level: 'amateur', sport: 'running',  icon: '🏃', bg: '#E1F5EE', weeks: 10 },
  { name: 'Marathon Base Build',         desc: 'High-volume periodised training for runners chasing the full 42km.',                  meta: '16 weeks · 5 days/week', level: 'pro',     sport: 'running',  icon: '🏃', bg: '#EEEDFE', weeks: 16 },
  { name: 'Speed & Intervals',           desc: 'Raise your lactate threshold and shave minutes off your race pace.',                  meta: '12 weeks · 4 days/week', level: 'pro',     sport: 'running',  icon: '🏃', bg: '#FAEEDA', weeks: 12 },
  { name: 'Beginner Swim Foundations',   desc: 'Build technique and water confidence over 6 structured weeks.',                       meta: '6 weeks · 3 days/week',  level: 'amateur', sport: 'swimming', icon: '🏊', bg: '#E6F1FB', weeks: 6  },
  { name: 'Stroke Technique Intensive',  desc: 'Drill-focused program to refine freestyle and backstroke efficiency.',                meta: '4 weeks · 4 days/week',  level: 'amateur', sport: 'swimming', icon: '🏊', bg: '#FAEEDA', weeks: 4  },
  { name: 'Open Water Racing',           desc: 'Advanced race tactics, sighting, and drafting for competitive swimmers.',             meta: '8 weeks · 5 days/week',  level: 'pro',     sport: 'swimming', icon: '🏊', bg: '#E1F5EE', weeks: 8  },
  { name: 'Beginner Road Cycling',       desc: 'Get comfortable on the saddle and build your aerobic engine from zero.',              meta: '6 weeks · 3 days/week',  level: 'amateur', sport: 'cycling',  icon: '🚴', bg: '#E1F5EE', weeks: 6  },
  { name: 'Triathlon Ride Phase',        desc: 'Bike-specific training block for athletes targeting 70.3 or full Ironman.',           meta: '8 weeks · 4 days/week',  level: 'pro',     sport: 'cycling',  icon: '🚴', bg: '#FAEEDA', weeks: 8  },
  { name: 'Elite Cycling Power Block',   desc: 'Raise your FTP and peak for your target race with this periodised block.',            meta: '12 weeks · 5 days/week', level: 'pro',     sport: 'cycling',  icon: '🚴', bg: '#EEEDFE', weeks: 12 },
];

export const coaches: Coach[] = [
  { initials: 'SC', name: 'Sara Chen',     sport: 'Long-distance running',  tags: ['Marathon','Endurance','Nutrition','Trail'],        rating: 4.9, athletes: 134, bio: 'Former Olympic marathon qualifier with 12 years coaching experience. Specialises in long-distance base building and race-day strategy.',      avatarBg: '#E1F5EE', avatarColor: '#085041' },
  { initials: 'MR', name: 'Marco Reyes',   sport: 'Competitive swimming',   tags: ['Stroke tech','Open water','Speed'],                rating: 4.8, athletes: 89,  bio: 'National-level swimmer turned coach. Expert in stroke biomechanics and open-water race preparation for all distances.',                         avatarBg: '#E6F1FB', avatarColor: '#0C447C' },
  { initials: 'LB', name: 'Lena Bauer',    sport: 'Cycling & triathlon',    tags: ['Triathlon','Power','Recovery','Periodisation'],    rating: 4.9, athletes: 107, bio: 'Ironman finisher and certified cycling coach. Focuses on power-based training and periodisation for multi-sport athletes.',                      avatarBg: '#FAEEDA', avatarColor: '#633806' },
  { initials: 'JP', name: 'James Park',    sport: 'Sprint & track running', tags: ['100m–400m','Speed','Strength'],                   rating: 4.7, athletes: 62,  bio: 'Ex-collegiate sprinter with sports physiology background. Designs explosive speed programs for competitive track athletes.',                      avatarBg: '#EEEDFE', avatarColor: '#3C3489' },
  { initials: 'AK', name: 'Aiko Kimura',   sport: 'Open water swimming',    tags: ['Sighting','Pacing','Drafting'],                   rating: 4.8, athletes: 74,  bio: 'Open water specialist coaching athletes from 1.5km races all the way to channel crossings.',                                                       avatarBg: '#FBEAF0', avatarColor: '#72243E' },
  { initials: 'DM', name: 'Diego Martín',  sport: 'Road cycling',           tags: ['Endurance','Climbing','FTP'],                     rating: 4.9, athletes: 91,  bio: 'Road cyclist and data-driven coach. Specialises in FTP improvement, race peaking, and altitude training blocks.',                                 avatarBg: '#EAF3DE', avatarColor: '#27500A' },
];

export const programsBySport: Record<string, Program[]> = {
  running:  programs.filter(p => p.sport === 'running'),
  swimming: programs.filter(p => p.sport === 'swimming'),
  cycling:  programs.filter(p => p.sport === 'cycling'),
};
