// The /resources/ page.
import { TODO, type Maybe } from './todo.ts';

export const resources = {
  subtitle: 'Free stuff I made to help you build faster.',

  guide: {
    pill: 'Free guide',
    title: 'Learn to Build Software with AI in 21 Days',
    line: 'The exact path I used to go from zero to shipping apps with AI.',
    story: 'It’s the course I used to prep for my first hackathon.',
    details: '15-page PDF · for total beginners · about 1–2 hours a day',
    learn: ['Set up your tools in day 1', 'Build and ship a real app', 'Use Claude Code like a pro'],
    cover: { src: '/img/resources/guide-cover.png', alt: 'The first page of the guide' } as Maybe<{ src: string; alt: string }>,
    button: 'Get the guide free',
    link: 'https://drive.google.com/file/d/1NpEL3CEii53o4b-ChxSMcOaKy5v5rD36/view' as Maybe<string>,
  },

  tools: [
    { icon: 'terminal', name: 'Claude Code', line: 'Builds my apps.', url: 'https://www.anthropic.com/claude-code' },
    { icon: 'code', name: 'VS Code', line: 'Where I read the code.', url: 'https://code.visualstudio.com/' },
    { icon: 'triangle', name: 'Vercel', line: 'Hosts my sites.', url: 'https://vercel.com/' },
    { icon: 'scissors', name: 'CapCut', line: 'Edits my reels.', url: 'https://www.capcut.com/' },
    { icon: 'figma', name: 'Figma', line: 'Designs and mockups.', url: 'https://www.figma.com/' },
    { icon: 'newspaper', name: 'Substack', line: 'My writing.', url: 'https://substack.com/@ethanjdunn' },
  ],

  comingSoon: 'My content process: how I script, film and edit reels.',

  cta: {
    title: 'Want more free stuff?',
    instagram: 'https://instagram.com/ethan.j.dunn',
    substack: 'https://substack.com/@ethanjdunn',
  },
};
