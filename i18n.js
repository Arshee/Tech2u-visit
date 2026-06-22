// ============================================
// TECH2U — i18n (PL / EN)
// ============================================

(function () {
  'use strict';

  var STORAGE_KEY = 'tech2u-lang';

  var translations = {
    pl: {
      htmlLang: 'pl',
      pageTitle: 'Tech2u — Recenzje, montaż, AI',
      pageDescription: 'Tech2u — kanał o technologii, recenzjach i AI. Obserwuj na YouTube, TikTok, Instagram i Facebook. Sprawdź BassMarker Pro.',
      robotAlt: 'Robot — mascotka Tech2u, srebrny robot ze słuchawkami i podświetlonym rdzeniem',
      bassmarkerAlt: 'Logo BassMarker Pro — fioletowa ikona z falą audio i znacznikiem',
      strings: {
        'nav.about': 'O mnie',
        'nav.social': 'Social media',
        'nav.bassmarker': 'BassMarker Pro',
        'nav.contact': 'Kontakt',

        'hero.eyebrow': 'Recenzje · Montaż · AI',
        'hero.title': 'Technologia<br>opowiedziana<br><span class="gold-text">od podszewki.</span>',
        'hero.lead': 'Recenzuję sprzęt, montuję filmy i buduję narzędzia oparte na AI. Tech2u to miejsce, gdzie technologia przestaje być abstrakcją.',
        'hero.ctaPrimary': 'Obserwuj kanał',
        'hero.ctaGhost': 'Zobacz BassMarker Pro',

        'about.label': 'Czym się zajmuję',
        'about.title': 'Trzy filary, jeden cel — pokazać, jak technologia naprawdę działa.',
        'about.pillar1.title': 'Recenzje produktów',
        'about.pillar1.body': 'Sprzęt testowany w codziennym użytkowaniu — bez marketingowego sloganu, tylko konkretne wnioski i liczby.',
        'about.pillar2.title': 'Montaż filmów',
        'about.pillar2.body': 'Od surowego materiału do gotowego odcinka — tempo, rytm i historia, która utrzymuje uwagę do końca.',
        'about.pillar3.title': 'Narzędzia AI',
        'about.pillar3.body': "Buduję własne pipeline'y i programy oparte na AI — od automatyzacji montażu po BassMarker Pro.",

        'social.label': 'Bądź na bieżąco',
        'social.title': 'Dołącz po drugiej stronie ekranu.',
        'social.lead': 'Nowe recenzje, kulisy montażu i eksperymenty z AI — codziennie na czterech platformach.',
        'social.youtube.cta': 'Zobacz kanał →',
        'social.instagram.cta': 'Obserwuj →',
        'social.tiktok.cta': 'Zobacz filmy →',
        'social.facebook.cta': 'Polub stronę →',

        'bassmarker.label': 'Mój program',
        'bassmarker.title': 'BassMarker <span class="gold-text">Pro</span>',
        'bassmarker.lead': 'Koniec z ręcznym stawianiem znaczników. BassMarker Pro analizuje muzykę i automatycznie rozmieszcza znaczniki na każdym beacie — wprost w Final Cut Pro, idealnie zsynchronizowane, w kilka sekund.',
        'bassmarker.tag1': 'Bas',
        'bassmarker.tag2': 'Stopa (Kick)',
        'bassmarker.tag3': 'Sub-bas',
        'bassmarker.tag4': 'Werbel',
        'bassmarker.tag5': 'Hi-Hat',
        'bassmarker.tag6': 'Pełne bębny',
        'bassmarker.tag7': 'Zmiany energii',
        'bassmarker.feature1': 'Działa w czasie rzeczywistym, podczas odtwarzania',
        'bassmarker.feature2': 'Każdy gatunek — phonk, hip-hop, elektronika, rock',
        'bassmarker.feature3': 'Offset czasowy ±5 klatek i 3 poziomy czułości',
        'bassmarker.feature4': 'Projekty 24/25/30/60 FPS',
        'bassmarker.reqLabel': 'Wymagania',
        'bassmarker.req1': 'macOS 11+ (Apple Silicon i Intel)',
        'bassmarker.req2': 'Final Cut Pro',
        'bassmarker.req3': 'ffmpeg (brew install ffmpeg)',
        'bassmarker.cta': 'Kupić BassMarker Pro',
        'bassmarker.priceNote': 'jednorazowo, dożywotnie aktualizacje',

        'contact.eyebrow': 'Kontakt',
        'contact.title': 'Masz pytanie albo&nbsp;propozycję&nbsp;współpracy?',
        'contact.lead': 'Najszybciej dotrzesz do mnie mailowo — odpisuję na wszystko.',

        'footer.copyright': '&copy; 2026 Tech2u. Wszystkie prawa zastrzeżone.'
      }
    },

    en: {
      htmlLang: 'en',
      pageTitle: 'Tech2u — Reviews, Editing, AI',
      pageDescription: 'Tech2u — a channel about tech, reviews and AI. Follow on YouTube, TikTok, Instagram and Facebook. Check out BassMarker Pro.',
      robotAlt: 'Robot — Tech2u mascot, a silver robot with headphones and a glowing core',
      bassmarkerAlt: 'BassMarker Pro logo — a purple icon with an audio waveform and marker tag',
      strings: {
        'nav.about': 'About',
        'nav.social': 'Social media',
        'nav.bassmarker': 'BassMarker Pro',
        'nav.contact': 'Contact',

        'hero.eyebrow': 'Reviews · Editing · AI',
        'hero.title': 'Technology,<br>explained<br><span class="gold-text">from the inside out.</span>',
        'hero.lead': 'I review hardware, edit videos, and build AI-powered tools. Tech2u is where technology stops being an abstraction.',
        'hero.ctaPrimary': 'Follow the channel',
        'hero.ctaGhost': 'See BassMarker Pro',

        'about.label': 'What I do',
        'about.title': 'Three pillars, one goal — showing how technology actually works.',
        'about.pillar1.title': 'Product reviews',
        'about.pillar1.body': 'Hardware tested in everyday use — no marketing fluff, just real findings and numbers.',
        'about.pillar2.title': 'Video editing',
        'about.pillar2.body': 'From raw footage to a finished episode — pacing, rhythm, and a story that holds attention to the end.',
        'about.pillar3.title': 'AI tools',
        'about.pillar3.body': 'I build my own AI-powered pipelines and software — from editing automation to BassMarker Pro.',

        'social.label': 'Stay in the loop',
        'social.title': 'Join in on the other side of the screen.',
        'social.lead': 'New reviews, behind-the-scenes editing, and AI experiments — daily, across four platforms.',
        'social.youtube.cta': 'Watch the channel →',
        'social.instagram.cta': 'Follow →',
        'social.tiktok.cta': 'Watch videos →',
        'social.facebook.cta': 'Like the page →',

        'bassmarker.label': 'My software',
        'bassmarker.title': 'BassMarker <span class="gold-text">Pro</span>',
        'bassmarker.lead': 'Stop manually placing markers. BassMarker Pro analyzes your music and automatically places markers on every beat — directly in Final Cut Pro, perfectly synced, in seconds.',
        'bassmarker.tag1': 'Bass',
        'bassmarker.tag2': 'Kick Drum',
        'bassmarker.tag3': 'Sub-Bass',
        'bassmarker.tag4': 'Snare',
        'bassmarker.tag5': 'Hi-Hat',
        'bassmarker.tag6': 'Full Drums',
        'bassmarker.tag7': 'Energy Changes',
        'bassmarker.feature1': 'Works in real time while your timeline plays',
        'bassmarker.feature2': 'Any genre — phonk, hip-hop, electronic, rock',
        'bassmarker.feature3': '±5 frame timing offset and 3 sensitivity levels',
        'bassmarker.feature4': '24/25/30/60 FPS projects',
        'bassmarker.reqLabel': 'Requirements',
        'bassmarker.req1': 'macOS 11+ (Apple Silicon & Intel)',
        'bassmarker.req2': 'Final Cut Pro',
        'bassmarker.req3': 'ffmpeg (brew install ffmpeg)',
        'bassmarker.cta': 'Buy BassMarker Pro',
        'bassmarker.priceNote': 'one-time purchase, lifetime updates',

        'contact.eyebrow': 'Contact',
        'contact.title': 'Got a question or&nbsp;a&nbsp;collab idea?',
        'contact.lead': 'Email is the fastest way to reach me — I reply to everything.',

        'footer.copyright': '&copy; 2026 Tech2u. All rights reserved.'
      }
    }
  };

  function getInitialLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'pl' || saved === 'en') return saved;
    } catch (e) { /* storage unavailable, fall through */ }
    return 'pl';
  }

  function applyLang(lang) {
    var dict = translations[lang];
    if (!dict) return;

    document.documentElement.lang = dict.htmlLang;

    var titleEl = document.getElementById('pageTitle');
    if (titleEl) titleEl.textContent = dict.pageTitle;

    var descEl = document.getElementById('pageDescription');
    if (descEl) descEl.setAttribute('content', dict.pageDescription);

    var robotImg = document.getElementById('robotAlt');
    if (robotImg) robotImg.setAttribute('alt', dict.robotAlt);

    var bmImg = document.getElementById('bassmarkerAlt');
    if (bmImg) bmImg.setAttribute('alt', dict.bassmarkerAlt);

    // Plain text strings
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict.strings[key] !== undefined) {
        el.textContent = dict.strings[key];
      }
    });

    // HTML strings (contain inline tags like <br>, <span>)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (dict.strings[key] !== undefined) {
        el.innerHTML = dict.strings[key];
      }
    });

    // Swappable links (social hrefs)
    document.querySelectorAll('[data-href-' + lang + ']').forEach(function (el) {
      var url = el.getAttribute('data-href-' + lang);
      if (url) el.setAttribute('href', url);
    });

    // Swappable handles (@tech2upl vs @tech2uen)
    document.querySelectorAll('[data-handle-' + lang + ']').forEach(function (el) {
      var handle = el.getAttribute('data-handle-' + lang);
      if (handle) el.textContent = handle;
    });

    // Toggle button active states
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) { /* storage unavailable, ignore */ }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var initialLang = getInitialLang();
    applyLang(initialLang);

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-lang'));
      });
    });
  });
})();
