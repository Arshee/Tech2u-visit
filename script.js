(() => {
  const canvas = document.querySelector("#heroCanvas");
  const context = canvas.getContext("2d");
  const hero = document.querySelector(".hero");
  const robot = document.querySelector("#heroRobot");
  const stars = [];
  let width = 0;
  let height = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth; height = canvas.clientHeight;
    canvas.width = width * ratio; canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars.length = 0;
    const amount = Math.min(180, Math.floor(width * height / 8200));
    for (let index = 0; index < amount; index += 1) stars.push({ x:Math.random()*width, y:Math.random()*height, size:Math.random()*1.8+.25, speed:Math.random()*.55+.08, gold:Math.random()>.82 });
  };
  const draw = (time) => {
    context.clearRect(0,0,width,height);
    const originX = width*.72; const originY = height*.54;
    const glow = context.createRadialGradient(originX,originY,0,originX,originY,Math.max(width,height)*.55);
    glow.addColorStop(0,"rgba(71,117,255,.18)"); glow.addColorStop(.55,"rgba(21,48,105,.05)"); glow.addColorStop(1,"rgba(0,0,0,0)"); context.fillStyle=glow; context.fillRect(0,0,width,height);
    [0,1,2].forEach((index) => { context.strokeStyle=index===1?"rgba(234,200,136,.1)":"rgba(126,160,255,.1)"; context.beginPath(); context.ellipse(originX+index*16,originY+index*8,width*(.22+index*.055),height*(.13+index*.035),-.25,.1,Math.PI*1.82); context.stroke(); });
    stars.forEach((star,index) => { star.x-=star.speed*(index%3+1); star.y+=Math.sin(time*.0007+index)*.05; if(star.x < -12){star.x=width+12;star.y=Math.random()*height;} context.strokeStyle=star.gold?"rgba(246,213,145,.37)":"rgba(168,204,255,.34)"; context.beginPath();context.moveTo(star.x+star.size*7,star.y);context.lineTo(star.x,star.y);context.stroke(); context.fillStyle=star.gold?"rgba(250,224,173,.96)":"rgba(213,232,255,.9)";context.beginPath();context.arc(star.x,star.y,star.size,0,Math.PI*2);context.fill(); });
    for(let index=0;index<5;index+=1){const angle=time*.00025*(index%2?1:-1)+index*1.21;const x=originX+Math.cos(angle)*width*(.13+index*.015);const y=originY+Math.sin(angle)*height*(.08+index*.01);context.fillStyle=index===2?"#f3d59d":"#d5ecff";context.shadowBlur=14;context.shadowColor=context.fillStyle;context.beginPath();context.arc(x,y,index===2?2.4:1.45,0,Math.PI*2);context.fill();context.shadowBlur=0;}
    if(!matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(draw);
  };
  hero.addEventListener("pointermove",(event)=>{const x=(event.clientX/innerWidth-.5)*15;const y=(event.clientY/innerHeight-.5)*9;robot.style.transform=`translate3d(${x}px,${y}px,0)`;});
  hero.addEventListener("pointerleave",()=>{robot.style.transform="translate3d(0,0,0)";});
  const tagMotions = [{ x:46, y:-34, turn:8, duration:8.6 }, { x:-52, y:-42, turn:-9, duration:10.2 }, { x:42, y:38, turn:7, duration:9.4 }];
  document.querySelectorAll(".orbit-tag").forEach((tag,index)=>{const motion=tagMotions[index]||tagMotions[0]; const factor=innerWidth<761?.58:1; tag.style.setProperty("--duration",`${motion.duration}s`);tag.style.setProperty("--delay",`${-Math.random()*motion.duration}s`);tag.style.setProperty("--move-x",`${motion.x*factor}px`);tag.style.setProperty("--move-y",`${motion.y*factor}px`);tag.style.setProperty("--turn",`${motion.turn}deg`);if(index===1)tag.style.animationDirection="alternate-reverse";});

  const socialCanvas = document.querySelector("#socialCanvas");
  if (socialCanvas) {
    const social = document.querySelector(".social");
    const socialContext = socialCanvas.getContext("2d");
    const signals = Array.from({ length:18 }, () => ({ x:Math.random(), y:Math.random(), radius:Math.random()*1.6+.7, phase:Math.random()*Math.PI*2, speed:Math.random()*.34+.12, gold:Math.random()>.78 }));
    const shootingStars = [{ at:5.4, x:.12, y:.2, length:.19 }, { at:21.8, x:.68, y:.14, length:.17 }, { at:39.1, x:.3, y:.38, length:.21 }];
    let socialWidth = 0; let socialHeight = 0; let socialPointer = { x:.56, y:.48 };
    const resizeSocialCanvas = () => { const ratio=Math.min(window.devicePixelRatio||1,2); socialWidth=social.clientWidth; socialHeight=social.clientHeight; socialCanvas.width=socialWidth*ratio; socialCanvas.height=socialHeight*ratio; socialContext.setTransform(ratio,0,0,ratio,0,0); };
    const drawSocialCanvas = (time) => {
      socialContext.clearRect(0,0,socialWidth,socialHeight);
      const centerX=socialWidth*(.54+(socialPointer.x-.5)*.035); const centerY=socialHeight*(.48+(socialPointer.y-.5)*.03);
      [0,1,2].forEach((ring) => { socialContext.strokeStyle=ring===1?"rgba(236,198,126,.1)":"rgba(135,159,255,.09)"; socialContext.lineWidth=1; socialContext.beginPath(); socialContext.ellipse(centerX+ring*18,centerY+ring*10,socialWidth*(.16+ring*.065),socialHeight*(.09+ring*.044),-.24,.12,Math.PI*1.84); socialContext.stroke(); });
      signals.forEach((signal,index) => { const x=signal.x*socialWidth+Math.sin(time*.00028*signal.speed+signal.phase)*34; const y=signal.y*socialHeight+Math.cos(time*.00023*signal.speed+signal.phase)*22; const near=Math.abs(x-centerX)<socialWidth*.32&&Math.abs(y-centerY)<socialHeight*.26; if(near){socialContext.strokeStyle=signal.gold?"rgba(241,204,132,.11)":"rgba(151,185,255,.08)";socialContext.beginPath();socialContext.moveTo(x,y);socialContext.lineTo(centerX+(index%3-1)*44,centerY+(index%4-1)*28);socialContext.stroke();} socialContext.fillStyle=signal.gold?"rgba(247,211,143,.7)":"rgba(186,210,255,.62)";socialContext.beginPath();socialContext.arc(x,y,signal.radius,0,Math.PI*2);socialContext.fill(); });
      const cycle=(time*.001)%47;
      shootingStars.forEach((star) => { const elapsed=cycle-star.at; if(elapsed<0||elapsed>1.1)return; const progress=elapsed/1.1; const x=(star.x+progress*.28)*socialWidth; const y=(star.y+progress*.19)*socialHeight; const length=star.length*socialWidth*(.45+progress*.55); socialContext.save(); socialContext.globalAlpha=Math.sin(progress*Math.PI)*.95; socialContext.strokeStyle="rgba(255,244,210,.96)"; socialContext.lineWidth=2.2; socialContext.shadowBlur=18; socialContext.shadowColor="rgba(232,196,128,.9)"; socialContext.beginPath(); socialContext.moveTo(x-length,y-length*.26); socialContext.lineTo(x,y); socialContext.stroke(); socialContext.fillStyle="#fff5d8"; socialContext.beginPath(); socialContext.arc(x,y,2.5,0,Math.PI*2); socialContext.fill(); socialContext.restore(); });
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(drawSocialCanvas);
    };
    social.addEventListener("pointermove",(event)=>{const rect=social.getBoundingClientRect();socialPointer={x:(event.clientX-rect.left)/rect.width,y:(event.clientY-rect.top)/rect.height};},{passive:true});
    resizeSocialCanvas(); addEventListener("resize",resizeSocialCanvas,{passive:true}); drawSocialCanvas(0);
  }

  const translations = {
    pl: {
      "nav.social":"Sociale", "nav.contact":"Kontakt", "nav.edit":"Montaz", "nav.follow":"Obserwuj <b>↗</b>",
      "hero.title":"Witaj w swiecie<br><span>Tech2u.</span>", "hero.body":"Lacze technologie, film i AI, aby tworzyc tresci, ktore inspiruja, edukują i pomagaja dzialac szybciej.", "hero.explore":"Odkryj kanaly <b>↗</b>", "hero.statusLabel":"AKTUALNIE TWORZE", "hero.statusBody":"AI dla montazu w Final Cut Pro", "hero.scroll":"SCROLL DOWN",
      "social.label":"SOCIAL MEDIA", "social.eyebrow":"KANALY TECH2U", "social.title":"Jedna pasja.<br><span>Cztery formaty.</span>", "social.body":"Tworze tresci tam, gdzie maja najwiekszy sens. Kazda platforma ma swoj charakter, a ja wykorzystuje to w 100%.", "social.cta":"Zobacz wszystkie kanaly ↗",
      "tag.reviews":"RECENZJE", "tag.edit":"MONTAZ", "tag.social":"SOCIALE", "link.youtube":"Pelne recenzje", "link.youtubeDesc":"Szczegolowe testy, porownania i analizy.", "link.tiktok":"Szybkie testy", "link.tiktokDesc":"Krotkie, dynamiczne i konkretne materialy.", "link.instagram":"Kulisy i lifestyle", "link.instagramDesc":"Zajrzyj za kulisy nagran i zobacz technologie od kuchni.", "link.facebook":"Newsy i premiery", "link.facebookDesc":"Najswiezze informacje i wazne wydarzenia ze swiata tech.", "metric.community":"SPOLECZNOSC", "metric.formats":"FORMATY", "metric.reviews":"RECENZJE I TESTY", "metric.tools":"NARZEDZIA", "edit.index":"TWORCA + DEWELOPER", "edit.eyebrow":"MATERIAL / RYTM / HISTORIA", "edit.title":"Film dla<br><span>emocji.</span>", "edit.body":"Tempo, kolor i przejscia maja dzialac, zanim padnie pierwsze slowo.", "product.eyebrow":"AI DLA MONTAZYSTOW", "product.body":"Wykrywa beaty i automatycznie stawia markery w Final Cut Pro. Ty budujesz historie, program pilnuje rytmu.", "product.cta":"Chce BassMarker Pro ↗", "contact.label":"KONTAKT", "contact.eyebrow":"WSPÓŁPRACA / PARTNERSTWA", "contact.title":"Współpraca? <span>Napisz do mnie.</span>", "contact.body":"Recenzje sprzetu, integracje i partnerstwa - chetnie pogadam."
    },
    en: {
      "nav.social":"Social", "nav.contact":"Contact", "nav.edit":"Editing", "nav.follow":"Follow <b>↗</b>",
      "hero.title":"Welcome to<br><span>Tech2u.</span>", "hero.body":"I combine technology, film and AI to create content that inspires, educates and helps you move faster.", "hero.explore":"Explore channels <b>↗</b>", "hero.statusLabel":"CURRENTLY BUILDING", "hero.statusBody":"AI for editing in Final Cut Pro", "hero.scroll":"SCROLL DOWN",
      "social.label":"SOCIAL MEDIA", "social.eyebrow":"TECH2U CHANNELS", "social.title":"One passion.<br><span>Four formats.</span>", "social.body":"I create content where it makes the most sense. Every platform has its own character, and I use that to the fullest.", "social.cta":"See all channels ↗",
      "tag.reviews":"REVIEWS", "tag.edit":"EDITING", "tag.social":"SOCIAL", "link.youtube":"Full reviews", "link.youtubeDesc":"In-depth tests, comparisons and analysis.", "link.tiktok":"Quick tests", "link.tiktokDesc":"Short, dynamic and specific videos.", "link.instagram":"Behind the scenes", "link.instagramDesc":"Look behind the scenes and see technology in context.", "link.facebook":"News and launches", "link.facebookDesc":"Latest updates and important events from the tech world.", "metric.community":"COMMUNITY", "metric.formats":"FORMATS", "metric.reviews":"REVIEWS AND TESTS", "metric.tools":"TOOLS", "edit.index":"CREATOR + DEVELOPER", "edit.eyebrow":"FOOTAGE / RHYTHM / STORY", "edit.title":"Film for<br><span>emotion.</span>", "edit.body":"Pacing, colour and transitions should work before the first word is spoken.", "product.eyebrow":"AI FOR EDITORS", "product.body":"It detects beats and automatically places markers in Final Cut Pro. You shape the story while the app keeps the rhythm.", "product.cta":"Get BassMarker Pro ↗", "contact.label":"CONTACT", "contact.eyebrow":"COLLABORATION / PARTNERSHIPS", "contact.title":"Want to work together? <span>Write to me.</span>", "contact.body":"Product reviews, integrations and partnerships - happy to talk."
    }
  };
  const socialProfiles = {
    pl: { youtube:"https://www.youtube.com/@tech2upl", tiktok:"https://www.tiktok.com/@tech2upl", instagram:"https://www.instagram.com/tech2upl/", facebook:"https://www.facebook.com/tech2upl" },
    en: { youtube:"https://www.youtube.com/@Tech2uEN", tiktok:"https://www.tiktok.com/@tech2uen", instagram:"https://www.instagram.com/tech2uen/", facebook:"https://www.facebook.com/Tech2uen" }
  };
  const languageButton = document.querySelector("#languageToggle");
  const buildContactTitle = () => {
    const title = document.querySelector(".contact h2[data-i18n-html='contact.title']");
    if (!title) return;
    const groups = [];
    title.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) groups.push({ text:node.textContent, accent:false });
      if (node.nodeType === Node.ELEMENT_NODE) groups.push({ text:node.textContent, accent:true });
    });
    const label = groups.map((group) => group.text).join("").replace(/\s+/g, " ").trim();
    title.setAttribute("aria-label", label);
    title.innerHTML = "";
    let order = 0;
    groups.forEach((group) => {
      group.text.split(/(\s+)/).forEach((chunk) => {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) {
          title.append(document.createTextNode(" "));
          return;
        }
        const word = document.createElement("span");
        word.className = `contact-title-word${group.accent ? " is-accent" : ""}`;
        Array.from(chunk).forEach((char) => {
          const letter = document.createElement("span");
          letter.className = "contact-title-letter";
          letter.textContent = char;
          letter.style.setProperty("--drop-delay", `${Math.min(order * .038, 1.35)}s`);
          letter.style.setProperty("--drop-x", `${Math.sin(order * 1.7) * 28}px`);
          letter.style.setProperty("--drop-rot", `${Math.cos(order * 1.3) * 18}deg`);
          word.append(letter);
          order += 1;
        });
        title.append(word);
      });
    });
  };
  const applyLanguage = (language) => {
    document.documentElement.lang = language;
    document.querySelectorAll("[data-i18n]").forEach((element) => { const text = translations[language][element.dataset.i18n]; if (text) element.textContent = text; });
    document.querySelectorAll("[data-i18n-html]").forEach((element) => { const text = translations[language][element.dataset.i18nHtml]; if (text) element.innerHTML = text; });
    document.querySelectorAll("[data-social-profile]").forEach((element) => { element.href = socialProfiles[language][element.dataset.socialProfile]; });
    languageButton.textContent = language === "pl" ? "EN" : "PL";
    buildContactTitle();
    localStorage.setItem("tech2u-language", language);
  };
  const savedLanguage = localStorage.getItem("tech2u-language") || "pl";
  applyLanguage(savedLanguage);
  languageButton.addEventListener("click", () => applyLanguage(document.documentElement.lang === "pl" ? "en" : "pl"));

  const contact = document.querySelector(".contact");
  if (contact && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const playContactTitle = () => {
      contact.classList.remove("letters-on");
      void contact.offsetWidth;
      contact.classList.add("letters-on");
    };
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playContactTitle();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold:.32, rootMargin:"0px 0px -12% 0px" });
      observer.observe(contact);
    } else {
      playContactTitle();
    }
  }

  const bassmarker = document.querySelector("[data-bassmarker]");
  let bassmarkerFrame = false;
  const updateBassmarker = () => {
    bassmarkerFrame = false;
    if (!bassmarker) return;
    const rect = bassmarker.getBoundingClientRect();
    const travel = Math.max(bassmarker.offsetHeight - innerHeight, 1);
    const progress = Math.max(0, Math.min(1, -rect.top / travel));
    const markerProgress = Math.max(0, Math.min(1, (progress - .03) / .32));
    const timelineExit = Math.max(0, Math.min(1, (progress - .24) / .48));
    const productOpacity = Math.max(0, Math.min(1, (progress - .32) / .28));
    const productProgress = Math.max(0, Math.min(1, (progress - .13) / .82));
    const productEase = productProgress < .5 ? 2 * productProgress * productProgress : 1 - Math.pow(-2 * productProgress + 2, 2) / 2;
    bassmarker.style.setProperty("--timeline-scale", (.62 + Math.min(progress / .2, 1) * .64).toFixed(3));
    bassmarker.style.setProperty("--timeline-opacity", `${1 - timelineExit}`);
    bassmarker.style.setProperty("--marker-opacity", markerProgress.toFixed(2));
    bassmarker.style.setProperty("--marker-y", `${-46 + markerProgress * 46}px`);
    bassmarker.style.setProperty("--playhead-x", `${4 + markerProgress * 82}%`);
    bassmarker.style.setProperty("--product-opacity", productOpacity.toFixed(2));
    bassmarker.style.setProperty("--product-y", `${150 - productEase * 150}px`);
    bassmarker.style.setProperty("--product-scale", (.96 + productEase * .04).toFixed(3));
    bassmarker.style.setProperty("--product-pointer", productProgress > .88 ? "auto" : "none");
  };
  const requestBassmarkerUpdate = () => { if (!bassmarkerFrame) { bassmarkerFrame = true; requestAnimationFrame(updateBassmarker); } };
  addEventListener("scroll", requestBassmarkerUpdate, { passive:true });
  addEventListener("resize", requestBassmarkerUpdate, { passive:true });
  updateBassmarker();
  resize(); addEventListener("resize",resize,{passive:true}); draw(0);
})();
