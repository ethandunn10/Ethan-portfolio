// The /now/ page. Change `updated` whenever you edit this.
// Steps: 'done' ✓, 'in-progress' ◐, 'todo' ○.
export type Step = { label: string; state: 'done' | 'in-progress' | 'todo' };
export type Button = { label: string; href: string };
export type Focus = {
  show?: boolean;          // false hides the card (flip to true when it's real)
  icon: string;            // Lucide name
  label: string;
  headline: string;
  detail?: string;
  checklist?: Step[];
  chips?: string[];
  buttons?: Button[];
};

export const now = {
  updated: '2026-11-23', // YYYY-MM-DD

  intro: 'I’m Ethan. I’m 15, I build apps, and I post everything I learn along the way, including what flops. Here’s what has my attention this month.',

  focus: [
    {
      icon: 'hammer',
      label: 'Building',
      headline: 'Rilo.',
      detail: 'An iPhone screen-time buddy. A panda that gets you off your phone and gives you something better to do instead.',
      checklist: [
        { label: 'Panda buddy designed', state: 'done' },
        { label: 'iPhone app built', state: 'done' },
        { label: 'Apple Developer approved', state: 'done' },
        { label: 'Screen Time permission', state: 'in-progress' },
        { label: 'TestFlight', state: 'todo' },
        { label: 'App Store', state: 'todo' },
      ],
      chips: ['42+ on the waitlist'],
      buttons: [{ label: 'See Rilo', href: '/projects/rilo/' }, { label: 'rilo.one', href: 'https://rilo.one' }],
    },
    {
      icon: 'smartphone',
      label: 'Posting',
      headline: 'Reels about building apps young.',
      chips: ['5.5K+ followers', '160K+ top reel', '500K+ views this month'],
      buttons: [{ label: 'Watch the videos', href: '/videos/' }],
    },
    {
      icon: 'briefcase',
      label: 'Working',
      headline: 'Making UGC and sponsored videos for tools I’d actually use.',
      buttons: [{ label: 'Work with me', href: '/work-with-me/' }],
    },
    {
      show: false, // flip to true after the first week
      icon: 'briefcase',
      label: 'Working',
      headline: 'Growth Intern at Crustdata (YC F24).',
      detail: 'Building their UGC program from scratch.',
    },
    {
      icon: 'graduation-cap',
      label: 'School',
      headline: 'Freshman.',
      detail: '3 APs + a dual-credit business class. Basketball season’s on.',
    },
  ] as Focus[],

  // done: true shows a filled black check and strikes the goal through
  goals: [
    { label: 'Launch Rilo on TestFlight', done: false },
    { label: 'Launch my newsletter, Not Dunn Yet', done: false },
    { label: 'Start an internship at a YC company', done: false },
  ],

  wins: [
    { when: 'Nov 2026', what: 'Apple Developer approved' },
    { when: 'Nov 2026', what: '5th at NXT Build Sprint' },
    { when: 'Sept 2026', what: 'Hack the Track runner-up' },
    { when: 'Sept 2026', what: 'First reel' },
  ],

  learning: ['Growth marketing', 'UGC', 'Short-form video', 'Copywriting', 'Building with Claude Code', 'Swift'],

  notDoing: [
    { name: 'Kovrio', why: 'Shut down at 71 users.' },
    { name: 'Saying yes to every brand deal', why: 'If I wouldn’t use it, I won’t post it.' },
  ],

  follow: {
    instagram: 'https://instagram.com/ethan.j.dunn',
    youtube: 'https://youtube.com/@ethan_dunn',
    linkedin: 'https://www.linkedin.com/in/ethandunnofficial',
    substack: 'https://substack.com/@ethanjdunn',
  },
};
