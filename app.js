/* Blu Shore · blushore.live
   Edit LINKS to change where buttons go. Releases come from assets/data.js (tools/update-releases.py refreshes it). */

const LINKS = {
  spotify:   'https://open.spotify.com/artist/5wiI6jfbvRuUZQ1pryeWIn',
  apple:     'https://music.apple.com/us/artist/blu-shore/1459654092',
  ytmusic:   'https://music.youtube.com/@blushore',
  amazon:    'https://music.amazon.in/artists/B07QMW9256/blu-shore',
  tidal:     'https://tidal.com/artist/15514249',
  jiosaavn:  'https://www.jiosaavn.com/artist/blu-shore-songs/envRFB65u3g_',
  youtube:   'https://www.youtube.com/@blushore',
  twitch:    'https://www.twitch.tv/blushorelive',
  instagram: 'https://www.instagram.com/blushore_/',
  email:     '',            // e.g. 'blu@blushore.live'                 (hidden while empty)
  metroMac:      'https://github.com/blushore/metro/releases/latest/download/LP33-Apple-Silicon.dmg', // LP33 for Apple Silicon Macs (repo blushore/metro, release lp33-1.0)
  metroMacIntel: 'https://github.com/blushore/metro/releases/latest/download/LP33-Intel.dmg',         // LP33 for Intel Macs
  lp33Windows:   '',  // LP33 for Windows (installer or Microsoft Store link)        (hidden while empty)
  lp33AppStore:  '',  // LP33 on the App Store, iPhone and iPad                     (hidden while empty)
  lp33Play:      '',  // LP33 on Google Play                                         (hidden while empty)
};
const TWITCH_CHANNEL = 'blushorelive';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const EASE = 'cubic-bezier(.7,0,.2,1)';

const REL = (window.RELEASES || []).slice().sort((a, b) => b.date.localeCompare(a.date));
const PAGES = ['home', 'music', 'apps', 'yohaku', 'live'];
const LABEL = { home: 'Blu Shore', music: 'Music', apps: 'Apps', yohaku: 'Yohaku', live: 'Live' };
const fmtDate = d => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const mmss = ms => { const s = Math.round(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const pad2 = n => String(n).padStart(2, '0');
const pageUrl = name => (name === 'home' ? location.pathname + location.search : '#' + name); /* home keeps a clean address, no #home */

/* ───────── smooth scroll ───────── */
const lenis = window.Lenis ? new Lenis({ lerp: .085, wheelMultiplier: .9, smoothWheel: !reduce }) : null;
const scrollTop = () => (lenis ? lenis.scroll : window.scrollY);
const scrollToTop = () => (lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0));
lenis && lenis.stop();

/* ───────── links ───────── */
$$('[data-link]').forEach(a => {
  const k = a.dataset.link, u = LINKS[k];
  if (!u) { a.remove(); return; }
  a.href = k === 'email' ? 'mailto:' + u : u;
});
$('#yr').textContent = new Date().getFullYear();
const LISTEN = [['Spotify', LINKS.spotify], ['Apple Music', LINKS.apple], ['YouTube Music', LINKS.ytmusic], ['Amazon Music', LINKS.amazon], ['Tidal', LINKS.tidal], ['JioSaavn', LINKS.jiosaavn]].filter(x => x[1]);
const EXT = [['Spotify', LINKS.spotify], ['Apple Music', LINKS.apple], ['YouTube', LINKS.youtube], ['Instagram', LINKS.instagram], ['Twitch', LINKS.twitch], ['Email', LINKS.email && 'mailto:' + LINKS.email]].filter(x => x[1]);
$('#extLinks').innerHTML = LISTEN.map(([n, u], i) => `<a class="pill${i ? ' ghost' : ''}" href="${u}" ${u.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${n}</a>`).join('');
$('#menuLinks').innerHTML = EXT.map(([n, u]) => `<a href="${u}" ${u.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${n}</a>`).join('');
$$('.menu-list li').forEach((li, i) => li.style.setProperty('--i', i));

/* ───────── text + reveals ───────── */
function split(el) {
  let n = 0;
  const walk = node => [...node.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(tok => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) { f.append(' '); return; }
        const w = document.createElement('span'), i = document.createElement('i');
        w.className = 'w'; i.textContent = tok; i.style.setProperty('--w', n++); w.append(i); f.append(w);
      });
      c.replaceWith(f);
    } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
  });
  walk(el);
}
$$('[data-split]').forEach(split);

const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add(e.target.hasAttribute('data-split') ? 'in' : 'on');
  io.unobserve(e.target);
}), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
function arm(root) {
  $$('[data-r]', root).forEach((el, i) => { if (!el.style.getPropertyValue('--rd')) el.style.setProperty('--rd', (i % 8) * .07 + 's'); });
  $$('[data-split], [data-r]', root).forEach(el => {
    if (el.classList.contains('in') || el.classList.contains('on')) return;
    if (el.classList.contains('h-lede') && document.body.classList.contains('is-intro')) return;
    io.observe(el);
  });
}

/* ───────── audio ───────── */
const audio = $('#audio');
const mini = $('#mini');
let curRel = null, curIdx = 0, fadeId = 0;
// The track that plays when someone turns sound on (intro "Enter" or the sound button). Not in the Music index.
// TODO: swap `art` for the Patterns cover when it exists.
const DEFAULT = { id: 'patterns', title: 'Patterns', kind: 'Unreleased', art: 'assets/img/blu.jpg', tracks: [{ t: 'Patterns', p: 'assets/audio/patterns.m4a' }] };
const playable = r => r.tracks.map((t, i) => (t.p ? i : -1)).filter(i => i >= 0);

/* Fades: every start, pause, track change and clip end ramps the volume. Timer-based (not rAF) so it still finishes in a
   background tab. iOS Safari ignores audio.volume, so there it falls back to instant start/stop with no waiting. */
const canVol = (() => { const a = new Audio(); a.volume = .5; return a.volume === .5; })();
const level = () => (curRel === DEFAULT ? .7 : 1);
let stopping = false, endFade = false;
function ramp(to, ms, done) {
  clearInterval(fadeId);
  if (!canVol || ms <= 0) { if (canVol) audio.volume = to; done && done(); return; }
  const from = audio.volume, t0 = performance.now();
  fadeId = setInterval(() => {
    const k = clamp((performance.now() - t0) / ms); audio.volume = clamp(from + (to - from) * ease(k));
    if (k >= 1) { clearInterval(fadeId); done && done(); }
  }, 16);
}
function play(rel, i, quiet) {
  const t = rel.tracks[i];
  if (!t || !t.p) return;
  const go = () => {
    curRel = rel; curIdx = i; stopping = endFade = false;
    audio.src = t.p;
    if (canVol) audio.volume = 0;
    audio.play().catch(() => {});
    ramp(level(), quiet ? 1800 : 700);
    syncUI(); setMedia(); peekMini();
  };
  if (curRel && !audio.paused && !stopping) ramp(0, 350, go); else go(); // fade the old track out first
}
function resume() { stopping = endFade = false; if (canVol) audio.volume = 0; audio.play().catch(() => {}); ramp(level(), 600); }
function pause() { stopping = true; ramp(0, 400, () => { if (stopping) audio.pause(); stopping = false; }); }
function step(dir) {
  if (!curRel) return;
  const list = playable(curRel), pos = list.indexOf(curIdx) + dir;
  if (pos >= 0 && pos < list.length) return play(curRel, list[pos]);
  if (curRel === DEFAULT) { const r = REL[0], pl = playable(r); return dir > 0 ? pl.length && play(r, pl[0]) : play(DEFAULT, 0); }
  const ri = (REL.indexOf(curRel) + dir + REL.length) % REL.length, r = REL[ri], pl = playable(r);
  if (pl.length) play(r, dir > 0 ? pl[0] : pl[pl.length - 1]);
}
function toggleAudio() {
  if (!curRel) { play(DEFAULT, 0, true); return; }
  if (audio.paused || stopping) resume(); else pause();
}
// a release plays through on its own, but never runs on into the next release (or from Patterns into one)
audio.addEventListener('ended', () => {
  const list = playable(curRel), pos = list.indexOf(curIdx) + 1;
  if (curRel !== DEFAULT && pos < list.length) play(curRel, list[pos]);
  else { audio.currentTime = 0; syncUI(); }
});
['play', 'pause'].forEach(ev => audio.addEventListener(ev, syncUI));
audio.addEventListener('timeupdate', () => {
  const left = audio.duration - audio.currentTime;
  if (left < 1.6 && !endFade && !stopping) { endFade = true; ramp(0, left * 1000); } // previews stop dead at 30s; ease them out
  if (audio.duration) {
    const p = audio.currentTime / audio.duration;
    $('#miniProg').style.setProperty('--p', p);
    const bar = $('.tr.playing .bar'); if (bar) bar.style.transform = `scaleX(${p})`;
  }
});
function syncUI() {
  const on = !!curRel && !audio.paused;
  $('#snd').classList.toggle('on', on);
  $('#snd').setAttribute('aria-pressed', on);
  if (curRel) {
    if (mini.hidden) { mini.hidden = false; document.body.classList.add('has-mini'); }
    mini.classList.toggle('play', on);
    $('#miniArt').src = curRel.art;
    $('#miniTitle').textContent = curRel.tracks[curIdx].t;
    $('#miniSub').textContent = curRel.title + ' · ' + curRel.kind;
    $('#miniToggle .pp').setAttribute('d', on ? 'M7 5v14M17 5v14' : 'M8 5.5v13l11-6.5z');
  }
  $$('.row').forEach(r => r.classList.toggle('playing', on && curRel && r.dataset.id === curRel.id));
  $$('.tr').forEach(t => {
    const p = on && curRel && sheetRel && sheetRel.id === curRel.id && +t.dataset.i === curIdx;
    t.classList.toggle('playing', !!p);
    if (!p) $('.bar', t).style.transform = 'scaleX(0)';
  });
  $('#shVinyl').classList.toggle('spin', on && !!sheetRel && !!curRel && sheetRel.id === curRel.id);
}
function setMedia() {
  if (!('mediaSession' in navigator) || !curRel) return;
  navigator.mediaSession.metadata = new MediaMetadata({ title: curRel.tracks[curIdx].t, artist: 'Blu Shore', album: curRel.title, artwork: [{ src: curRel.art, sizes: '600x600', type: 'image/jpeg' }] });
  navigator.mediaSession.setActionHandler('play', resume);
  navigator.mediaSession.setActionHandler('pause', pause);
  navigator.mediaSession.setActionHandler('nexttrack', () => step(1));
  navigator.mediaSession.setActionHandler('previoustrack', () => step(-1));
}
$('#snd').addEventListener('click', toggleAudio);
$('#miniToggle').addEventListener('click', toggleAudio);
$('#miniNext').addEventListener('click', () => step(1));
$('#miniPrev').addEventListener('click', () => step(-1));

// Dynamic pill: opens on hover/focus/tap, and peeks open for a moment when the track changes.
let miniPeek = 0, miniHold = false, miniHover = false;
function setMini(open) {
  mini.classList.toggle('open', open);
  $('#miniOpen').setAttribute('aria-expanded', open);
}
function peekMini() {
  clearTimeout(miniPeek); setMini(true);
  miniPeek = setTimeout(() => { if (!miniHold) setMini(false); }, 3200);
}
mini.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { miniHover = miniHold = true; clearTimeout(miniPeek); setMini(true); } });
mini.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { miniHover = miniHold = false; setMini(false); } });
mini.addEventListener('focusin', e => { if (e.target.matches(':focus-visible')) { miniHold = true; setMini(true); } });
mini.addEventListener('focusout', e => { if (!miniHover && !mini.contains(e.relatedTarget)) { miniHold = false; setMini(false); } });
$('#miniOpen').addEventListener('click', () => { if (miniHover) return; clearTimeout(miniPeek); miniHold = !mini.classList.contains('open'); setMini(miniHold); });
document.addEventListener('pointerdown', e => { if (!mini.contains(e.target) && mini.classList.contains('open')) { miniHold = false; setMini(false); } });

/* ───────── release sheet ───────── */
const sheet = $('#sheet');
let sheetRel = null, sheetBusy = false, sheetPt = [innerWidth / 2, innerHeight / 2];
function openSheet(rel, x = innerWidth / 2, y = innerHeight / 2) {
  if (sheetBusy || sheet.classList.contains('open')) return;
  sheetBusy = true; sheetRel = rel; sheetPt = [x, y];
  $('#shArt').src = rel.art; $('#shArt').alt = rel.title + ' cover';
  $('#shVinyl i').style.backgroundImage = `url(${rel.art})`;
  $('#shKind').textContent = rel.kind;
  $('#shTitle').textContent = rel.title;
  $('#shMeta').textContent = fmtDate(rel.date) + ' · ' + rel.tracks.length + (rel.tracks.length === 1 ? ' track' : ' tracks') + ' · ' + rel.genre;
  $('#shApple').href = rel.apple;
  $('#shTracks').innerHTML = rel.tracks.map((t, i) => `<li><button class="tr" data-i="${i}" ${t.p ? '' : 'disabled'}><span class="no"><span>${pad2(i + 1)}</span><svg class="bars" viewBox="0 0 16 12" aria-hidden="true"><path d="M2 4v4M6 1v10M10 3v6M14 5v2"/></svg></span><span class="nm">${t.t}</span><span class="du">${mmss(t.ms)}</span><span class="bar"></span></button></li>`).join('');
  sheet.scrollTop = 0;
  sheet.hidden = false; sheet.classList.add('open');
  document.body.classList.add('sheet-open'); lenis && lenis.stop();
  syncUI();
  const open = [`circle(0px at ${x}px ${y}px)`, `circle(150vmax at ${x}px ${y}px)`];
  if (reduce || !sheet.animate) { sheet.style.clipPath = 'none'; sheetBusy = false; return; }
  sheet.animate({ clipPath: open }, { duration: 950, easing: EASE, fill: 'forwards' }).finished.then(() => { sheet.style.clipPath = 'none'; sheet.getAnimations().forEach(a => a.cancel()); sheetBusy = false; });
}
function closeSheet() {
  if (sheetBusy || !sheet.classList.contains('open')) return;
  sheetBusy = true;
  const done = () => {
    sheet.classList.remove('open'); sheet.hidden = true; sheet.style.clipPath = ''; sheet.getAnimations().forEach(a => a.cancel());
    document.body.classList.remove('sheet-open'); lenis && lenis.start(); sheetRel = null; sheetBusy = false; syncUI();
  };
  if (reduce || !sheet.animate) return done();
  const [x, y] = sheetPt;
  sheet.style.clipPath = 'circle(150vmax at 50% 50%)';
  sheet.animate({ clipPath: [`circle(150vmax at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`] }, { duration: 800, easing: EASE, fill: 'forwards' }).finished.then(done);
}
$('#sheetX').addEventListener('click', closeSheet);
$('#shTracks').addEventListener('click', e => {
  const b = e.target.closest('.tr'); if (!b || !sheetRel) return;
  const i = +b.dataset.i;
  if (curRel === sheetRel && curIdx === i) toggleAudio(); else play(sheetRel, i);
});
const byId = id => REL.find(r => r.id === id);

/* ───────── menu ───────── */
const dotBtn = $('#dot');
function setMenu(on) {
  document.body.classList.toggle('menu-open', on);
  $('#menu').setAttribute('aria-hidden', !on);
  dotBtn.setAttribute('aria-expanded', on);
  if (lenis) on ? lenis.stop() : (!document.body.classList.contains('sheet-open') && lenis.start());
}
dotBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (sheet.classList.contains('open')) closeSheet(); else setMenu(false);
});

/* ───────── routing: a black circle opens from the click, then closes onto the new page ───────── */
let cur = 'home', busy = false;
const wipe = $('#wipe');
const hasLayout = {};
function show(name) {
  PAGES.forEach(p => { $('#p-' + p).hidden = p !== name; });
  cur = name;
  document.body.dataset.page = name;
  document.title = $('#p-' + name).dataset.title;
  scrollToTop();
  $$('.menu-list a').forEach(a => a.classList.toggle('cur', a.dataset.go === name));
  arm($('#p-' + name));
  if (name === 'live') checkLive();
  if (name === 'yohaku') ykEnter();
  measure();
}
async function go(name, x = innerWidth / 2, y = 36, fromPop) {
  if (!PAGES.includes(name)) name = 'home';
  if (busy) return;
  if (name === cur) { setMenu(false); if (name === 'home' && lenis) lenis.scrollTo(0, { duration: 1.4 }); return; }
  if (sheet.classList.contains('open')) { sheetBusy = false; sheet.classList.remove('open'); sheet.hidden = true; sheet.style.clipPath = ''; document.body.classList.remove('sheet-open'); sheetRel = null; }
  busy = true;
  if (!fromPop) history.pushState({ p: name }, '', pageUrl(name));
  if (reduce || !wipe.animate) { show(name); setMenu(false); busy = false; return; }
  $('#wipeLabel').textContent = LABEL[name];
  $('#wipeLabel').style.opacity = 0;
  wipe.style.visibility = 'visible';
  const c = `${x}px ${y}px`, mid = `${innerWidth / 2}px ${innerHeight / 2}px`;
  wipe.style.clipPath = `circle(0px at ${c})`;
  await wipe.animate({ clipPath: [`circle(0px at ${c})`, `circle(150vmax at ${c})`] }, { duration: 800, easing: EASE, fill: 'forwards' }).finished;
  wipe.style.clipPath = `circle(150vmax at ${c})`;
  wipe.getAnimations().forEach(a => a.cancel());
  setMenu(false);
  show(name);
  await $('#wipeLabel').animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'ease-out', fill: 'forwards' }).finished;
  await sleep(220);
  await wipe.animate({ clipPath: [`circle(150vmax at ${mid})`, `circle(0px at ${mid})`] }, { duration: 900, easing: EASE, fill: 'forwards' }).finished;
  wipe.style.visibility = 'hidden'; wipe.style.clipPath = ''; wipe.getAnimations().forEach(a => a.cancel());
  $('#wipeLabel').getAnimations().forEach(a => a.cancel());
  busy = false;
}
/* the logo takes you back to the very start: the Enter screen */
$('.logo').addEventListener('click', e => {
  e.preventDefault(); e.stopPropagation();
  try { sessionStorage.removeItem('bs_intro'); } catch (err) {}
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  scrollTo(0, 0);
  history.replaceState({ p: 'home' }, '', pageUrl('home'));
  location.reload();
});
document.addEventListener('click', e => {
  const a = e.target.closest('[data-go]'); if (!a) return;
  e.preventDefault();
  go(a.dataset.go, e.clientX || innerWidth / 2, e.clientY || 36);
});
addEventListener('popstate', () => go(location.hash.slice(1) || 'home', innerWidth / 2, innerHeight / 2, true));

/* ───────── cursor ───────── */
const cursor = $('#cursor');
const mouse = { x: -100, y: -100, cx: -100, cy: -100, px: -100, py: -100, vx: 0 };
if (fine) {
  document.body.classList.add('cur');
  addEventListener('pointermove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    cursor.classList.add('on');
    cursor.classList.toggle('big', !!e.target.closest('a, button, [data-cursor], .row, .fl, .vwrap'));
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.remove('on'));
}

/* ───────── intro ring ───────── */
const intro = $('#intro');
function buildRing() {
  const ring = $('#ring'), rot = document.createElement('div');
  rot.className = 'rot';
  const N = 26, R = Math.max(150, Math.min(innerWidth, innerHeight) * .4), t = clamp(R * .2, 38, 78);
  ring.style.setProperty('--R', R + 'px'); ring.style.setProperty('--t', t + 'px');
  for (let i = 0; i < N; i++) {
    const d = document.createElement('i');
    d.className = 'tile';
    d.style.setProperty('--a', (360 / N) * i + 'deg');
    d.style.setProperty('--d', (i * 0.045).toFixed(2) + 's');
    d.style.backgroundImage = `url(${REL[i % REL.length].art})`;
    rot.append(d);
  }
  ring.append(rot);
  if (fine) addEventListener('pointermove', e => {
    rot.style.translate = `${(e.clientX / innerWidth - .5) * -26}px ${(e.clientY / innerHeight - .5) * -26}px`;
  }, { passive: true });
}
function leaveIntro(sound) {
  if (!intro) return;
  document.body.classList.remove('is-intro');
  intro.classList.add('out');
  lenis && lenis.start();
  setTimeout(() => $('.h-lede').classList.add('in'), 500);
  setTimeout(() => intro.remove(), 1500);
  if (sound) play(DEFAULT, 0, true);
  try { sessionStorage.setItem('bs_intro', '1'); } catch (e) {}
}
$('#enter').addEventListener('click', () => leaveIntro(true));
$('#enterMute').addEventListener('click', () => leaveIntro(false));

/* ───────── home content ───────── */
const floaters = $('#floaters');
/* Browse screen: every cover opens the release it belongs to. Covers sit in a jittered grid around the title;
   depth (z) sets size, blur and brightness, and how far each one moves with scroll and mouse. */
const FL = [];
(function () {
  const seed = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const rnd = seed(26), order = [];
  REL.forEach(r => { // newest first: each release cover, then the covers of its tracks
    order.push({ art: r.art, title: r.title, sub: r.kind + ' · ' + r.date.slice(0, 4), id: r.id });
    (window.ARTWORKS || []).filter(a => a.id === r.id).forEach(a => order.push({ art: a.art, title: a.title, sub: 'From ' + r.title, id: r.id }));
  });
  const n = order.length, outer = Math.ceil(n * .6);
  order.forEach((it, i) => {
    const ring = i < outer ? 1 : 0, k = ring ? i : i - outer, count = ring ? outer : n - outer, f = document.createElement('div');
    f.className = 'fl' + (ring ? '' : ' in');
    f.innerHTML = `<button type="button" aria-label="${it.title}, ${it.sub}" data-id="${it.id}"><img src="${it.art}" alt="" loading="lazy"></button><span class="fl-cap" aria-hidden="true"><b>${it.title}</b><small>${it.sub}</small></span>`;
    floaters.append(f);
    FL.push({ el: f, ring, rank: i, a: -Math.PI / 2 + (k + (ring ? 0 : .5)) / count * Math.PI * 2, rot: (rnd() - .5) * 36, ox: rnd() - .5, oy: rnd() - .5, s: 1 });
  });
})();
const fm = { x: 0, y: 0 };
let orbit = 0, flHold = false;
function measureFL() {
  const W = floaters.clientWidth, H = floaters.clientHeight, base = Math.min(W, H * (W < 700 ? .55 : 1));
  FL.forEach(o => { o.s = Math.round(base * (o.ring ? .14 : .105)); o.el.style.setProperty('--s', o.s + 'px'); });
}
measureFL(); addEventListener('resize', measureFL);
floaters.addEventListener('pointerover', e => { flHold = !!e.target.closest('.fl'); });
floaters.addEventListener('pointerleave', () => { flHold = false; });
floaters.addEventListener('click', e => { const b = e.target.closest('button'); if (b) openSheet(byId(b.dataset.id), e.clientX, e.clientY); });

const latest = REL[0];
if (latest) {
  const art = $('#lvArt'); art.setAttribute('aria-label', latest.title + ' cover');
  art.style.setProperty('--art', `url(${latest.art})`);
  $('#lvVinyl i').style.backgroundImage = `url(${latest.art})`;
  /* the cover arrives cut into vertical strips that slide in from above and below and lock together (frame() moves them) */
  const N = innerWidth < 700 ? 9 : 13;
  for (let i = 0; i < N; i++) {
    const s = document.createElement('i');
    s.style.cssText = `left:${(i * 100 / N).toFixed(3)}%;width:${(100 / N).toFixed(3)}%;background-size:${N * 100}% 100%;background-position:${(i / (N - 1) * 100).toFixed(3)}% 0`;
    art.append(s);
  }
  $('#lvTitle').textContent = latest.title;
  $('#lvMeta').textContent = latest.kind + ' · ' + fmtDate(latest.date);
  $('#lvOpen').addEventListener('click', e => openSheet(latest, e.clientX, e.clientY));
  $('#vwrap').addEventListener('click', e => openSheet(latest, e.clientX, e.clientY));
}

/* ───────── music index ───────── */
const index = $('#index');
index.innerHTML = REL.map(r => `<li class="row" data-r data-id="${r.id}" style="--c:${(window.COLORS || {})[r.id] || '#fff'}" data-k="${r.kind}" tabindex="0" role="button" aria-label="${r.title}"><span class="y">${r.date.slice(0, 4)}</span><img class="th" src="${r.art}" alt="" loading="lazy"><span class="t">${r.title}</span><span class="k">${r.kind}</span><span class="c">${r.tracks.length} ${r.tracks.length === 1 ? 'track' : 'tracks'}</span></li>`).join('');
index.addEventListener('click', e => { const r = e.target.closest('.row'); if (r) openSheet(byId(r.dataset.id), e.clientX, e.clientY); });
index.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { const r = e.target.closest('.row'); if (r) { e.preventDefault(); const b = r.getBoundingClientRect(); openSheet(byId(r.dataset.id), b.left + b.width / 2, b.top + b.height / 2); } } });
$('#filters').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  $$('#filters button').forEach(x => x.classList.toggle('on', x === b));
  const f = b.dataset.f;
  const apply = () => $$('.row', index).forEach(r => r.classList.toggle('hide', f !== 'all' && r.dataset.k !== f));
  document.startViewTransition && !reduce ? document.startViewTransition(apply) : apply();
});
/* touch: no hover, so the row crossing the middle of the screen lights up as you scroll (frame() picks it) */
let litY = -1;

/* ───────── apps ───────── */
// LP33 page. Download buttons (hero, first step, free tier, end): the visitor's own platform goes first (pink; on a Mac
// the matching chip, with the other chip as a ghost), then a quiet "Also on" line for the rest. Empty links are hidden.
const ua = navigator.userAgent;
const plat = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? 'ios'
  : /Android/.test(ua) ? 'android' : /Windows/.test(ua) ? 'win' : 'mac';
const intel = plat === 'mac' && (() => { try { const r = document.createElement('canvas').getContext('webgl').getParameter(37446); return /Intel/i.test(r); } catch (e) { return false; } })();
const macKeys = intel ? ['metroMacIntel', 'metroMac'] : ['metroMac', 'metroMacIntel'];
// [link key, platform, button label, label in the "Also on" line, is a file download]
const PLATS = [
  [macKeys[0], 'mac', 'Download for Mac', intel ? 'Intel Mac' : 'Mac', true],
  [macKeys[1], 'mac', intel ? 'Apple Silicon Mac' : 'Intel Mac', intel ? 'Mac' : 'Intel Mac', true],
  ['lp33Windows', 'win', 'Download for Windows', 'Windows', /\.(exe|msi|msix|zip)$/i.test(LINKS.lp33Windows)],
  ['lp33AppStore', 'ios', 'Get it on the App Store', 'iPhone and iPad', false],
  ['lp33Play', 'android', 'Get it on Google Play', 'Android', false],
].filter(([k]) => LINKS[k]);
const mine = PLATS.some(x => x[1] === plat) ? PLATS.filter(x => x[1] === plat) : PLATS.filter(x => x[1] === 'mac');
const others = PLATS.filter(x => !mine.includes(x));
const dlA = ([k, , , , file], cls, text) => `<a${cls ? ` class="${cls}"` : ''} href="${LINKS[k]}"${file ? ' download' : ' target="_blank" rel="noopener"'}>${text}</a>`;
const dlHTML = mine.map((x, i) => dlA(x, `pill ${i ? 'ghost' : 'pink'}`, x[2])).join('')
  + (others.length ? `<p class="lp-on">Also on ${others.map(x => dlA(x, '', x[3])).join('<span aria-hidden="true"> · </span>')}</p>` : '');
$$('[data-dl]').forEach(el => { el.innerHTML = dlHTML; });
const dls = mine.map(x => [x[0]]);
// Floating download pill: shows once the hero has scrolled away, hides again at the closing call to action.
const mxFloat = $('#mxFloat'), mxHero = $('#lpHero'), mxEnd = $('#mxEnd');
if (dls.length) {
  mxFloat.href = LINKS[dls[0][0]];
  const vis = new Map();
  const fio = new IntersectionObserver(es => {
    es.forEach(e => vis.set(e.target, e.isIntersecting));
    const show = !vis.get(mxHero) && !vis.get(mxEnd);
    mxFloat.classList.toggle('on', show);
    mxFloat.setAttribute('aria-hidden', show ? 'false' : 'true');
    mxFloat.tabIndex = show ? 0 : -1;
  });
  fio.observe(mxHero); fio.observe(mxEnd);
} else mxFloat.remove();

// The record: turns at 33⅓ rpm (200°/s, one turn every 1.8 s) while on screen. Grab it and spin to scrub the readout;
// a flick keeps its speed and the "motor" eases back to 33⅓. Arrow keys seek 5 s. Still under reduced motion until dragged.
const lpDisc = $('#lpDisc'), lpSpinEl = $('#lpSpin'), lpTimeEl = $('#lpTime');
const lpRM = matchMedia('(prefers-reduced-motion: reduce)');
let lpAng = 0, lpVel = 0, lpSecs = 0, lpGrab = null, lpOn = false, lpLast = 0, lpRaf = 0;
function lpTurn(deg) { lpAng += deg; lpSecs = Math.max(0, lpSecs + deg / 360 * 1.8) % 3600; }
function lpPaint() {
  lpSpinEl.style.transform = `rotate(${lpAng % 360}deg)`;
  const t = mmss(Math.floor(lpSecs) * 1000);
  if (lpTimeEl.textContent !== t) { lpTimeEl.textContent = t; lpDisc.setAttribute('aria-valuenow', Math.floor(lpSecs)); lpDisc.setAttribute('aria-valuetext', t); }
}
function lpTick(t) {
  const dt = lpLast ? Math.min(.05, (t - lpLast) / 1000) : 0; lpLast = t;
  if (!lpGrab) { lpVel += ((lpRM.matches ? 0 : 200) - lpVel) * Math.min(1, dt * 1.8); lpTurn(lpVel * dt); }
  lpPaint();
  lpRaf = lpOn ? requestAnimationFrame(lpTick) : 0;
}
function lpRun() { if (lpOn && !lpRaf) { lpLast = 0; lpRaf = requestAnimationFrame(lpTick); } }
new IntersectionObserver(([e]) => { lpOn = e.isIntersecting; lpRun(); }).observe(lpDisc);
const lpAngleAt = e => { const r = lpDisc.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
lpDisc.addEventListener('pointerdown', e => {
  if (e.button) return;
  lpDisc.setPointerCapture(e.pointerId);
  lpGrab = { a: lpAngleAt(e), t: performance.now(), v: 0 };
});
lpDisc.addEventListener('pointermove', e => {
  if (!lpGrab) return;
  const a = lpAngleAt(e), now = performance.now();
  let d = a - lpGrab.a; if (d > 180) d -= 360; if (d < -180) d += 360;
  const dt = Math.max(1, now - lpGrab.t) / 1000;
  lpGrab.v = lpGrab.v * .6 + (d / dt) * .4; lpGrab.a = a; lpGrab.t = now;
  lpTurn(d); if (!lpRaf) lpPaint();
});
const lpLetGo = () => { if (!lpGrab) return; lpVel = performance.now() - lpGrab.t > 90 ? 0 : Math.max(-2400, Math.min(2400, lpGrab.v)); lpGrab = null; lpRun(); };
lpDisc.addEventListener('pointerup', lpLetGo);
lpDisc.addEventListener('pointercancel', lpLetGo);
lpDisc.addEventListener('keydown', e => {
  const k = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
  if (!k) return;
  e.preventDefault(); lpTurn(k * 1000); lpPaint();
});

// Three looks: tabs crossfade the screenshots and tint the section; turns by itself every 5 s while on screen,
// until someone picks one.
const looks = $$('.lp-look'), lookImgs = $$('.lp-stage img'), lookSec = $('#mxLooks'), lookLine = $('#lpLookLine');
const lookBg = ['#06111a', '#0a1622', '#140f22'];
let lookAt = 0, lookTimer = 0, lookAuto = !lpRM.matches;
function showLook(i) {
  lookAt = i;
  looks.forEach((b, j) => { b.classList.toggle('on', j === i); b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
  lookImgs.forEach((im, j) => im.classList.toggle('on', j === i));
  lookSec.style.backgroundColor = lookBg[i];
  lookLine.textContent = looks[i].dataset.line;
}
looks.forEach((b, i) => b.addEventListener('click', () => { lookAuto = false; clearInterval(lookTimer); showLook(i); }));
new IntersectionObserver(([e]) => {
  clearInterval(lookTimer);
  if (e.isIntersecting && lookAuto) lookTimer = setInterval(() => showLook((lookAt + 1) % looks.length), 5000);
}, { threshold: .4 }).observe(lookSec);
// FAQ: one answer open at a time.
$$('.lp-qs details').forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('.lp-qs details').forEach(o => { if (o !== d) o.open = false; }); }));

/* ───────── yohaku ───────── */
// Groups of [file slug, title, what it does, why it matters, tag]. Each row's clip is assets/img/yohaku/<slug>.mp4
// (shot list in docs/TODO.md); a missing clip leaves the ruled placeholder.
const YOHAKU = [
  ['One sheet', [
    ['one-sheet', 'One sheet', 'The board sits on the left and the month on the right, and they are one surface: no divider, no tabs, no switching.', 'Ideas and dates live in the same place, so nothing gets lost on the way from one app to another.'],
    ['gestures', 'Draw on the month', 'Circle a date to make it important, tick it when it\'s done, draw a line across days to make a plan and name it, or cross it out.', 'It plans like a paper diary, and it\'s quicker than any form.'],
    ['threads', 'Ink threads', 'Drag a sketch from the board onto a date. It stays tied to that day: hover the date and the sketch lights up, tap the sketch and the day opens.', 'The messy thinking stays connected to the day it was for.'],
    ['dive', 'Dive into a day', 'Tap a date and the whole sheet glides into it. Ink drawn there is finer, and the day panel opens beside it.', 'You go from the month to the detail without ever leaving the sheet.'],
    ['week', 'Month and week', 'Swipe up or down to switch between the month and a week of seven roomy rows, and sideways to move through time.', 'The month shows the shape of things, the week shows what\'s really happening.'],
    ['half-life', 'Ink half-life', 'Ink on the board fades slowly over days, so the board cleans itself. Pinned and threaded ink stays.', 'A whiteboard you never have to wipe, that never turns into a wall of old scribbles.'],
  ]],
  ['Planning', [
    ['liquid-time', 'Liquid time', 'Drag a list onto a date and it pours: the first line lands there and the rest flow into the quietest days after it. A day that\'s too full ends in a "+N more" chip that suggests better days.', 'Moving plans around feels like tipping water, not editing fields.'],
    ['quick-add', 'Quick add', 'Press ⌘K and type the way you talk, like "dinner with Sam friday 8pm", and it lands on the right day.', 'For when typing really is quicker than drawing.'],
    ['sync', 'Calendar and Reminders', 'Your Mac\'s calendars and reminders show up on the month. Tick, move, rename or delete them in Yohaku and the change goes back.', 'It works with everything you already use, and nothing leaves your Mac.'],
    ['handwriting', 'Handwriting everywhere', 'Whatever you type appears in handwriting, in four hands. Turn on ink to text and your scribbled words become typed handwriting, read right on your Mac.', 'The whole sheet keeps the feel of one notebook.'],
    ['light', 'Real light', 'On an HDR screen, days glow with how busy they are, today gently pulses, and fresh ink glows and cools like phosphor.', 'You can feel a busy week before you read a word of it.'],
  ]],
  ['The board', [
    ['notebook', 'Notebook', 'Write is ruled paper you type on from the top left, Draw is a blank page, and To do has To do, Doing and Done lists you can drag between.', 'One board for thinking in words, in pictures and in lists.'],
    ['hourglass', 'Hourglass', 'A big glass hourglass. Pick 5 to 60 minutes and tap it: it turns over, real sand falls, and a soft chime rings at the end.', 'A focus timer you actually want to look at.'],
    ['fuse', 'Fuse', 'Light a fuse on a plan and a cord burns around its day with a glowing ember, ending in sparks and a tick.', 'Time running out is something you can see from across the room.'],
    ['stickers', 'Stickers', 'Paste a screenshot or drop in a photo and it sticks to the sheet like a real sticker. Open it to write a note or draw on it, then peel it off when you\'re done.', 'References sit right next to the plans they belong to.'],
    ['sticker-note', 'Notes on stickers', 'Open a sticker to write a note beside it, or doodle right on the picture.', 'Cover art, references, receipts: each one keeps its context.'],
  ]],
  ['Play', [
    ['crumple', 'Gravity and crumple', 'On the Draw page, drop your ink and fling it around, or crumple a drawing into a paper ball and throw it in the bin.', 'Throwing out a bad idea should feel this good.'],
    ['fidgets', 'Fidgets', 'A spinner, paintball, Newton\'s cradle, a handpan, a Rubik\'s cube and tic-tac-toe.', 'Something for your hands while your head works.'],
    ['cradle', 'Newton\'s cradle', 'Pull a ball back and let go: it clicks back and forth until it settles.', 'Physics, but make it a procrastination tool.'],
    ['cube', 'Cube and handpan', 'Twist a full Rubik\'s cube in 3D, then tap out a tune on the handpan.', 'One for your hands, one for your ears.'],
    ['photo-booth', 'Photo booth', 'Take a photo with your Mac\'s camera, or your iPhone\'s, and it slides out like an instant print and becomes a sticker.', 'Your desk, your face, your cat: right there on the plan.'],
  ]],
  ['Little things', [
    ['cat', 'The cat', 'A small round cat with a red collar drops by now and then. It naps on today, chases paper balls and purrs when you click it, or you can let it stay.', 'A desk feels better with someone on it.'],
    ['cat-play', 'Pet the cat', 'Click the cat and it purrs with its eyes shut; click again and it rolls over for a belly rub.', 'Honestly, the most important feature.'],
    ['cat-chase', 'Paper-ball patrol', 'Crumple a drawing and the cat goes after the ball, bats it around and stands guard by the bin.', 'Your bad ideas finally have a fan.'],
    ['moments', 'Month moments', 'Each new month opens with a short scene: blossom in April, falling leaves in September, diyas in October, snow in December.', 'Turning the page should feel like an occasion.'],
    ['swallows', 'Swallows', 'Click the wordmark and a few swallows take off across the sheet.', 'No reason. It just makes me smile.'],
    ['clock', 'Clock and nudges', 'A quiet clock in the top bar that reminds you to drink water and take a screen break, with small animations instead of pop-ups.', 'Looking after yourself without another notification.'],
    ['screen-break', 'Screen break', 'Every half hour the clock closes its eyes and counts down twenty seconds while you look away.', 'The 20-20-20 rule, without a pop-up yelling at you.'],
    ['sound', 'Sound', 'Every tap, tick and pour has a deep, soft sound with a bit of room around it.', 'Satisfying, and never loud.'],
  ]],
  ['On your Mac', [
    ['wallpaper', 'Live wallpaper', 'Yohaku can be your desktop: the sheet sits behind every window on every Space, and you can draw, tick and plan right on it. Classic mode keeps your desktop icons and just reacts to the pointer.', 'Your month is always one glance away, not an app you have to open.'],
    ['themes', 'Themes', 'Paper, Sand, Ocean and Rose, each in light or dark.', 'It should look like your desk, not mine.'],
    ['looks', 'Four looks', 'Poster, Ink first, Light table and Classic: the same month in four moods.', 'Loud when you want it, quiet when you don\'t.'],
    ['iphone', 'iPhone and iPad', 'The same sheet on iPad with Apple Pencil, and on iPhone with the board and the month as two pages you swipe between.', 'Plans don\'t stay at the desk.', 'Coming soon'],
  ]],
];
// Rows with no clip yet (see docs/TODO.md): no media slot, so nothing 404s.
const YK_NOCLIP = new Set(['threads', 'half-life', 'sync', 'photo-booth', 'wallpaper', 'iphone']);
let yn = 0;
// Each group is a grid of cards (3 / 2 / 1 columns). A row without a clip shows its "why" as a hand note
// on the ruled page instead, so the grid has no holes. Cards in a row arrive one after another.
$('#ykFeat').innerHTML = YOHAKU.map(([g, list]) => `<li class="yk-g" data-r><span class="lab">${g}</span></li>` + list.map(([slug, t, what, why, tag], i) =>
  `<li class="yk-c" data-r style="--rd:${(i % 3) * .12}s">` +
  (YK_NOCLIP.has(slug) ? `<div class="yk-note"><p>${why}</p></div>`
    : `<div class="yk-media"><video data-src="assets/img/yohaku/${slug}.mp4" autoplay muted loop playsinline preload="none" aria-label="${t}"></video></div>`) +
  `<div class="yk-txt"><span class="n">${pad2(++yn)}</span><b>${t}</b>${tag ? `<small>${tag}</small>` : ''}<p>${what}</p>${YK_NOCLIP.has(slug) ? '' : `<p class="why">${why}</p>`}</div></li>`).join('')).join('');
// Arriving through the black wipe, the hero waits for the circle to open before it draws itself in.
function ykEnter() { $('#p-yohaku').classList.toggle('yk-late', wipe.style.visibility === 'visible'); }
// Clips load when they come near the screen and play only while visible; a missing file keeps the placeholder.
const ykIo = 'IntersectionObserver' in window && new IntersectionObserver(es => es.forEach(e => {
  const v = e.target;
  if (e.isIntersecting) {
    // with reduced motion the clip never plays: it loads its first frame and holds it as a still
    if (!v.src && v.dataset.src) { v.addEventListener('error', () => v.closest('.yk-media').classList.add('empty'), { once: true }); v.src = v.dataset.src + (reduce ? '#t=0.1' : ''); }
    if (!reduce) v.play().catch(() => {});
  } else if (v.src) v.pause();
}), { rootMargin: '200px 0px' });
$$('#p-yohaku video').forEach(v => {
  v.addEventListener('loadeddata', () => v.closest('.yk-media').classList.add('ready'), { once: true });
  if (reduce) { v.removeAttribute('autoplay'); v.preload = 'auto'; }
  ykIo ? ykIo.observe(v) : (v.src = v.dataset.src);
});

/* ───────── live ───────── */
let liveChecked = false;
async function checkLive() {
  if (liveChecked) return; liveChecked = true;
  try {
    const r = await fetch('https://decapi.me/twitch/uptime/' + TWITCH_CHANNEL, { cache: 'no-store' });
    const t = (await r.text()).trim();
    if (/^\d+\s+(second|minute|hour|day)/i.test(t)) {
      $('#lStatus').classList.add('live'); $('#lStatus span').textContent = 'Live now';
    } else $('#lStatus span').textContent = 'Offline · streaming soon';
  } catch (e) { $('#lStatus span').textContent = 'Offline · streaming soon'; }
}
$('#player').addEventListener('click', () => {
  const host = location.hostname;
  if (!host) { window.open(LINKS.twitch, '_blank', 'noopener'); return; }
  if ($('#player iframe')) return;
  const f = document.createElement('iframe');
  f.src = `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${host}&muted=false&autoplay=true`;
  f.allowFullscreen = true; f.title = 'Twitch stream';
  $('#player').append(f);
  $$('#player img, #loadTwitch, #playerCap').forEach(el => el.remove());
  audio.pause();
});

/* ───────── per-frame scroll choreography ───────── */
const hero = $('#hero'), disc = $('#disc'), discImg = $('img', disc), discDim = $('#discDim'), ringText = $('#ringText'), heroCopy = $('#heroCopy'), about = $('#about');
const strips = $$('#lvArt i'), bigT = $('#lvTitle'), browse = $('#browse'), latestEl = $('#latest'), vwrap = $('#vwrap'), vinyl = $('#lvVinyl'), sleeve = $('#lvArt'), lcopy = $('.latest-copy');
const dots = $$('#dots li'), dotTargets = [hero, browse, latestEl, $('#rooms')];

let r0 = 200, rMax = 900, vw = innerWidth, vh = innerHeight, heroP = -1, bigW = 0, pad = 16, bigLand = [1, 0];
// Hero photo (fractions of its size): px/py = crop anchor when it fills the screen (object-position), fx/fy = what the
// circle starts centred on (Blu), span = how much of the photo's width the circle shows at the start.
const PHOTO = { w: 1500, h: 2000, px: .47, py: .3, fx: .48, fy: .37, span: .4 };
let s0 = 1, fA = 1, fP = .6, faceDx = 0, faceDy = 0, photoBox = [0, 0, 0, 0]; // photo edges at scale 1, relative to the screen centre: left, right, top, bottom
function measure() {
  vw = innerWidth; vh = innerHeight; bigW = bigT.offsetWidth;
  // where the latest title lands: scaled to fit the width (and not too tall), sitting just above the meta line, bottom-left
  pad = parseFloat(getComputedStyle(lcopy).left) || 16;
  const bh = bigT.offsetHeight, fit = Math.min((vw - 2 * pad) / bigW, vh * .13 / bh);
  if (bigW) bigLand = [fit, vh / 2 - pad - lcopy.offsetHeight - 18 - bh * fit / 2]; // 0 while home is hidden
  disc.style.setProperty('--vw', vw + 'px'); disc.style.setProperty('--vh', vh + 'px');
  r0 = Math.min(vw, vh) * (vw < 700 ? .34 : .3);
  rMax = Math.hypot(vw, vh) / 2 * 1.04;
  const W = (r0 + 14) / .44;
  ringText.style.width = ringText.style.height = W + 'px';
  ringText.style.margin = `${-W / 2}px 0 0 ${-W / 2}px`;
  disc.style.setProperty('--D', rMax * 2 + 'px');
  const c = Math.max(vw / PHOTO.w, vh / PHOTO.h), dw = PHOTO.w * c, dh = PHOTO.h * c;
  const l = (vw - dw) * PHOTO.px - vw / 2, t = (vh - dh) * PHOTO.py - vh / 2;
  faceDx = l + PHOTO.fx * dw; faceDy = t + PHOTO.fy * dh;
  discImg.style.objectPosition = `${PHOTO.px * 100}% ${PHOTO.py * 100}%`;
  photoBox = [Math.max(l, -vw / 2), Math.min(l + dw, vw / 2), Math.max(t, -vh / 2), Math.min(t + dh, vh / 2)]; // the img box is the screen, cropped
  s0 = clamp(2 * r0 / (PHOTO.span * dw), 2.1 * r0 / Math.min(vw, vh), 1.3); // start zoom
  // The photo slides from the face to the centre on one eased curve (fA = how much of the shift it starts with, fP = when it
  // lands), the slowest one that never lets a photo edge show inside the circle. A hard clamp here made the photo lurch.
  const N = 200, env = []; for (let i = 0, m = 1; i <= N; i++) env.push(m = Math.min(m, shiftRoom(i / N)));
  const fits = P => env.every((e, i) => env[0] * (1 - ease(clamp(i / N / P))) <= e + .004);
  fA = env[0]; let lo = .05, hi = .6;
  if (fits(hi)) lo = hi; else for (let k = 0; k < 24; k++) { const P = (lo + hi) / 2; fits(P) ? lo = P : hi = P; }
  fP = lo;
  heroP = -1;
  if (sda) heroKeyframes();
}
/* Where supported, the hero runs as a CSS scroll-driven animation: the browser ties it to the scroll position itself,
   so it stays locked to the finger on iPhone instead of trailing a frame behind. Keyframes are sampled from heroAt(). */
const sda = !reduce && window.CSS && CSS.supports('animation-timeline: view()');
const heroBase = p => { const g = ease(clamp(p / .6)), r = lerp(r0, rMax, g); return { g, r, s: lerp(s0, 1, g) * lerp(1, 1.12, clamp((p - .6) / .4)) }; };
// how much of the face shift (0..1) fits at p without a photo edge showing inside the visible part of the circle
function shiftRoom(p) {
  const { r, s } = heroBase(p), [pl, pr, pt, pb] = photoBox, mx = Math.min(r, vw / 2), my = Math.min(r, vh / 2);
  const room = (d, a, b) => Math.abs(d) < 1e-6 ? 1 : clamp(clamp(-s * d, Math.min(a, b), Math.max(a, b)) / (-s * d));
  return Math.min(room(faceDx, mx - s * pr, -mx - s * pl), room(faceDy, my - s * pb, -my - s * pt));
}
function heroAt(p) {
  const { g, r, s } = heroBase(p), dk = r / rMax, k = (r + 14) / (r0 + 14);
  const hc = clamp(1 - p / .16), ab = clamp((p - .56) / .16) * clamp((1 - p) / .1);
  const f = fA * (1 - ease(clamp(p / fP))), ox = -s * faceDx * f, oy = -s * faceDy * f;
  return {
    disc: `transform: scale(${dk.toFixed(4)})`,
    img: `transform: translate(${(ox / dk).toFixed(1)}px, ${(oy / dk).toFixed(1)}px) scale(${(s / dk).toFixed(4)})`,
    dim: `opacity: ${(g * .6).toFixed(3)}`,
    ring: `transform: rotate(${(p * 260).toFixed(2)}deg) scale(${k.toFixed(4)}); opacity: ${clamp(1 - g * 2.4).toFixed(3)}`,
    copy: `opacity: ${hc.toFixed(3)}; transform: translateY(${((1 - hc) * -30).toFixed(2)}px)`,
    about: `opacity: ${ab.toFixed(3)}; transform: translateY(${((1 - ab) * 24).toFixed(2)}px)`,
  };
}
function heroKeyframes() {
  const N = 60, kf = { disc: '', img: '', dim: '', ring: '', copy: '', about: '' };
  for (let i = 0; i <= N; i++) { const v = heroAt(i / N), at = (i / N * 100).toFixed(2) + '%'; for (const n in kf) kf[n] += `${at}{${v[n]}}`; }
  let el = $('#heroKf'); if (!el) { el = document.createElement('style'); el.id = 'heroKf'; document.head.append(el); }
  el.textContent = Object.entries(kf).map(([n, b]) => `@keyframes h-${n}{${b}}`).join('');
  hero.classList.add('sda');
}
// On phones the address bar collapsing fires resize mid-scroll; only re-measure when the width really changes.
addEventListener('resize', () => { if (fine || innerWidth !== vw) measure(); });
dots.forEach((d, i) => d.addEventListener('click', () => {
  const t = dotTargets[i], y = t.getBoundingClientRect().top + scrollTop() + (i === 0 ? 0 : i === 1 ? 0 : 0);
  lenis ? lenis.scrollTo(y, { duration: 1.6 }) : window.scrollTo({ top: y, behavior: 'smooth' });
}));

function frame(t) {
  lenis && lenis.raf(t);

  /* cursor */
  if (fine) {
    mouse.cx = lerp(mouse.cx, mouse.x, .32); mouse.cy = lerp(mouse.cy, mouse.y, .32);
    cursor.style.transform = `translate3d(${mouse.cx}px,${mouse.cy}px,0)`;
  }

  if (cur === 'home' && !document.body.classList.contains('is-intro')) {
    /* read every rect first, then write, so the browser lays out once per frame */
    const hr = hero.getBoundingClientRect(), br = browse.getBoundingClientRect(), lr = latestEl.getBoundingClientRect();
    const dTops = dotTargets.map(el => el.getBoundingClientRect().top);

    /* hero: the photo circle grows until it is the page (skipped when nothing moved) */
    const p = clamp(-hr.top / (hr.height - vh));
    if (p !== heroP && hr.bottom > 0) {
      heroP = p;
      if (!sda) {
        const v = heroAt(p);
        [[disc, v.disc], [discImg, v.img], [discDim, v.dim], [ringText, v.ring], [heroCopy, v.copy], [about, v.about]].forEach(([el, css]) =>
          css.split('; ').forEach(d => { const [k, val] = d.split(': '); el.style[k] = val; }));
      }
      about.style.setProperty('--q', clamp((p - .56) / .3).toFixed(3));
    }

    /* browse: two rings of covers orbit the title in release order, then gather into a pile, oldest first, newest on top */
    if (br.bottom > 0 && br.top < vh) {
      const p = clamp(-br.top / (br.height - vh)), W = floaters.clientWidth, H = floaters.clientHeight, n = FL.length, pile = Math.min(W, H) * .26;
      if (!reduce && !flHold) orbit += .0006;
      if (browse.classList.toggle('gather', !reduce && p > .44)) flHold = false;
      fm.x = lerp(fm.x, fine && mouse.x >= 0 ? mouse.x / vw - .5 : 0, .06);
      fm.y = lerp(fm.y, fine && mouse.y >= 0 ? mouse.y / vh - .5 : 0, .06);
      FL.forEach(o => {
        const g = reduce ? 0 : ease(clamp((p - .45 - (1 - o.rank / (n - 1)) * .18) / .3)), k = o.ring ? 1 : .55;
        const a = o.a + orbit * (o.ring ? 1 : -1.3);
        const sx = Math.cos(a) * W * (o.ring ? .42 : .28) - fm.x * 60 * k;
        const sy = Math.sin(a) * H * (o.ring ? .37 : .25) - fm.y * 40 * k + (.2 - p) * 120 * k;
        const x = lerp(sx, o.ox * pile * 1.3, g), y = lerp(sy, o.oy * pile * .7, g);
        o.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${(o.rot * g).toFixed(1)}deg) scale(${lerp(1, pile / o.s, g).toFixed(3)})`;
        o.el.style.zIndex = g > .01 ? 100 + n - o.rank : (o.ring ? 20 : 10);
        if (!o.rank) browse.style.setProperty('--g', g.toFixed(3));
      });
    }

    /* latest: the cover strips lock together, the record slides out of the sleeve, the title runs behind */
    const ls = lr.height - vh;
    if (lr.bottom > 0 && lr.top < vh * 1.5) { /* start half a screen early so everything is positioned and painted before it shows */
      const lp = clamp(-lr.top / ls), a = clamp((vh - lr.top) / (vh * 1.7));
      let whole = 1;
      strips.forEach((s, i) => {
        const g = reduce ? 1 : ease(clamp((a - i / (strips.length - 1) * .3) / .6)); whole = Math.min(whole, g);
        s.style.transform = `translate3d(0,${((i % 2 ? 1 : -1) * (1 - g) * vh * 1.1).toFixed(1)}px,0)`;
      });
      sleeve.classList.toggle('whole', whole > .999);
      const slide = ease(clamp((lp - .3) / .32));
      vinyl.style.setProperty('--vx', slide * 36 + '%');
      vinyl.style.setProperty('--vr', slide * 540 + 'deg');
      sleeve.style.setProperty('--sx', slide * -36 + '%');
      /* the title runs across behind the record, then shrinks and lands bottom-left, whole and readable, before the section leaves */
      const run = clamp((vh - lr.top) / (vh + ls * .58)), m = ease(clamp((lp - .58) / .26));
      const [fit, dy] = bigLand;
      bigT.style.transform = `translate3d(${lerp(lerp(vw * .9, vw * .95 - bigW, run), pad, m).toFixed(1)}px,calc(-50% + ${(dy * m).toFixed(1)}px),0) scale(${lerp(1, fit, m).toFixed(4)})`;
      vwrap.style.transform = `translate3d(0,${(-m * vh * .06).toFixed(1)}px,0)`;
      lcopy.style.setProperty('--co', clamp((lp - .78) / .14));
    }

    /* dots */
    let act = 0;
    dTops.forEach((top, i) => { if (top < vh * .5) act = i; });
    dots.forEach((d, i) => d.classList.toggle('on', i === act));
  } else if (cur === 'music') {
    if (!fine && scrollTop() !== litY) {
      litY = scrollTop();
      const rows = $$('.row', index), tops = rows.map(r => r.getBoundingClientRect());
      rows.forEach((r, i) => r.classList.toggle('lit', tops[i].top <= vh / 2 && tops[i].bottom > vh / 2));
    }
  }
  requestAnimationFrame(frame);
}

/* ───────── boot ───────── */
(function boot() {
  buildRing();
  measure();
  const hash = location.hash.slice(1);
  let seen = false; try { seen = !!sessionStorage.getItem('bs_intro'); } catch (e) {}
  const start = PAGES.includes(hash) ? hash : 'home';
  if (start !== 'home') show(start); else arm($('#p-home'));
  history.replaceState({ p: start }, '', pageUrl(start));
  if (start !== 'home' || seen) {
    document.body.classList.remove('is-intro'); intro.remove(); lenis && lenis.start();
    $('.h-lede').classList.add('in');
  } else {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    scrollTo(0, 0); lenis && lenis.scrollTo(0, { immediate: true });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(() => intro.classList.add('ready'), 120));
  }
  requestAnimationFrame(frame);
})();
