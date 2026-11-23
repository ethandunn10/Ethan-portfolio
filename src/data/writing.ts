// The /writing/ page. The build pulls your newest posts from the Substack
// RSS feed. `posts` below is only the fallback for when the feed can't be
// reached, so it doesn't need updating for every new essay.

export type Post = {
  title: string;
  url: string;
  date: string;        // YYYY-MM-DD
  preview: string;     // 1–2 lines
  cover?: string;      // image URL
  readMinutes: number;
};

export const writing = {
  intro: 'I write about building things young and showing everything, including what flops.',
  substack: 'https://substack.com/@ethanjdunn',
  newsletter: { name: 'Not Dunn Yet', note: 'My newsletter. Coming soon.' },
  feed: 'https://ethanjdunn.substack.com/feed',

  posts: [
    {
      title: 'Your Potential Is Quietly Leaking',
      url: 'https://ethanjdunn.substack.com/p/your-potential-is-quietly-leaking',
      date: '2026-11-07',
      preview: 'Teens have about 25 minutes a day of real free time. Here’s why it’s so hard to use it well.',
      cover: 'https://substackcdn.com/image/fetch/$s_!-2gD!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F58539354-c81b-493d-a3b2-3d80a333a7fe_1241x789.jpeg',
      readMinutes: 5,
    },
  ] as Post[],
};
