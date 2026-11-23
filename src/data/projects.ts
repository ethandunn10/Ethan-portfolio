// Case studies. Order here = order on /projects/ and the "Next project" chain.
// Icons are Lucide names (see src/icons.ts). Leave TODO('…') where you don't
// have the real thing yet; never put in a guessed number or link.
import { TODO, type Maybe, type Todo } from './todo.ts';

export type Img = { src: string; alt: string; phone?: boolean }; // phone: a tall phone screenshot
export type LinkButton = { label: string; href: Maybe<string> };
export type Feature = { icon: string; title: string; line: string };
export type Stat = { value: string; label: string };
export type Lesson = { icon: string; title: string; text: string }; // a titled “What I learned” card

export type Project = {
  slug: string;
  name: string;
  icon: Img;                       // small logo next to the name
  tagline: Maybe<string>;          // the one line under the name
  chips: string[];                 // "Runner-up · Hack the Track"
  links: LinkButton[];             // Live site, Demo video, TestFlight… (TODO ones stay hidden)
  media: Maybe<{ phones: Img[] } | { image: Img }>; // the big screenshot
  problem: Maybe<string>;
  built: Maybe<string>;
  features: Maybe<Feature[]>;      // 3–4 cards
  tools: Maybe<string[]>;          // pills
  toolsNote?: string;              // one line under the pills
  toolsNoteConfirm?: Todo;         // TODO until you've confirmed toolsNote
  sustainability?: Maybe<string>;  // why it fits a hackathon theme
  results: Maybe<Stat[]>;          // big numbers
  learned: Maybe<string[] | Lesson[]>; // 2–3 bullets, or titled cards
  card: { line: string; chip: string; image: Maybe<Img> }; // the /projects/ grid card
};

export const projects: Project[] = [
  {
    slug: 'rilo',
    name: 'Rilo',
    icon: { src: '/img/icons/rilo-icon.png', alt: '' },
    tagline: 'An iPhone screen-time buddy. A panda that gets you off your phone and gives you something better to do instead.',
    chips: ['Native iPhone app built', 'Apple Developer approved · Nov 2026', 'Next: Screen Time permission, then TestFlight', '42+ on the waitlist'],
    links: [{ label: 'Join the waitlist', href: 'https://rilo.one' }],
    media: {
      phones: [
        { src: '/img/rilo-home.webp', alt: 'Rilo home screen' },
        { src: '/img/rilo-plan.webp', alt: 'Rilo plan screen' },
        { src: '/img/rilo-progress.webp', alt: 'Rilo progress screen' },
      ],
    },
    problem: 'Screen-time apps just block you, so people turn them off.',
    // Fact-checked against ~/Projects/rilo/Rilo (read only, Nov 23, 2026). File refs per card.
    built: 'A panda buddy that learns your hobbies and goals. When you open a limited app, he asks what it’s for and points you at something better to do.',
    features: [
      // Views/Intercept/WhyOpenView.swift:51 + Models/MockAI+Day.swift:60-90 (limited and free apps, every open)
      { icon: 'message-circle-question', title: 'A buddy that asks why', line: 'Open a limited app and Rilo asks what it’s for, then nudges you toward something you actually like doing instead.' },
      // Views/Onboarding/RatherView.swift + Models/AppState+Screens.swift:45-47 + MockAI+Day.swift:83-88
      { icon: 'heart', title: 'Ideas from your hobbies', line: 'Rilo learns your hobbies and goals and suggests real things to do, like shooting hoops or working on your project, instead of scrolling.' },
      // Views/Home/PlanView.swift + Services/AppleIntelligenceBrain.swift:120-130
      { icon: 'calendar', title: 'Your day, planned', line: 'Tell Rilo when you’re free, when bed is and what has to get done. He plans the rest of your day, with just enough scroll time to stay under your goal.' },
      // Models/Levels.swift:47-71 (exactly 23 skins, levels 1–100)
      { icon: 'sparkles', title: 'Rewards for staying off', line: 'Earn XP for time off your phone, level up, and unlock 23 panda skins.' },
      // Models/Limits.swift:101-108 (limits), :119 PENDING_MS = 24h, :116-117 WAIT 5 → 15s
      { icon: 'timer', title: 'Limits that stick', line: 'Set how many times you can open each app and for how long. Strict mode makes loosening a limit wait 24 hours and stretches the pause before an app opens from 5 to 15 seconds.' },
      // Services/AppleIntelligenceBrain.swift (FoundationModels) + Models/AppleSpeechInput.swift (requiresOnDeviceRecognition)
      { icon: 'mic', title: 'Talk to Rilo', line: 'Chat by voice or text. It runs on Apple’s on-device AI, so it stays on your phone.' },
    ],
    tools: ['Swift', 'SwiftUI', 'Screen Time API', 'Xcode', 'Claude Code'],
    results: [
      { value: '42+', label: 'people on the waitlist' },
      { value: '23', label: 'unlockable panda skins' },
    ],
    learned: [
      {
        icon: 'clock',
        title: 'Real apps take patience.',
        text: 'Building the web demo took days. Getting it onto an iPhone took weeks. I paid for my Apple Developer account on November 7 and it sat on ‘Pending’ for over two weeks with no reply. I kept building anyway, so when it got approved, I was ready.',
      },
      {
        icon: 'fingerprint',
        title: 'Make it your own.',
        text: 'My first version of Rilo looked a lot like a friend’s app. It worked, but it didn’t feel like mine. So I redesigned it around a panda with its own personality, moods and look. Now nobody confuses the two.',
      },
      {
        icon: 'message-circle',
        title: 'Feedback beats your own opinion.',
        text: 'I thought my onboarding was great. My first testers said it was way too long and the home screen was too busy. I cut it way down, and Rilo got better the moment I stopped defending my ideas and started listening.',
      },
    ],
    card: {
      line: 'An iPhone screen-time buddy with a panda.',
      chip: '42+ on the waitlist',
      image: { src: '/img/rilo-home.webp', alt: 'Rilo home screen', phone: true },
    },
  },
  {
    slug: 'airwrite',
    name: 'AirWrite',
    icon: { src: '/img/icons/airwrite-icon.png', alt: '' },
    tagline: 'Write on any table with your finger. No paper, no pen.',
    chips: ['Runner-up · Hack the Track', 'Built solo', 'Sustainability theme', 'Sept 11–12, 2026'],
    links: [{ label: 'See the code', href: 'https://github.com/ethandunn10/AirWrite' }],
    media: { image: { src: '/img/projects/airwrite-app.png', alt: 'The AirWrite app: camera views on the left, the notebook page in the middle, pen settings on the right' } },
    problem: 'Built for a sustainability hackathon. You can take notes, sketch and write without using a single sheet of paper.',
    built: 'AirWrite turns a bare table into a notebook. Two cameras track your fingertip. One watches from above, the other sits at table level and sees when your finger touches the surface. Everything you trace shows up as digital ink in AirWrite’s notebook, where you can save your docs and export them.',
    // Checked against ~/Projects/AirWrite (Nov 23, 2026)
    features: [
      { icon: 'pen-tool', title: 'Write on any table', line: 'No paper or tablet. Just trace on a bare table with your finger.' },
      { icon: 'eye', title: 'Two-camera tracking', line: 'One camera above follows your fingertip, one at table level checks how high your finger is, so ink only shows when you touch the table.' },
      { icon: 'sparkles', title: 'Digital ink, live', line: 'Your movements appear in the notebook in real time as smooth digital ink.' },
      { icon: 'book-open', title: 'Save and export', line: 'Save your docs in the notebook and export them as PDFs.' },
      // src/app/api/transcribe/route.ts + ExportDialog.tsx ("Typed text" export)
      { icon: 'newspaper', title: 'Handwriting to text', line: 'Claude reads your writing back as typed, searchable text you can fix before exporting.' },
      // ControlPanel.tsx "Height thresholds": Desk line / Pen-down band / Pen-up band sliders + Auto-set
      { icon: 'sliders-horizontal', title: 'Touch you can tune', line: 'The side camera measures how high your fingertip is above the table. Sliders set where the table is and how close you have to get before ink starts, or rest your finger down to set it automatically.' },
    ],
    tools: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'MediaPipe hand tracking', 'jsPDF', 'Claude API', 'Claude Code'],
    toolsNote: 'I designed the two-camera setup, worked out the touch detection, and built it solo in 2 days with Claude Code.',
    toolsNoteConfirm: TODO('AirWrite: confirm the “How I built it” line is right'),
    results: [
      { value: '2nd', label: 'place at Hack the Track' },
      { value: 'Solo', label: 'built alone in 2 days' },
    ],
    learned: [
      'A bare finger tracks better than a held pen. The hand-tracking model is looking for a finger.',
      'Where the camera sits matters more than the code. From above, hovering and touching are a pixel or two apart, so the side camera has to sit at table level.',
      'Raw hand tracking jitters. A One Euro filter keeps the line still while you hover and quick while you write.',
    ],
    card: {
      line: 'Write on any table with your finger. No paper, no pen.',
      chip: 'Runner-up',
      image: { src: '/img/projects/airwrite-lockup.jpg', alt: 'AirWrite logo' },
    },
  },
  {
    slug: 'backpack',
    name: 'Backpack',
    icon: { src: '/img/icons/backpack-icon.png', alt: '' },
    tagline: 'An AI study buddy that turns homework into study plans and quizzes.',
    chips: ['5th place · NXT Build Sprint', 'Built for a friend', 'Nov 13–15, 2026'],
    links: [
      { label: 'Watch the demo', href: 'https://www.loom.com/share/864d8b4b3bc84c3aba27ed6024b88857' },
      { label: 'See the code', href: 'https://github.com/ethandunn10/backpack' },
    ],
    media: {
      phones: [
        { src: '/img/projects/backpack-start.png', alt: 'Backpack start screen: never forget homework again' },
        { src: '/img/projects/backpack-plans.png', alt: 'Backpack plans screen with the next test and tonight’s homework' },
        { src: '/img/projects/backpack-tests.png', alt: 'Backpack test screen with a day-by-day study plan' },
      ],
    },
    problem: 'My friend couldn’t keep track of homework, studying, and time.',
    built: 'A study buddy that remembers your homework. Snap a worksheet or type what your teacher said, and it tells you what to do tonight and quizzes you on your own homework.',
    features: [
      { icon: 'image', title: 'Snap your homework', line: 'AI pulls out what’s due, when, and what it covers.' },
      { icon: 'calendar-days', title: 'Tonight’s plan', line: 'What to do tonight, what’s coming up, and a countdown to the next test.' },
      { icon: 'list-checks', title: 'A plan for every test', line: 'A day-by-day study plan up to test day.' },
      { icon: 'circle-help', title: 'Quizzes from your homework', line: 'Every answer shows which homework it came from.' },
    ],
    tools: ['HTML, CSS & JavaScript', 'Vercel serverless function', 'Claude API'],
    results: [{ value: '5th', label: 'place at NXT Build Sprint' }],
    learned: [
      'Keep the AI key on the server and give it only two jobs, reading homework and making quizzes, so nobody can use it as a free chatbot.',
      'A public AI demo needs guardrails: a rate limit per visitor, size caps on photos, short answers, a cheap model, and a low spend limit.',
    ],
    card: {
      line: 'An AI study buddy that remembers your homework.',
      chip: '5th place',
      image: { src: '/img/projects/backpack-plans.png', alt: 'Backpack plans screen', phone: true },
    },
  },
  {
    slug: 'kovrio',
    name: 'Kovrio',
    icon: { src: '/img/icons/kovrio-icon.png', alt: '' },
    tagline: 'Free AP practice quizzes. I grew it to 71 users, then shut it down in Nov 2026 to focus on Rilo.',
    chips: ['71 users', '9 AP subjects', 'Shut down Nov 2026'],
    links: [{ label: 'See the code', href: 'https://github.com/ethandunn10/Kovrio' }],
    media: {
      phones: [
        { src: '/img/projects/kovrio-subjects.png', alt: 'Kovrio subject list: AP Government, Biology, U.S. History and more' },
        { src: '/img/projects/kovrio-question.png', alt: 'A Kovrio AP Biology practice question' },
        { src: '/img/projects/kovrio-insights.png', alt: 'Kovrio Insights: what to study next, built from your scores' },
      ],
    },
    problem: 'I got tired of photographing textbook pages, uploading them to ChatGPT, and asking it to make a quiz, over and over, every unit.',
    built: 'Free AP practice quizzes, sorted by unit and topic, so you can drill one piece of the course at a time.',
    features: [
      { icon: 'book-open', title: '9 AP subjects', line: '6,770 questions across 70 units and 677 topics, following the College Board’s units.' },
      { icon: 'target', title: 'Mastery per topic and unit', line: 'A 78% average can hide a unit you don’t know. Kovrio shows the split.' },
      { icon: 'circle-help', title: 'Missed questions come back', line: 'Questions you miss get weighted back into your next unit quiz.' },
      { icon: 'lightbulb', title: 'What to study next', line: 'Insights turns your scores into a study plan.' },
    ],
    tools: ['HTML, CSS & JavaScript', 'Supabase', 'Google sign-in', 'Vercel', 'Remotion'],
    results: [
      { value: '71', label: 'real students used it' },
      { value: '6,770', label: 'practice questions' },
      { value: '$0', label: 'spent on ads' },
    ],
    learned: [
      {
        icon: 'heart',
        title: 'Build what you care about.',
        text: 'Kovrio got 71 students using it, and I’m proud of that. But I didn’t love the problem, and there were already big study tools that did it well. When you don’t care, it shows, and growth stalls.',
      },
      {
        icon: 'rocket',
        title: 'Shipping beats perfect.',
        text: 'Kovrio was my first real full app: a live site, accounts, Google sign-in and a database. Getting 71 real people to use it taught me more than any tutorial.',
      },
      {
        icon: 'door-open',
        title: 'Know when to stop.',
        text: 'Shutting Kovrio down wasn’t failing. It freed up my time for Rilo, something I actually care about. Quitting the right thing is a skill too.',
      },
    ],
    card: {
      line: 'Free AP practice quizzes.',
      chip: '71 users',
      image: { src: '/img/projects/kovrio-subjects.png', alt: 'Kovrio subject list', phone: true },
    },
  },
];
