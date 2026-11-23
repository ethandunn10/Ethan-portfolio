// The Log on /about/, newest first (the build sorts it anyway).
// date is YYYY-MM-DD and shows as MM.DD.YY. Entries that only have a month
// or a year carry a TODO until you know the exact day.
import { TODO, type Todo } from './todo.ts';

export type LogEntry = { date: string; text: string; exactDate?: Todo };

export const log: LogEntry[] = [
  { date: '2026-11-17', text: "Posts his first long-form YouTube video." },
  { date: '2026-11-14', text: "Makes his first dollar online from UGC." },
  { date: '2026-11-13', text: "Builds Backpack for a friend and places 5th at NXT Build Sprint." },
  { date: '2026-11-08', text: "First reel crosses 100K views." },
  { date: '2026-11-06', text: "Publishes his first article — “Your Potential is Quietly Leaking”." },
  { date: '2026-10-28', text: "Starts building Rilo." },
  { date: '2026-10-27', text: "Kovrio passes 50 users." },
  { date: '2026-10-24', text: "Hits 1,000 followers on Instagram, after 18 posts." },
  { date: '2026-10-20', text: "Makes his first short film — “Log Off”." },
  { date: '2026-10-09', text: "Starts making UGC with Whop." },
  { date: '2026-09-12', text: "Builds AirWrite and places runner-up at Hack the Track — his first hackathon." },
  { date: '2026-09-11', text: "Builds his first portfolio site." },
  { date: '2026-09-10', text: "Posts his first reel on Instagram." },
  { date: '2026-09-05', text: "Launches Kovrio — his first shipped, live app." },
  { date: '2026-08-07', text: "Meets Nate Royal, the founder of Due Gooder." },
  { date: '2026-07-23', text: "Deploys his first real app — a startup-idea tool." },
  { date: '2026-07', text: "Starts playing golf.", exactDate: TODO('About Log: exact day for “Starts playing golf.” (2026-07)') },
  { date: '2026-06-07', text: "Wins the Kentucky AAA baseball state tournament." },
  { date: '2026-06', text: "Gets into startups and building apps.", exactDate: TODO('About Log: exact day for “Gets into startups and building apps.” (2026-06)') },
  { date: '2026-05', text: "Wins STLP state in the Minecraft division.", exactDate: TODO('About Log: exact day for “Wins STLP state in the Minecraft division.” (2026-05)') },
  { date: '2023-08-13', text: "Starts playing the trumpet." },
  { date: '2022-11', text: "Solves his first Rubik’s Cube.", exactDate: TODO('About Log: exact day for “Solves his first Rubik’s Cube.” (2022-11)') },
  { date: '2022-08', text: "Starts a math class three years ahead of grade level.", exactDate: TODO('About Log: exact day for “Starts a math class three years ahead of grade level.” (2022-08)') },
  { date: '2014', text: "Starts playing basketball and baseball.", exactDate: TODO('About Log: exact day for “Starts playing basketball and baseball.” (2014)') },
  { date: '2011-09-06', text: "Ethan is born." },
];
