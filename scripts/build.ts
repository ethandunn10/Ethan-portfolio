// Builds every inner page from src/data/*.ts, refreshes the shared header and
// footer on the hand-written pages (home, about), pulls your Substack posts,
// and lists every TODO still left. Run from the repo root:
//
//     node scripts/build.ts
//
// Plain Node (v23.6+ runs .ts directly). No npm install, nothing to deploy:
// commit the HTML it writes.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { header, footer, page } from '../src/layout.ts';
import { icon } from '../src/icons.ts';
import { isTodo, type Maybe } from '../src/data/todo.ts';
import { projects, type Project, type Lesson } from '../src/data/projects.ts';
import { videos, type Reel } from '../src/data/videos.ts';
import { writing, type Post } from '../src/data/writing.ts';
import { resources } from '../src/data/resources.ts';
import { now } from '../src/data/now.ts';
import { work } from '../src/data/work.ts';
import { log } from '../src/data/log.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/* ------------------------------------------------------------ helpers */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const has = <T,>(v: Maybe<T>): v is T => !isTodo(v);
const EXT = ' target="_blank" rel="noopener"';
const ext = (href: string) => (/^https?:/.test(href) ? EXT : '');
const NEW_TAB = '<span class="sr-only"> (opens in a new tab)</span>';

/** black-and-white hatched box standing in for a missing image */
const placeholder = (label: string, iconName = 'image', cls = '') =>
  `<div class="ph${cls ? ' ' + cls : ''}" role="img" aria-label="${esc(label)}"><span class="ph-label">${icon(iconName, 18)}${esc(label)}</span></div>`;

/** stands in for missing text */
const missing = (text = 'Coming soon') => `<p class="missing reveal">${icon('clock', 16)}${esc(text)}</p>`;

function button(label: string, href: string, opts: { ghost?: boolean; icon?: string; out?: boolean } = {}) {
  const external = /^https?:/.test(href);
  const lead = opts.icon ? icon(opts.icon, 18) : '';
  const tail = opts.out ?? external ? icon('arrow-up-right', 18, 'btn-arrow') : '';
  return `<a class="btn${opts.ghost ? ' btn--ghost' : ''}" href="${esc(href)}"${ext(href)}>${lead}${esc(label)}${tail}${external ? NEW_TAB : ''}</a>`;
}

const chips = (list: string[], cls = '') =>
  list.length ? `<ul class="chips${cls ? ' ' + cls : ''}" role="list">${list.map((c) => `<li class="chip">${esc(c)}</li>`).join('')}</ul>` : '';

const secHead = (iconName: string, title: string, id: string) =>
  `<div class="sec-head reveal"><span class="sec-icon">${icon(iconName, 22)}</span><h2 id="${id}">${esc(title)}</h2></div>`;

function intro(label: string, title: string, lead: Maybe<string> | null, extra = '', titleHtml?: string) {
  const leadHtml = lead === null ? '' : has(lead) ? `<p class="page-lead reveal">${esc(lead)}</p>` : missing('Description coming soon');
  return `    <section class="section page-intro" aria-labelledby="page-title">
      <div class="wrap">
        <p class="section-label reveal">${esc(label)}</p>
        <h1 class="section-title reveal" id="page-title">${titleHtml ?? esc(title)}</h1>
        ${leadHtml}
        ${extra}
      </div>
    </section>`;
}

const block = (inner: string, cls = '') =>
  `    <section class="section block${cls ? ' ' + cls : ''}">
      <div class="wrap">
${inner}
      </div>
    </section>`;

const fmtDate = (iso: string) =>
  new Date(iso + (iso.length === 10 ? 'T12:00:00Z' : '')).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

function write(path: string, title: string, description: string, main: string) {
  const file = join(ROOT, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page({ path, title: `${title} · Ethan Dunn`, description, main }));
  built.push(path);
}
const built: string[] = [];

/* ------------------------------------------------------------ projects */

function media(p: Project) {
  if (!has(p.media)) return placeholder('Screenshot coming soon', 'image', 'ph--wide');
  if ('phones' in p.media) {
    return `<div class="phones">${p.media.phones.map((i) => `<img src="${i.src}" alt="${esc(i.alt)}" width="780" height="1688" loading="lazy">`).join('')}</div>`;
  }
  return `<img class="shot" src="${p.media.image.src}" alt="${esc(p.media.image.alt)}" loading="lazy">`;
}

function projectPage(p: Project, next: Project) {
  const links = p.links.filter((l) => has(l.href));
  const buttons = links.length
    ? `<div class="btn-row reveal">${links.map((l, i) => button(l.label, l.href as string, { ghost: i > 0 })).join('')}</div>` : '';
  const title = `<span class="title-with-icon"><span class="icon-box"><img src="${p.icon.src}" alt="${esc(p.icon.alt)}"></span>${esc(p.name)}</span>`;

  const built = [
    has(p.built) ? `<p class="prose reveal">${esc(p.built)}</p>` : '',
    has(p.features)
      ? `<div class="features features--${p.features.length}">${p.features.map((f) => `<article class="feature reveal">${icon(f.icon, 26)}<h3>${esc(f.title)}</h3><p>${esc(f.line)}</p></article>`).join('')}</div>`
      : '',
  ].join('\n') || missing();

  const main = [
    intro('Project', p.name, p.tagline, chips(p.chips, 'reveal') + buttons, title),
    `    <section class="case-media" aria-label="Screenshots">
      <div class="wrap"><div class="media-frame reveal">${media(p)}</div></div>
    </section>`,
    block(`${secHead('circle-alert', 'The problem', 'problem')}
        ${has(p.problem) ? `<p class="prose prose--big reveal">${esc(p.problem)}</p>` : missing()}
        ${p.sustainability === undefined ? '' : has(p.sustainability) ? `<p class="prose reveal">${esc(p.sustainability)}</p>` : missing('Why it fits the sustainability theme: coming soon')}`),
    block(`${secHead('hammer', 'What I built', 'built')}
        ${built}`),
    block(`${secHead('code-xml', 'How I built it', 'how')}
        ${has(p.tools) ? chips(p.tools, 'chips--big reveal') : missing()}
        ${p.toolsNote ? `<p class="prose tools-note reveal">${esc(p.toolsNote)}</p>` : ''}`),
    block(`${secHead('trophy', 'Results', 'results')}
        ${has(p.results) ? `<dl class="big-stats">${p.results.map((r) => `<div class="big-stat reveal"><dt>${esc(r.label)}</dt><dd>${esc(r.value)}</dd></div>`).join('')}</dl>` : missing()}`),
    block(`${secHead('lightbulb', 'What I learned', 'learned')}
        ${!has(p.learned) ? missing('Coming soon. I’m writing this part.')
          : typeof p.learned[0] === 'string'
            ? `<ul class="bullets">${(p.learned as string[]).map((l) => `<li class="reveal">${icon('arrow-right', 18)}<span>${esc(l)}</span></li>`).join('')}</ul>`
            : `<div class="features features--3 lessons">${(p.learned as Lesson[]).map((l) => `<article class="feature reveal">${icon(l.icon, 26)}<h3>${esc(l.title)}</h3><p>${esc(l.text)}</p></article>`).join('')}</div>`}`),
    block(`<a class="next-card reveal" href="/projects/${next.slug}/">
          <span class="next-label">Next project</span>
          <span class="next-name">${esc(next.name)} ${icon('arrow-right', 36, 'next-arrow')}</span>
        </a>`, 'block--next'),
  ].join('\n');

  const desc = has(p.tagline) ? `${p.name}: ${p.tagline}` : `${p.name}, a project by Ethan Dunn.`;
  write(`/projects/${p.slug}/`, p.name, desc, main);
}

function projectsIndex() {
  const tiles = projects.map((p) => {
    const img = has(p.card.image)
      ? `<img${p.card.image.phone ? ' class="is-phone"' : ''} src="${p.card.image.src}" alt="${esc(p.card.image.alt)}" loading="lazy">`
      : placeholder('Screenshot coming soon');
    return `<a class="tile project-tile reveal" href="/projects/${p.slug}/">
            <div class="tile-media">${img}</div>
            <div class="tile-body">
              ${chips([p.card.chip])}
              <h2>${esc(p.name)}</h2>
              <p>${esc(p.card.line)}</p>
              <span class="tile-more">Read the case study ${icon('arrow-right', 18, 'tile-arrow')}</span>
            </div>
          </a>`;
  }).join('\n          ');
  write('/projects/', 'Projects', 'Apps and tools Ethan Dunn has built.', [
    intro('Projects', 'Things I’ve built.', 'Apps, hackathon projects, and tools.'),
    block(`<div class="tile-grid">
          ${tiles}
        </div>`, 'block--flush'),
  ].join('\n'));
}

/* ------------------------------------------------------------ videos */

function youtubeId(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/** ReelCard: our own 9:16 player (poster, play on click, one at a time — see /reels.js).
 *  A reel without a file yet shows a placeholder. */
function reelCards(list: Reel[]) {
  const cards = list.map((r) => {
    const ready = has(r.file);
    const title = has(r.title) ? esc(r.title) : ready ? '' : 'Coming soon';
    const label = title || 'Reel';
    const shape = r.width && r.height ? ` style="aspect-ratio: ${r.width} / ${r.height}"` : '';
    const player = ready
      ? `<button class="reel-card" type="button" aria-label="Play reel: ${label}"${shape}>
                <video src="${esc(r.file as string)}"${has(r.poster) ? ` poster="${esc(r.poster)}"` : ''} preload="metadata" playsinline></video>
                <span class="reel-play" aria-hidden="true">${icon('play', 26)}</span>
              </button>`
      : `<div class="reel-card is-empty">${placeholder('Reel coming soon', 'video')}</div>`;
    const views = has(r.views) ? `<span class="reel-views">${icon('eye', 16)}${esc(r.views)}</span>` : '';
    const ig = has(r.instagramUrl) ? `<a class="reel-ig" href="${esc(r.instagramUrl)}"${EXT}>Watch on Instagram ${icon('arrow-up-right', 14)}${NEW_TAB}</a>` : '';
    return `<li class="reel reveal">
              ${player}
              ${title || views || ig ? `<div class="reel-meta">${title ? `<h3>${title}</h3>` : ''}${views}${ig}</div>` : ''}
            </li>`;
  }).join('\n            ');
  const script = list.some((r) => has(r.file)) ? '\n        <script src="/reels.js" defer></script>' : '';
  const wide = list.some((r) => r.width && r.height && r.width > r.height);
  const hint = list.length > 1
    ? `\n          <div class="reel-hint" aria-hidden="true"><span class="reel-hint-label">Swipe for more ${icon('arrow-right', 16)}</span><span class="reel-dots">${list.map(() => '<span></span>').join('')}</span></div>`
    : '';
  return { html: `<div class="reel-scroller">\n          <ul class="reel-row${wide ? ' reel-row--wide' : ''}" role="list">\n            ${cards}\n          </ul>${hint}\n        </div>${script}` };
}

function videosPage() {
  const stats = `<ul class="stat-cards" role="list">${videos.stats.map((s) =>
    `<li class="stat-card reveal">${icon(s.icon, 26)}<strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></li>`).join('')}</ul>
        <ul class="milestones reveal" role="list">${videos.milestones.map((m) => `<li>${icon('check', 16)}${esc(m)}</li>`).join('')}</ul>`;

  const f = videos.featured;
  const id = youtubeId(f.url);
  const featured = `<div class="featured">
          <div class="featured-text reveal">
            <p class="section-label">${esc(f.label)}</p>
            <h2 id="featured">${esc(f.title)}</h2>
            <p>${esc(f.text)}</p>
            <div class="btn-row">
              ${button('Watch on YouTube', f.url)}
              ${button('Subscribe', videos.youtube, { ghost: true })}
            </div>
          </div>
          <div class="featured-video reveal"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${esc(f.title)}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
        </div>`;

  write('/videos/', 'Videos', 'Reels and YouTube videos from Ethan Dunn.', [
    intro('Content', 'Videos', videos.intro, stats),
    block(featured),
    // "Latest on YouTube" was removed: it duplicated the featured video.
    // Bring it back as 3 small thumbnail cards once there are 3+ long videos
    // (uploads playlist = videos.youtubeChannelId with "UC" swapped for "UU").
    block(`${secHead('instagram', 'Reels', 'reels')}
        ${reelCards(videos.reels).html}`),
    block(`<div class="btn-row reveal">
          ${button('Follow on Instagram', videos.instagram, { icon: 'instagram' })}
          ${button('Subscribe on YouTube', videos.youtube, { icon: 'youtube', ghost: true })}
        </div>`, 'block--tight'),
  ].join('\n'));
}

/* ------------------------------------------------------------ writing */

const decode = (s: string) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&quot;/g, '"').replace(/&apos;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .trim();

async function substackPosts(): Promise<{ posts: Post[]; from: string }> {
  try {
    const res = await fetch(writing.feed, { signal: AbortSignal.timeout(10000), headers: { 'User-Agent': 'portfolio-build' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => {
      const tag = (t: string) => decode(it.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`))?.[1] ?? '');
      const body = it.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/)?.[1] ?? '';
      const words = decode(body).replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
      return {
        title: tag('title'),
        url: tag('link'),
        date: new Date(tag('pubDate')).toISOString().slice(0, 10),
        preview: tag('description'),
        cover: it.match(/<enclosure[^>]*url="([^"]+)"/)?.[1],
        readMinutes: Math.max(1, Math.round(words / 225)),
      };
    }).filter((p) => p.title && p.url);
    if (!items.length) throw new Error('no posts in feed');
    return { posts: items, from: 'Substack RSS' };
  } catch (e) {
    return { posts: writing.posts, from: `writing.ts fallback (feed failed: ${(e as Error).message})` };
  }
}

function writingPage(posts: Post[]) {
  const cards = posts.map((p) => `<a class="essay tile reveal" href="${esc(p.url)}"${EXT}>
          <div class="tile-media">${p.cover ? `<img src="${esc(p.cover)}" alt="" loading="lazy">` : placeholder('Cover image')}</div>
          <div class="tile-body">
            <p class="meta">${icon('calendar', 16)}<time datetime="${p.date}">${fmtDate(p.date)}</time><span aria-hidden="true">·</span>${icon('clock', 16)}${p.readMinutes} min read</p>
            <h2>${esc(p.title)}</h2>
            <p>${esc(p.preview)}</p>
            <span class="tile-more">Read on Substack ${icon('arrow-right', 18, 'tile-arrow')}</span>
          </div>${NEW_TAB}
        </a>`).join('\n        ');
  write('/writing/', 'Writing', 'Essays by Ethan Dunn on Substack.', [
    intro('Content', 'Writing', writing.intro),
    block(`<div class="essays">
        ${cards}
        <div class="soon soon--wide reveal">${icon('mail', 28)}<h3>${esc(writing.newsletter.name)}</h3><p>${esc(writing.newsletter.note)}</p></div>
        </div>
        <a class="text-link big-link reveal" href="${writing.substack}"${EXT}>Read everything on Substack ${icon('arrow-up-right', 20)}${NEW_TAB}</a>`, 'block--flush'),
  ].join('\n'));
}

/* ------------------------------------------------------------ resources */

function resourcesPage() {
  const g = resources.guide;
  const cover = has(g.cover)
    ? `<img src="${g.cover.src}" alt="${esc(g.cover.alt)}">`
    : placeholder('Cover coming soon', 'book-open');
  const cta = has(g.link) ? button(g.button, g.link) : `<p class="missing">${icon('clock', 16)}Link coming soon</p>`;
  const tools = resources.tools.map((t) => `<li class="reveal"><a class="tool tile" href="${t.url}"${EXT}>
            ${icon(t.icon, 28)}
            <h3>${esc(t.name)}</h3>
            <p>${esc(t.line)}</p>
            ${icon('arrow-up-right', 20, 'tool-arrow')}${NEW_TAB}
          </a></li>`).join('\n          ');

  write('/resources/', 'Resources', 'Free guides and the tools Ethan Dunn uses.', [
    intro('Content', 'Resources', resources.subtitle),
    block(`<article class="guide reveal" aria-labelledby="guide-title">
          <div class="guide-cover">${cover}</div>
          <div class="guide-body">
            <span class="chip chip--solid">${esc(g.pill)}</span>
            <h2 id="guide-title">${esc(g.title)}</h2>
            <p class="guide-line">${esc(g.line)}</p>
            <p>${esc(g.story)}</p>
            <p class="guide-details">${icon('book-open', 16)}${esc(g.details)}</p>
            <ul class="checks">${g.learn.map((l) => `<li>${icon('check', 20)}<span>${esc(l)}</span></li>`).join('')}</ul>
            ${cta}
          </div>
        </article>`, 'block--flush'),
    block(`${secHead('hammer', 'Tools I use', 'tools')}
        <ul class="tool-grid" role="list">
          ${tools}
          <li class="reveal"><div class="soon">${icon('plus', 28)}<h3>Coming soon</h3><p>${esc(resources.comingSoon)}</p></div></li>
        </ul>`),
    block(`<div class="cta-block reveal">
          <h2>${esc(resources.cta.title)}</h2>
          <div class="btn-row">
            ${button('Follow on Instagram', resources.cta.instagram, { icon: 'instagram' })}
            ${button('Read on Substack', resources.cta.substack, { icon: 'newspaper', ghost: true })}
          </div>
        </div>`),
  ].join('\n'));
}

/* ------------------------------------------------------------ now */

function nowPage() {
  const STEP: Record<string, [string, string]> = {
    'done': ['circle-check', 'Done'],
    'in-progress': ['loader', 'In progress'],
    'todo': ['circle-dashed', 'To do'],
  };
  const cards = now.focus.filter((f) => f.show !== false).map((f) => {
    const extra = [
      f.detail ? `<p>${esc(f.detail)}</p>` : '',
      f.checklist ? `<ul class="steps">${f.checklist.map((s) => `<li class="step step--${s.state}">${icon(STEP[s.state][0], 20)}<span>${esc(s.label)}</span><em>${STEP[s.state][1]}</em></li>`).join('')}</ul>` : '',
      f.chips ? chips(f.chips) : '',
      f.buttons ? `<div class="focus-links">${f.buttons.map((b) => `<a class="text-link" href="${b.href}"${ext(b.href)}>${esc(b.label)} ${icon(/^https?:/.test(b.href) ? 'arrow-up-right' : 'arrow-right', 18)}${/^https?:/.test(b.href) ? NEW_TAB : ''}</a>`).join('')}</div>` : '',
    ].join('');
    return `<article class="focus reveal">
            <p class="focus-label">${icon(f.icon, 22)}${esc(f.label)}</p>
            <h2>${esc(f.headline)}</h2>
            ${extra}
          </article>`;
  }).join('\n          ');

  const live = `<p class="live reveal"><span class="live-dot" aria-hidden="true"></span>Last updated: <time datetime="${now.updated}">${new Date(now.updated + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}</time></p>`;

  write('/now/', 'Now', 'What Ethan Dunn is focused on right now.', [
    intro('Now', 'What I’m doing now.', now.intro, live),
    block(`<div class="focus-grid">
          ${cards}
        </div>`, 'block--flush'),
    block(`${secHead('target', 'Goals this month', 'goals')}
        <ul class="goals">${now.goals.map((g) => `<li class="reveal${g.done ? ' is-done' : ''}">${icon(g.done ? 'circle-check' : 'circle', 26)}<span>${esc(g.label)}</span><span class="sr-only">${g.done ? ' (done)' : ' (not done yet)'}</span></li>`).join('')}</ul>`),
    block(`${secHead('trophy', 'Recent wins', 'wins')}
        <ol class="wins">${now.wins.map((w) => `<li class="reveal"><span class="win-when">${esc(w.when)}</span><span class="win-what">${icon('check', 20)}${esc(w.what)}</span></li>`).join('')}</ol>`),
    block(`${secHead('instagram', 'Latest reels', 'latest-reels')}
        ${reelCards(videos.reels).html}`),
    block(`${secHead('book-open', 'Currently learning', 'learning')}
        ${chips(now.learning, 'chips--big reveal')}`),
    block(`${secHead('ban', 'Not doing right now', 'not-doing')}
        <ul class="bullets">${now.notDoing.map((n) => `<li class="reveal">${icon('x', 18)}<span><strong>${esc(n.name)}.</strong> ${esc(n.why)}</span></li>`).join('')}</ul>`),
    block(`<div class="cta-block reveal">
          <h2>Want to follow along?</h2>
          <div class="btn-row">
            ${button('Instagram', now.follow.instagram, { icon: 'instagram' })}
            ${button('YouTube', now.follow.youtube, { icon: 'youtube', ghost: true })}
            ${button('LinkedIn', now.follow.linkedin, { icon: 'linkedin', ghost: true })}
            ${button('Substack', now.follow.substack, { icon: 'newspaper', ghost: true })}
          </div>
        </div>`),
  ].join('\n'));
}

/* ------------------------------------------------------------ work with me */

function workPage() {
  const offers = work.offers.map((o) => `<article class="card offer reveal">
            <span class="sec-icon">${icon(o.icon, 22)}</span>
            <h2>${esc(o.title)}</h2>
            <p>${esc(o.line)}</p>
            ${button(o.button.label, o.button.href)}
          </article>`).join('\n          ');
  write('/work-with-me/', 'Work with me', 'Brand deals, UGC, and design work with Ethan Dunn.', [
    intro('Work with me', 'Let’s make something.', work.lead),
    block(`<div class="offer-grid">
          ${offers}
        </div>`, 'block--flush'),
    block(`${secHead('mail', 'Contact', 'contact')}
        <a class="big-email reveal" href="mailto:${work.email}">${esc(work.email)}</a>
        <div class="btn-row reveal">${button('DM me on Instagram', work.instagram, { icon: 'instagram', ghost: true })}</div>`),
  ].join('\n'));
}

/* ------------------------------------------------------------ hand-written pages */

function refreshLayout(path: string) {
  const file = join(ROOT, path, 'index.html');
  let html = readFileSync(file, 'utf8');
  html = html
    .replace(/<!-- layout:header -->[\s\S]*?<!-- \/layout:header -->/, () => `<!-- layout:header -->\n${header(path)}\n<!-- /layout:header -->`)
    .replace(/<!-- layout:footer -->[\s\S]*?<!-- \/layout:footer -->/, () => `<!-- layout:footer -->\n${footer(path)}\n<!-- /layout:footer -->`);
  writeFileSync(file, html);
  built.push(path + ' (header/footer)');
}

function aboutLog() {
  const fmt = (d: string) => {
    const [y, m, day] = d.split('-');
    const yy = y.slice(2);
    return day ? `${m}.${day}.${yy}` : m ? `${m}.${yy}` : y;
  };
  const items = [...log].sort((a, b) => b.date.localeCompare(a.date)).map((e) => `          <li class="reveal">
            <time datetime="${e.date}">${fmt(e.date)}</time>
            <span>${esc(e.text)}</span>
          </li>`).join('\n');
  const file = join(ROOT, 'about', 'index.html');
  const html = readFileSync(file, 'utf8').replace(/<!-- log:start -->[\s\S]*?<!-- log:end -->/,
    () => `<!-- log:start -->\n        <ol class="log">\n${items}\n        </ol>\n        <!-- log:end -->`);
  writeFileSync(file, html);
}

/* ------------------------------------------------------------ TODO report */

function todos(value: unknown, out: string[] = []): string[] {
  if (isTodo(value)) out.push(value.todo);
  else if (Array.isArray(value)) value.forEach((v) => todos(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => todos(v, out));
  return out;
}

/* ------------------------------------------------------------ go */

projects.forEach((p, i) => projectPage(p, projects[(i + 1) % projects.length]));
projectsIndex();
videosPage();
const feed = await substackPosts();
writingPage(feed.posts);
resourcesPage();
nowPage();
workPage();
refreshLayout('/');
refreshLayout('/about/');
aboutLog();

console.log('built:', built.join(', '));
console.log('writing posts from:', feed.from);
const left = todos({ projects, videos, resources, now, work, writing, log });
console.log(`\nTODO (${left.length}):`);
left.forEach((t) => console.log('  - ' + t));
