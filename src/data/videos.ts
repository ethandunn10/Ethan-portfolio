// The /videos/ page (and the "Latest reels" row on /now/).
import { TODO, type Maybe } from './todo.ts';

export type Reel = {
  title: Maybe<string>;
  views: Maybe<string>;        // "160K views"
  file: Maybe<string>;         // /assets/reels/reel1.mp4 (720p, under 8MB)
  poster: Maybe<string>;       // /assets/reels/reel1.jpg (first frame)
  width?: number;              // video size, sets the card's shape
  height?: number;
  instagramUrl: Maybe<string>;
};

export const videos = {
  intro: 'Reels and YouTube. I document building apps and growing an audience, including what flops.',

  stats: [
    { icon: 'users', value: '5.5K+', label: 'Instagram followers' },
    { icon: 'flame', value: '160K+', label: 'views on my top reel' },
    { icon: 'eye', value: '500K+', label: 'views in the past month' },
  ],
  milestones: [
    'First reel posted Sept 10, 2026',
    'Hit 1K followers after 18 posts',
    'First long-form YouTube video posted Nov 17, 2026',
  ],

  featured: {
    label: 'Featured video',
    title: 'I Spent 20 Hours Studying How a 19 Y/O Got Hired by Alex Hormozi',
    text: 'I read Jay Yang’s book Work With The Best and broke down everything I learned. Jay sent me the book after seeing one of my videos.',
    url: 'https://www.youtube.com/watch?v=V4eXJwWr4gY',
  },

  // Exactly 3. Files live in /assets/reels/ (not public/: a public/ folder breaks the Vercel deploy).
  // Originals are in public/reels/ (git-ignored); processed with scripts/compress.swift + poster.swift.
  reels: [
    { // ScreenRecording_10-24-2026 20.mov
      title: 'Here’s the one tip you need to win your hackathons (I’m ungatekeeping)',
      views: '160K+ views',
      file: '/assets/reels/reel1.mp4', poster: '/assets/reels/reel1.jpg', width: 1206, height: 678,
      instagramUrl: 'https://www.instagram.com/reel/De9WLDRCrQZ/',
    },
    { // ScreenRecording_10-10-2026 18-46-32_1.mov
      title: 'Can a complete beginner learn to build apps in 3 weeks?',
      views: '5K+ views',
      file: '/assets/reels/reel2.mp4', poster: '/assets/reels/reel2.jpg', width: 1206, height: 678,
      instagramUrl: 'https://www.instagram.com/reel/DeaGevNiJgh/',
    },
    { // copy_1D12A0D3-….MOV (Oct 7, “Hackathon” title card)
      title: 'I won my first hackathon? Or did I get second',
      views: '14K+ views',
      file: '/assets/reels/reel3.mp4', poster: '/assets/reels/reel3.jpg', width: 1280, height: 716,
      instagramUrl: 'https://www.instagram.com/reel/DdXN6Joiiz0/',
    },
  ] as Reel[],

  // Unused for now. The uploads playlist is this ID with "UC" swapped for "UU".
  youtubeChannelId: 'UC5AYzBfVkEjelZJ-xigK_4w',

  instagram: 'https://instagram.com/ethan.j.dunn',
  youtube: 'https://youtube.com/@ethan_dunn',
};
