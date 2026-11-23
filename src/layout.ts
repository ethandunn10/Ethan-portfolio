// Shared header + footer for every page. Edit the lists here, then run
// `node scripts/build.ts`. The current page's link gets aria-current="page".

const PROJECTS: [string, string, string][] = [
  ['/projects/rilo/', 'Rilo', 'Screen-time buddy for iPhone'],
  ['/projects/airwrite/', 'AirWrite', 'Runner-up at Hack the Track'],
  ['/projects/backpack/', 'Backpack', '5th place at NXT Build Sprint'],
  ['/projects/kovrio/', 'Kovrio', 'AP study app with 71 users'],
];
const CONTENT: [string, string, string][] = [
  ['/videos/', 'Videos', 'Reels and YouTube'],
  ['/writing/', 'Writing', 'Essays on Substack'],
  ['/resources/', 'Resources', 'Free guides, like Learn to Build Software with AI in 21 Days'],
];

const EXT = ' target="_blank" rel="noopener"';
const FOOTER_GROUPS: [string, [string, string, string][]][] = [
  ['Explore', [['/', 'Home', ''], ['/about/', 'About', ''], ['/projects/', 'Projects', ''], ['/writing/', 'Writing', ''],
               ['/videos/', 'Videos', ''], ['/resources/', 'Resources', ''], ['/now/', 'Now', '']]],
  ['Follow', [['https://instagram.com/ethan.j.dunn', 'Instagram', EXT],
              ['https://youtube.com/@ethan_dunn', 'YouTube', EXT],
              ['https://www.linkedin.com/in/ethandunnofficial', 'LinkedIn', EXT],
              ['https://substack.com/@ethanjdunn', 'Substack', EXT],
              ['https://github.com/ethandunn10', 'GitHub', EXT]]],
  ['Work', [['https://beacons.ai/ethandunn/mediakit', 'Media kit', EXT],
            ['mailto:ethanjudgedunn10@gmail.com', 'Contact', '']]],
];

const CHEVRON = '<svg class="chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false">'
  + '<path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.75" '
  + 'stroke-linecap="round" stroke-linejoin="round"/></svg>';

const cur = (page: string, href: string) => (page === href ? ' aria-current="page"' : '');

function dropdown(key: string, label: string, items: [string, string, string][], page: string) {
  const current = items.some(([href]) => href === page) || (key === 'projects' && page.startsWith('/projects/'));
  const links = items
    .map(([href, name, desc]) => `            <li><a href="${href}"${cur(page, href)}><span class="dd-title">${name}</span><span class="dd-desc">${desc}</span></a></li>`)
    .join('\n');
  return `        <li class="nav-item has-dropdown">
          <button class="nav-trigger${current ? ' is-current' : ''}" type="button" aria-expanded="false" aria-controls="dd-${key}">
            <span class="nav-label">${label}</span>${CHEVRON}
          </button>
          <div class="dropdown" id="dd-${key}">
            <ul>
${links}
            </ul>
          </div>
        </li>`;
}

export function header(page: string) {
  return `<header class="site-header">
  <div class="wrap header-inner">
    <a href="/" class="brand" aria-label="Ethan Dunn, home">
      <img src="/assets/logo-mark-black.png" alt="" width="28" height="28">
      <span class="brand-name">Ethan Dunn</span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">
      <span class="menu-icon" aria-hidden="true"><span></span><span></span><span></span></span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul class="nav-list">
        <li class="nav-item nav-home"><a class="nav-link" href="/"${cur(page, '/')}><span class="nav-label">Home</span></a></li>
${dropdown('projects', 'Projects', PROJECTS, page)}
${dropdown('content', 'Content', CONTENT, page)}
        <li class="nav-item"><a class="nav-link" href="/about/"${cur(page, '/about/')}><span class="nav-label">About</span></a></li>
        <li class="nav-item"><a class="nav-link" href="/now/"${cur(page, '/now/')}><span class="nav-label">Now</span></a></li>
        <li class="nav-item nav-cta-item"><a class="nav-cta" href="/work-with-me/"${cur(page, '/work-with-me/')}>Work with me</a></li>
      </ul>
    </nav>
  </div>
</header>`;
}

export function footer(page: string) {
  const groups = FOOTER_GROUPS.map(([title, links]) => `      <div class="footer-group">
        <h2 class="footer-heading">${title}</h2>
        <ul>
${links.map(([href, name, extra]) => `          <li><a href="${href}"${extra}${cur(page, href)}>${name}</a></li>`).join('\n')}
        </ul>
      </div>`).join('\n');
  return `<footer class="site-footer">
  <div class="wrap footer-inner">
    <span class="footer-brand">
      <img src="/assets/logo-mark-white.png" alt="" width="32" height="32">
      Not Dunn Yet.
    </span>
    <nav class="footer-nav" aria-label="Footer">
${groups}
    </nav>
  </div>
</footer>`;
}

/** Full page: head, header, main, footer, scripts. */
export function page(opts: { path: string; title: string; description: string; main: string }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${opts.title}</title>
  <meta name="description" content="${opts.description}">
  <meta name="theme-color" content="#FFFFFF">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;800&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png?v=6">
  <link rel="icon" type="image/png" sizes="256x256" href="/assets/favicon.png?v=6">
  <link rel="shortcut icon" href="/favicon.ico?v=6">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png?v=6">
  <link rel="stylesheet" href="/styles.css">
  <script>
    /* Motion on unless the visitor asked for less. If motion.js never runs
       (blocked, offline), drop the class so nothing stays hidden. */
    (function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      var d = document.documentElement;
      d.classList.add('motion');
      setTimeout(function () { if (!window.__motion) d.classList.remove('motion'); }, 2500);
    })();
  </script>
  <link rel="modulepreload" href="/assets/js/motion-mini-11.18.2.js">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>

<!-- layout:header -->
${header(opts.path)}
<!-- /layout:header -->

  <main id="main" class="inner">
${opts.main}
  </main>

<!-- layout:footer -->
${footer(opts.path)}
<!-- /layout:footer -->

  <script src="/nav.js"></script>
  <script type="module" src="/motion.js"></script>
</body>
</html>
`;
}
