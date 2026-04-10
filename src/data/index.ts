import type { Program, Coach, Conversation, Notification } from '../types';

export const programs: Program[] = [
  // ── RUNNING ──
  { name: '5K Starter Plan',           desc: 'Build your aerobic base and cross your first finish line with confidence.',          meta: '8 weeks · 3 days/week',  level: 'amateur', sport: 'running',       icon: '🏃', bg: '#EFF6FF', weeks: 8,  category: 'endurance' },
  { name: 'Half-Marathon Prep',         desc: 'A balanced 10-week journey to your first half-marathon. Structured and achievable.', meta: '10 weeks · 4 days/week', level: 'amateur', sport: 'running',       icon: '🏃', bg: '#EFF6FF', weeks: 10, category: 'endurance' },
  { name: 'Marathon Base Build',        desc: 'High-volume periodised training for runners chasing the full 42 km.',                meta: '16 weeks · 5 days/week', level: 'pro',     sport: 'running',       icon: '🏃', bg: '#EFF6FF', weeks: 16, category: 'endurance' },
  { name: 'Speed & Intervals',          desc: 'Raise your lactate threshold and shave minutes off your race pace.',                 meta: '12 weeks · 4 days/week', level: 'pro',     sport: 'running',       icon: '🏃', bg: '#EFF6FF', weeks: 12, category: 'endurance' },
  // ── SWIMMING ──
  { name: 'Beginner Swim Foundations',  desc: 'Build technique and water confidence over 6 structured weeks.',                      meta: '6 weeks · 3 days/week',  level: 'amateur', sport: 'swimming',      icon: '🏊', bg: '#F0F9FF', weeks: 6,  category: 'endurance' },
  { name: 'Stroke Technique Intensive', desc: 'Drill-focused program to refine freestyle and backstroke efficiency.',               meta: '4 weeks · 4 days/week',  level: 'amateur', sport: 'swimming',      icon: '🏊', bg: '#F0F9FF', weeks: 4,  category: 'endurance' },
  { name: 'Open Water Racing',          desc: 'Advanced race tactics, sighting, and drafting for competitive swimmers.',            meta: '8 weeks · 5 days/week',  level: 'pro',     sport: 'swimming',      icon: '🏊', bg: '#F0F9FF', weeks: 8,  category: 'endurance' },
  // ── CYCLING ──
  { name: 'Beginner Road Cycling',      desc: 'Get comfortable on the saddle and build your aerobic engine from zero.',             meta: '6 weeks · 3 days/week',  level: 'amateur', sport: 'cycling',       icon: '🚴', bg: '#ECFDF5', weeks: 6,  category: 'endurance' },
  { name: 'Triathlon Ride Phase',       desc: 'Bike-specific block for athletes targeting a 70.3 or full Ironman.',                 meta: '8 weeks · 4 days/week',  level: 'pro',     sport: 'cycling',       icon: '🚴', bg: '#ECFDF5', weeks: 8,  category: 'endurance' },
  { name: 'Elite Cycling Power Block',  desc: 'Raise your FTP and peak for your target race with this periodised block.',           meta: '12 weeks · 5 days/week', level: 'pro',     sport: 'cycling',       icon: '🚴', bg: '#ECFDF5', weeks: 12, category: 'endurance' },
  // ── FITNESS MEN ──
  { name: 'Men\'s Strength Foundation', desc: 'Build full-body strength from the ground up — squat, press, pull, hinge.',           meta: '8 weeks · 4 days/week',  level: 'amateur', sport: 'fitness-men',   icon: '💪', bg: '#FFF7ED', weeks: 8,  category: 'strength',  forWhom: 'Men' },
  { name: 'Men\'s Athletic Performance',desc: 'Explosive power, speed and conditioning for the serious male athlete.',              meta: '12 weeks · 5 days/week', level: 'pro',     sport: 'fitness-men',   icon: '🏋️', bg: '#FFF7ED', weeks: 12, category: 'strength',  forWhom: 'Men' },
  { name: 'Men\'s Fat Loss & Muscle',   desc: 'Simultaneous fat loss and lean muscle gain — body recomposition done right.',        meta: '10 weeks · 4 days/week', level: 'amateur', sport: 'fitness-men',   icon: '🔥', bg: '#FFF7ED', weeks: 10, category: 'fitness',   forWhom: 'Men' },
  // ── FITNESS WOMEN ──
  { name: 'Women\'s Strength Starter',  desc: 'Empowering women to lift confidently — progressive overload with expert guidance.',  meta: '8 weeks · 3 days/week',  level: 'amateur', sport: 'fitness-women', icon: '💃', bg: '#FDF4FF', weeks: 8,  category: 'strength',  forWhom: 'Women' },
  { name: 'Women\'s Tone & Sculpt',     desc: 'Targeted sculpting for arms, glutes, and core with sustainable progressive training.',meta: '10 weeks · 4 days/week', level: 'amateur', sport: 'fitness-women', icon: '✨', bg: '#FDF4FF', weeks: 10, category: 'fitness',   forWhom: 'Women' },
  { name: 'Women\'s Athletic Edge',     desc: 'Performance training for competitive women across strength and conditioning.',        meta: '12 weeks · 5 days/week', level: 'pro',     sport: 'fitness-women', icon: '⚡', bg: '#FDF4FF', weeks: 12, category: 'strength',  forWhom: 'Women' },
  // ── PRENATAL ──
  { name: 'Prenatal Fitness (1st Tri)', desc: 'Safe, gentle movement to maintain energy and reduce discomfort in early pregnancy.',  meta: '12 weeks · 3 days/week', level: 'all',     sport: 'prenatal',      icon: '🤰', bg: '#FFF1F2', weeks: 12, category: 'wellness',  forWhom: 'Pregnant women' },
  { name: 'Prenatal Fitness (2nd Tri)', desc: 'Modified strength and cardio to support a healthy mid-pregnancy.',                    meta: '12 weeks · 3 days/week', level: 'all',     sport: 'prenatal',      icon: '🤰', bg: '#FFF1F2', weeks: 12, category: 'wellness',  forWhom: 'Pregnant women' },
  { name: 'Prenatal Fitness (3rd Tri)', desc: 'Gentle mobility, breathing, and pelvic floor work to prepare for birth.',             meta: '12 weeks · 2 days/week', level: 'all',     sport: 'prenatal',      icon: '🤰', bg: '#FFF1F2', weeks: 12, category: 'wellness',  forWhom: 'Pregnant women' },
  { name: 'Postnatal Recovery',         desc: 'Rebuild core, pelvic floor and full-body strength safely after birth.',               meta: '8 weeks · 3 days/week',  level: 'all',     sport: 'prenatal',      icon: '👶', bg: '#FFF1F2', weeks: 8,  category: 'wellness',  forWhom: 'New mothers' },
  // ── YOGA ──
  { name: 'Yoga for Athletes',          desc: 'Improve flexibility, mobility and mental recovery for high-performance athletes.',    meta: '6 weeks · 4 days/week',  level: 'all',     sport: 'yoga',          icon: '🧘', bg: '#F5F3FF', weeks: 6,  category: 'wellness' },
  { name: 'Power Yoga Flow',            desc: 'Dynamic vinyasa sequences that build strength, balance and body awareness.',          meta: '8 weeks · 4 days/week',  level: 'amateur', sport: 'yoga',          icon: '🌊', bg: '#F5F3FF', weeks: 8,  category: 'wellness' },
  // ── HIIT ──
  { name: 'HIIT Ignite',               desc: '20-minute high-intensity sessions that torch calories and build aerobic capacity.',    meta: '6 weeks · 4 days/week',  level: 'amateur', sport: 'hiit',          icon: '⚡', bg: '#FFFBEB', weeks: 6,  category: 'fitness' },
  { name: 'Advanced HIIT & Power',     desc: 'Brutal interval training combined with plyometrics for experienced athletes.',         meta: '8 weeks · 5 days/week',  level: 'pro',     sport: 'hiit',          icon: '🔥', bg: '#FFFBEB', weeks: 8,  category: 'fitness' },
  // ── STRENGTH ──
  { name: 'Powerlifting Foundations',  desc: 'Master the squat, bench, and deadlift with progressive overload and perfect form.',   meta: '10 weeks · 4 days/week', level: 'amateur', sport: 'strength',      icon: '🏋️', bg: '#F8FAFC', weeks: 10, category: 'strength' },
  { name: 'Olympic Weightlifting',     desc: 'Learn the snatch and clean & jerk under expert guidance from certified coaches.',      meta: '12 weeks · 4 days/week', level: 'pro',     sport: 'strength',      icon: '🥇', bg: '#F8FAFC', weeks: 12, category: 'strength' },
];

export const coaches: Coach[] = [
  { initials: 'SC', name: 'Sara Chen',      sport: 'Long-distance running',   tags: ['Marathon','Endurance','Nutrition','Trail'],         rating: 4.9, athletes: 134, bio: 'Former Olympic marathon qualifier with 12 years coaching experience. Specialises in long-distance base building and race-day strategy.',       avatarBg: '#DBEAFE', avatarColor: '#1E40AF' },
  { initials: 'MR', name: 'Marco Reyes',    sport: 'Competitive swimming',    tags: ['Stroke tech','Open water','Speed'],                 rating: 4.8, athletes: 89,  bio: 'National-level swimmer turned coach. Expert in stroke biomechanics and open-water race preparation for all distances.',                          avatarBg: '#CFFAFE', avatarColor: '#0E7490' },
  { initials: 'LB', name: 'Lena Bauer',     sport: 'Cycling & triathlon',     tags: ['Triathlon','Power','Recovery','Periodisation'],     rating: 4.9, athletes: 107, bio: 'Ironman finisher and certified cycling coach. Focuses on power-based training and periodisation for multi-sport athletes.',                       avatarBg: '#DCFCE7', avatarColor: '#166534' },
  { initials: 'JP', name: 'James Park',     sport: 'Men\'s strength & HIIT',  tags: ['Powerlifting','HIIT','Body recomp'],                rating: 4.7, athletes: 62,  bio: 'Certified strength coach and sports physiologist. Designs explosive programs for men targeting performance and body composition.',                  avatarBg: '#FEF3C7', avatarColor: '#92400E' },
  { initials: 'AK', name: 'Aiko Kimura',    sport: 'Women\'s fitness & yoga', tags: ['Women\'s strength','Prenatal','Yoga','Wellness'],   rating: 4.9, athletes: 118, bio: 'Certified pre/postnatal fitness specialist and yoga instructor. Passionate about safe, empowering training for women at every life stage.',        avatarBg: '#FDF4FF', avatarColor: '#6B21A8' },
  { initials: 'DM', name: 'Diego Martín',   sport: 'Road cycling & strength', tags: ['Endurance','Climbing','FTP','Olympic lifting'],     rating: 4.9, athletes: 91,  bio: 'Road cyclist and data-driven strength coach. Specialises in FTP improvement, race peaking, and Olympic weightlifting for serious athletes.',      avatarBg: '#F0FDF4', avatarColor: '#166534' },
];

export const conversations: Conversation[] = [
  {
    id: 'sara', initials: 'SC', name: 'Sara Chen', role: '● Online · Running coach',
    bg: '#DBEAFE', color: '#1E40AF', preview: "You're on track! Today's long run…", time: '2h', unread: 2, online: true,
    messages: [
      { id: '1', from: 'coach', text: "Hey! Great effort on Sunday's easy run. Your pace was a bit fast — keep it conversational next time. How did your legs feel?", ts: '10:14 AM', day: 'Monday, March 30' },
      { id: '2', from: 'me',    text: 'Felt strong! A little tight in the left calf but nothing serious. Stretched properly after.', ts: '10:31 AM' },
      { id: '3', from: 'coach', text: "Good to hear. Keep an eye on that calf. Wednesday is a key tempo session — aim for 4:55–5:00/km on the 3×2km blocks. I've attached this week's full plan.", ts: '10:35 AM' },
      { id: '4', from: 'me',    text: "Thanks Sara! Will do. Should I do any extra stretching before the tempo?", ts: '10:50 AM' },
      { id: '5', from: 'coach', text: "Yes — 10 minutes dynamic warm-up: leg swings, high knees, butt kicks. Then 1km easy jog before hitting pace. Your body will thank you.", ts: '11:02 AM' },
      { id: '6', from: 'coach', text: "Great tempo session Wednesday, Alex 💪 Today's long run — aim for 5:10/km first 12km, then let yourself push to 5:00 on the last stretch. You're on track for sub-1:50!", ts: '8:02 AM', day: 'Today' },
      { id: '7', from: 'me',    text: "Thanks Sara! Feeling really good today. I'll stick to the plan and report back after 🏃", ts: '8:45 AM' },
    ],
  },
  {
    id: 'apexsport', initials: 'AS', name: 'ApexSport Team', role: 'Support & announcements',
    bg: '#EDE9FE', color: '#5B21B6', preview: 'Welcome to ApexSport! Here\'s how to get started…', time: '1d', unread: 1, online: false,
    messages: [
      { id: '1', from: 'coach', text: "Welcome to ApexSport, Alex! 🎉 We're thrilled to have you on board.", ts: '9:00 AM', day: 'Yesterday' },
      { id: '2', from: 'coach', text: "Here's how to get the most out of your experience: check in with your coach weekly, log every session, and don't skip your recovery days. They're just as important as the hard workouts.", ts: '9:01 AM' },
      { id: '3', from: 'coach', text: "If you ever have questions, tap the support icon or message us here. Good luck with your training! 💪", ts: '9:02 AM' },
    ],
  },
  {
    id: 'nutrition', initials: 'NB', name: 'Nutrition Coach', role: 'Automated reminders',
    bg: '#FEF3C7', color: '#92400E', preview: 'Pre-run meal reminder: eat 2h before…', time: '3d', unread: 0, online: false,
    messages: [
      { id: '1', from: 'coach', text: "Pre-run meal reminder 🍌 Eat 2 hours before your long run. Aim for carb-rich, low-fibre: oats with banana, or toast with peanut butter.", ts: '6:00 AM', day: '3 days ago' },
      { id: '2', from: 'coach', text: "Post-run recovery tip: within 30 minutes of finishing, aim for a 3:1 carb-to-protein ratio. A smoothie with banana, whey protein, and oats works perfectly.", ts: '11:30 AM' },
    ],
  },
  {
    id: 'james', initials: 'JP', name: 'James Park', role: 'Strength & conditioning coach',
    bg: '#FEF3C7', color: '#92400E', preview: 'Your strength baseline results are in…', time: '5d', unread: 0, online: false,
    messages: [
      { id: '1', from: 'coach', text: "Hi Alex! I've reviewed your baseline assessment. Your squat mechanics are solid but we need to work on hip mobility and posterior chain activation.", ts: '2:15 PM', day: '5 days ago' },
      { id: '2', from: 'me',    text: 'Great, when do we start the strength block?', ts: '3:00 PM' },
      { id: '3', from: 'coach', text: "We'll layer it in starting Week 6 of your running program. Two sessions per week — Tuesday and Friday. I'll send the plan next Monday.", ts: '3:20 PM' },
    ],
  },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'message', title: 'Sara Chen sent you a message',      body: "Today's long run — aim for 5:10/km first 12km…", time: '2h ago',  read: false, convId: 'sara'      },
  { id: 'n2', type: 'message', title: 'New message from Sara Chen',        body: 'Great tempo session Wednesday, Alex 💪',         time: '3h ago',  read: false, convId: 'sara'      },
  { id: 'n3', type: 'session', title: 'Session reminder',                  body: 'Long run — 18 km starts in 1 hour',              time: '1h ago',  read: false                        },
  { id: 'n4', type: 'pb',      title: '🏆 New personal best!',             body: 'You ran 5 km in 24:18 — a new record!',          time: '2d ago',  read: true                         },
  { id: 'n5', type: 'coach',   title: 'James Park left a note',            body: 'Your strength baseline results are ready.',      time: '5d ago',  read: true,  convId: 'james'     },
  { id: 'n6', type: 'system',  title: 'Weekly summary ready',              body: 'You trained 4 of 4 sessions this week. 🎯',     time: '1w ago',  read: true                         },
];

export const programsBySport: Record<string, Program[]> = {
  running:       programs.filter(p => p.sport === 'running'),
  swimming:      programs.filter(p => p.sport === 'swimming'),
  cycling:       programs.filter(p => p.sport === 'cycling'),
  'fitness-men': programs.filter(p => p.sport === 'fitness-men'),
  'fitness-women': programs.filter(p => p.sport === 'fitness-women'),
  prenatal:      programs.filter(p => p.sport === 'prenatal'),
  yoga:          programs.filter(p => p.sport === 'yoga'),
  hiit:          programs.filter(p => p.sport === 'hiit'),
  strength:      programs.filter(p => p.sport === 'strength'),
};
