(function () {
  'use strict';

  var storageKey = 'tech2u-lang';
  var translations = {
    pl: {
      htmlLang: 'pl',
      pageTitle: 'Tech2u — AI, montaż i BassMarker Pro',
      pageDescription: 'Tech2u — high-end studio recenzji, montażu i narzędzi AI. Poznaj BassMarker Pro dla Final Cut Pro.',
      strings: {
        'nav.showcase': 'Showcase',
        'nav.bassmarker': 'BassMarker Pro',
        'nav.social': 'Social',
        'hero.eyebrow': 'AI · MONTAŻ · RECENZJE',
        'hero.title': 'Studio technologii,<br><span>które ma rytm.</span>',
        'hero.lead': 'Tech2u to miejsce, gdzie recenzje sprzętu, montaż filmów i automatyzacja AI spotykają się w jednym, dopracowanym systemie wizualnym.',
        'hero.ctaPrimary': 'Poznaj BassMarker Pro',
        'hero.ctaGhost': 'Zobacz ujęcia',
        'showcase.label': 'Showcase',
        'showcase.title': 'Trzy ujęcia strony: <span>recenzje, montaż, AI.</span>',
        'showcase.review.title': 'Recenzje z charakterem premium',
        'showcase.review.body': 'Sprzęt pokazany jak produkt w kampanii: mocne światło, czytelny werdykt i konkretne dane bez chaosu.',
        'showcase.edit.title': 'Montaż oparty na rytmie',
        'showcase.edit.body': 'Animacje, przejścia i tempo prowadzą widza jak dobrze złożony trailer, bez przypadkowych efektów.',
        'showcase.ai.title': 'AI jako asystent, nie ozdoba',
        'showcase.ai.body': 'Robot zostaje tylko jako mały znak AI. Główna scena należy do pracy, produktu i efektu końcowego.',
        'bassmarker.label': 'Program do montażu',
        'bassmarker.title': 'BassMarker <span>Pro</span>',
        'bassmarker.lead': 'Program analizuje muzykę i automatycznie stawia znaczniki na beat, dzięki czemu montaż w Final Cut Pro zaczyna trzymać rytm od pierwszych sekund.',
        'bassmarker.feature1': 'Automatyczne markery na uderzenia basu i perkusji',
        'bassmarker.feature2': 'Idealne do shortów, recenzji, trailerów i dynamicznych montaży',
        'bassmarker.feature3': 'Eksport gotowy pod Final Cut Pro',
        'bassmarker.feature4': 'Projekty 24/25/30/60 FPS',
        'bassmarker.cta': 'Kupić BassMarker Pro',
        'bassmarker.priceNote': 'jednorazowo',
        'social.label': 'Kanały',
        'social.title': 'Tu pojawiają się recenzje, testy i kulisy pracy.',
        'contact.eyebrow': 'Kontakt',
        'footer.copyright': '&copy; 2026 Tech2u. Wszystkie prawa zastrzeżone.'
      }
    },
    en: {
      htmlLang: 'en',
      pageTitle: 'Tech2u — AI, editing and BassMarker Pro',
      pageDescription: 'Tech2u — a premium studio for reviews, video editing and AI tools. Discover BassMarker Pro for Final Cut Pro.',
      strings: {
        'nav.showcase': 'Showcase',
        'nav.bassmarker': 'BassMarker Pro',
        'nav.social': 'Social',
        'hero.eyebrow': 'AI · EDITING · REVIEWS',
        'hero.title': 'A technology studio<br><span>with its own rhythm.</span>',
        'hero.lead': 'Tech2u is where hardware reviews, video editing, and AI automation meet in one refined visual system.',
        'hero.ctaPrimary': 'Discover BassMarker Pro',
        'hero.ctaGhost': 'See the shots',
        'showcase.label': 'Showcase',
        'showcase.title': 'Three scenes: <span>reviews, editing, AI.</span>',
        'showcase.review.title': 'Reviews with a premium point of view',
        'showcase.review.body': 'Gear shown like a campaign product: decisive lighting, a clear verdict, and useful details without the clutter.',
        'showcase.edit.title': 'Editing built on rhythm',
        'showcase.edit.body': 'Motion, transitions, and pacing guide the viewer like a well-cut trailer instead of a pile of random effects.',
        'showcase.ai.title': 'AI as an assistant, not decoration',
        'showcase.ai.body': 'The robot is only a small AI mark. The central scene belongs to the work, the product, and the result.',
        'bassmarker.label': 'Editing tool',
        'bassmarker.title': 'BassMarker <span>Pro</span>',
        'bassmarker.lead': 'It analyses music and automatically places beat markers, so your Final Cut Pro edit locks to rhythm from the very first seconds.',
        'bassmarker.feature1': 'Automatic markers for bass and drum hits',
        'bassmarker.feature2': 'Built for shorts, reviews, trailers, and dynamic edits',
        'bassmarker.feature3': 'Export ready for Final Cut Pro',
        'bassmarker.feature4': '24/25/30/60 FPS projects',
        'bassmarker.cta': 'Buy BassMarker Pro',
        'bassmarker.priceNote': 'one-time payment',
        'social.label': 'Channels',
        'social.title': 'Reviews, tests, and behind-the-scenes work live here.',
        'contact.eyebrow': 'Contact',
        'footer.copyright': '&copy; 2026 Tech2u. All rights reserved.'
      }
    }
  };

  function setLanguage(language) {
    var dictionary = translations[language];
    if (!dictionary) return;

    document.documentElement.lang = dictionary.htmlLang;
    document.getElementById('pageTitle').textContent = dictionary.pageTitle;
    document.getElementById('pageDescription').setAttribute('content', dictionary.pageDescription);

    document.querySelectorAll('[data-i18n]').forEach(function (element) {
      var key = element.getAttribute('data-i18n');
      if (dictionary.strings[key] !== undefined) element.textContent = dictionary.strings[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (element) {
      var key = element.getAttribute('data-i18n-html');
      if (dictionary.strings[key] !== undefined) element.innerHTML = dictionary.strings[key];
    });

    document.querySelectorAll('.lang-btn').forEach(function (button) {
      var active = button.getAttribute('data-lang') === language;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    try { localStorage.setItem(storageKey, language); } catch (error) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    var savedLanguage;
    try { savedLanguage = localStorage.getItem(storageKey); } catch (error) {}
    setLanguage(savedLanguage === 'en' ? 'en' : 'pl');

    document.querySelectorAll('.lang-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        setLanguage(button.getAttribute('data-lang'));
      });
    });
  });
}());
