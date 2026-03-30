document.addEventListener('DOMContentLoaded', () => {

  /*
     LANGUAGE / i18n
  */
  const TRANSLATIONS = {
    en: {
      gamesLabel: 'Games I’m Into',
      findMeLabel: 'Let’s Connect!',
    },
    id: {
      gamesLabel: 'Game yang Sering Kumainin',
      findMeLabel: 'Ayo Mutualan!',
    },
    jv: {
      gamesLabel: 'Game sing Tak Mainké',
      findMeLabel: 'Ayo Kêkancan!',
    },
  };

  function detectLang() {
    const saved = localStorage.getItem('lang');
    if (saved && TRANSLATIONS[saved]) return saved;
    const browser = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    if (browser.startsWith('jv')) return 'jv';
    if (browser.startsWith('id')) return 'id';
    return 'en';
  }

  function applyLang(lang) {
    const strings = TRANSLATIONS[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (strings[key]) el.textContent = strings[key];
    });
    document.documentElement.lang = lang;

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    localStorage.setItem('lang', lang);
  }

  document.getElementById('langSelector').addEventListener('click', e => {
    const btn = e.target.closest('.lang-btn');
    if (btn) applyLang(btn.dataset.lang);
  });

  applyLang(detectLang());

  /*
     STAGGER FADE-IN for social cards
  */
  document.querySelectorAll('.bento-cell').forEach((cell, i) => {
    cell.style.setProperty('--delay', `${0.05 + i * 0.06}s`);
  });

  /*
     CHARACTER ANIMATION
     Pop-in plays once per slide change.
     Idle float follows and loops.
     Resize never re-triggers the pop-in.
  */
  const slides = document.querySelectorAll('.game-slide');

  function enterChar(slide) {
    const char = slide.querySelector('.slide-char');
    if (!char) return;

    char.classList.remove('is-floating', 'is-entering');
    void char.offsetWidth;

    char.classList.add('is-entering');
    char.addEventListener('animationend', () => {
      char.classList.remove('is-entering');
      requestAnimationFrame(() => {
        char.classList.add('is-floating');
      });
    }, { once: true });
  }

  /*
     CAROUSEL
  */
  const TOTAL    = 3;
  const INTERVAL = 5000;
  let current    = 0;
  let timer      = null;

  const track = document.getElementById('carouselTrack');
  const dots  = document.querySelectorAll('.dot');

  function isMobile() { return window.innerWidth <= 480; }

  function repositionTrack() {
    const step = 100 / TOTAL;
    track.style.transform = isMobile()
      ? `translateY(-${current * step}%)`
      : `translateX(-${current * step}%)`;
  }

  function goTo(idx) {
    current = ((idx % TOTAL) + TOTAL) % TOTAL;
    repositionTrack();
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    enterChar(slides[current]);
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.idx, 10));
      startTimer();
    });
  });

  window.addEventListener('resize', repositionTrack);

  goTo(0);
  startTimer();
});
