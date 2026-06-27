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
      "nav.about":"Poznaj", "nav.social":"Sociale", "nav.films":"Filmy", "nav.ai":"AI", "nav.contact":"Kontakt", "nav.edit":"Montaż", "nav.follow":"Obserwuj <b>↗</b>",
      "hero.title":"Witaj w świecie<br><span>Tech2u.</span>", "hero.body":"Recenzuję technologie, pokazuję kulisy tworzenia filmów i buduję narzędzia AI, które realnie przyspieszają pracę.", "hero.explore":"Poznaj Tech2u <b>↗</b>", "hero.statusLabel":"AKTUALNIE TWORZĘ", "hero.statusBody":"AI dla montażu w Final Cut Pro", "hero.scroll":"SCROLL DOWN",
      "about.label":"POZNAJ TECH2U", "about.eyebrow":"KIM JESTEM", "about.title":"Człowiek od<br><span>technologii w praktyce.</span>", "about.body":"Za Tech2u stoję ja: testuję sprzęt, auta, drony i narzędzia AI, montuję filmy i buduję własne rozwiązania, które realnie skracają drogę od pomysłu do gotowego materiału.", "about.card1Title":"Twórca przed kamerą", "about.card1Body":"Pokazuję technologię normalnym językiem: co działa, co przeszkadza i co faktycznie ma sens.", "about.card2Title":"Montaż jako opowieść", "about.card2Body":"Tempo, dźwięk i obraz mają prowadzić widza, nie tylko wyglądać dobrze.", "about.card3Title":"Developer narzędzi", "about.card3Body":"Buduję rozwiązania wokół AI i Final Cut Pro, bo najlepszy workflow to taki, który oszczędza czas.",
      "tests.label":"CO TESTUJĘ", "tests.eyebrow":"SPRZĘT / MOBILNOŚĆ / TWORZENIE", "tests.title":"Rzeczy, które<br><span>wchodzą do pracy.</span>", "tests.carTitle":"Auta i mobilność", "tests.carBody":"Technologia, komfort, multimedia i realne użytkowanie.", "tests.droneTitle":"Drony i ujęcia", "tests.droneBody":"Stabilizacja, obraz, latanie i sens w produkcji wideo.", "tests.cameraTitle":"Foto / wideo", "tests.cameraBody":"Kamery, audio, światło i akcesoria dla twórców.", "tests.aiTitle":"AI tools", "tests.aiBody":"Narzędzia, które przyspieszają montaż, research i publikację.",
      "social.label":"SOCIAL MEDIA", "social.eyebrow":"KANAŁY TECH2U", "social.title":"Jedna pasja.<br><span>Cztery formaty.</span>", "social.body":"Tworzę treści tam, gdzie mają największy sens. Każda platforma ma swój charakter, a ja wykorzystuję to w 100%.", "social.cta":"Zobacz wszystkie kanały ↗",
      "tag.reviews":"RECENZJE", "tag.edit":"MONTAŻ", "tag.social":"SOCIALE", "link.youtube":"Pełne recenzje", "link.youtubeDesc":"Szczegółowe testy, porównania i analizy.", "link.tiktok":"Szybkie testy", "link.tiktokDesc":"Krótkie, dynamiczne i konkretne materiały.", "link.instagram":"Kulisy i lifestyle", "link.instagramDesc":"Zajrzyj za kulisy nagrań i zobacz technologię od kuchni.", "link.facebook":"Newsy i premiery", "link.facebookDesc":"Najświeższe informacje i ważne wydarzenia ze świata tech.", "metric.community":"SPOŁECZNOŚĆ", "metric.formats":"FORMATY", "metric.reviews":"RECENZJE I TESTY", "metric.tools":"NARZĘDZIA",
      "making.label":"JAK POWSTAJĄ FILMY", "making.eyebrow":"OD POMYSŁU DO ODCINKA", "making.title":"Najpierw chaos.<br><span>Potem historia.</span>", "making.body":"Ta sekcja pokazuje, co dzieje się zanim film trafi na kanał: research, test sprzętu, nagranie, selekcja ujęć, timeline, dźwięk, kolor i finalny rytm materiału.",
      "ai.label":"JAK TWORZĘ AI", "ai.eyebrow":"AUTOMATYZACJE / ANALIZA / FLOW", "ai.title":"AI ma pomagać,<br><span>nie przeszkadzać.</span>", "ai.body":"Buduję narzędzia pod konkretne problemy: analiza audio, markery, research, opisy, skrypty i szybszy montaż.", "ai.step1Title":"Analiza materiału", "ai.step1Body":"Rytm, dźwięk, tempo i miejsca, które warto oznaczyć.", "ai.step2Title":"Automatyzacja", "ai.step2Body":"Powtarzalne kroki idą do narzędzi, a decyzje zostają po stronie twórcy.", "ai.step3Title":"Publikacja", "ai.step3Body":"Formaty, opisy i wersje pod różne platformy.",
      "product.eyebrow":"AI DLA MONTAŻYSTÓW", "product.body":"Wykrywa beaty i automatycznie stawia markery w Final Cut Pro. Ty budujesz historię, program pilnuje rytmu.", "product.cta":"Chcę BassMarker Pro ↗",
      "why.label":"DLACZEGO WARTO OBSERWOWAĆ", "why.title":"Mniej szumu.<br><span>Więcej decyzji.</span>", "why.oneTitle":"Praktyczne testy", "why.oneBody":"Nie tylko parametry. Liczy się to, czy sprzęt pomaga w realnym życiu.", "why.twoTitle":"Kulisy pracy", "why.twoBody":"Pokazuję setup, błędy, poprawki i finalny flow.", "why.threeTitle":"AI bez magii", "why.threeBody":"Konkretnie: co działa, co nie działa i gdzie jest sens.",
      "contact.label":"KONTAKT", "contact.eyebrow":"WSPÓŁPRACA / PARTNERSTWA", "contact.title":"Współpraca? <span>Napisz do mnie.</span>", "contact.body":"Recenzje sprzętu, integracje i partnerstwa - chętnie pogadam."
    },
    en: {
      "nav.about":"About", "nav.social":"Social", "nav.films":"Films", "nav.ai":"AI", "nav.contact":"Contact", "nav.edit":"Editing", "nav.follow":"Follow <b>↗</b>",
      "hero.title":"Welcome to<br><span>Tech2u.</span>", "hero.body":"I review technology, show the process behind videos and build AI tools that genuinely speed up creative work.", "hero.explore":"Meet Tech2u <b>↗</b>", "hero.statusLabel":"CURRENTLY BUILDING", "hero.statusBody":"AI for editing in Final Cut Pro", "hero.scroll":"SCROLL DOWN",
      "about.label":"MEET TECH2U", "about.eyebrow":"WHO I AM", "about.title":"A practical<br><span>technology creator.</span>", "about.body":"Tech2u is me: I test gear, cars, drones and AI tools, edit videos and build my own solutions that shorten the path from idea to finished content.", "about.card1Title":"Creator on camera", "about.card1Body":"I explain technology in plain language: what works, what gets in the way and what actually makes sense.", "about.card2Title":"Editing as a story", "about.card2Body":"Pacing, sound and image should guide the viewer, not only look good.", "about.card3Title":"Tool developer", "about.card3Body":"I build around AI and Final Cut Pro because the best workflow is the one that saves time.",
      "tests.label":"WHAT I TEST", "tests.eyebrow":"GEAR / MOBILITY / CREATION", "tests.title":"Tools that<br><span>enter the workflow.</span>", "tests.carTitle":"Cars and mobility", "tests.carBody":"Technology, comfort, multimedia and real daily use.", "tests.droneTitle":"Drones and shots", "tests.droneBody":"Stabilisation, image quality, flying and purpose in video production.", "tests.cameraTitle":"Photo / video", "tests.cameraBody":"Cameras, audio, lighting and creator accessories.", "tests.aiTitle":"AI tools", "tests.aiBody":"Tools that speed up editing, research and publishing.",
      "social.label":"SOCIAL MEDIA", "social.eyebrow":"TECH2U CHANNELS", "social.title":"One passion.<br><span>Four formats.</span>", "social.body":"I create content where it makes the most sense. Every platform has its own character, and I use that to the fullest.", "social.cta":"See all channels ↗",
      "tag.reviews":"REVIEWS", "tag.edit":"EDITING", "tag.social":"SOCIAL", "link.youtube":"Full reviews", "link.youtubeDesc":"In-depth tests, comparisons and analysis.", "link.tiktok":"Quick tests", "link.tiktokDesc":"Short, dynamic and specific videos.", "link.instagram":"Behind the scenes", "link.instagramDesc":"Look behind the scenes and see technology in context.", "link.facebook":"News and launches", "link.facebookDesc":"Latest updates and important events from the tech world.", "metric.community":"COMMUNITY", "metric.formats":"FORMATS", "metric.reviews":"REVIEWS AND TESTS", "metric.tools":"TOOLS",
      "making.label":"HOW VIDEOS ARE MADE", "making.eyebrow":"FROM IDEA TO EPISODE", "making.title":"First chaos.<br><span>Then story.</span>", "making.body":"This section shows what happens before a video reaches the channel: research, gear tests, recording, shot selection, timeline, sound, colour and the final rhythm.",
      "ai.label":"HOW I BUILD AI", "ai.eyebrow":"AUTOMATION / ANALYSIS / FLOW", "ai.title":"AI should help,<br><span>not get in the way.</span>", "ai.body":"I build tools for specific problems: audio analysis, markers, research, descriptions, scripts and faster editing.", "ai.step1Title":"Material analysis", "ai.step1Body":"Rhythm, sound, pacing and moments worth marking.", "ai.step2Title":"Automation", "ai.step2Body":"Repeatable steps go into tools, while creative decisions stay with the creator.", "ai.step3Title":"Publishing", "ai.step3Body":"Formats, descriptions and versions for different platforms.",
      "product.eyebrow":"AI FOR EDITORS", "product.body":"It detects beats and automatically places markers in Final Cut Pro. You shape the story while the app keeps the rhythm.", "product.cta":"Get BassMarker Pro ↗",
      "why.label":"WHY FOLLOW", "why.title":"Less noise.<br><span>Better decisions.</span>", "why.oneTitle":"Practical tests", "why.oneBody":"Not only specs. What matters is whether gear helps in real life.", "why.twoTitle":"Real workflow", "why.twoBody":"I show the setup, mistakes, fixes and final flow.", "why.threeTitle":"AI without magic", "why.threeBody":"Clearly: what works, what does not and where it makes sense.",
      "contact.label":"CONTACT", "contact.eyebrow":"COLLABORATION / PARTNERSHIPS", "contact.title":"Want to work together? <span>Write to me.</span>", "contact.body":"Product reviews, integrations and partnerships - happy to talk."
    }
  };
  const businessTranslations = {
    pl: {
      "nav.about":"O mnie", "nav.services":"Usługi", "nav.projects":"Projekty", "nav.video":"Video", "nav.social":"Sociale", "nav.contact":"Kontakt", "nav.follow":"Współpraca <b>↗</b>",
      "hero.title":"Technologia, AI<br><span>i produkcja wideo.</span>", "hero.body":"Łączę technologię, AI i produkcję wideo, tworząc treści oraz rozwiązania dla nowoczesnych marek.", "hero.explore":"Współpraca <b>↗</b>", "hero.projects":"Zobacz projekty <b>↗</b>", "hero.statusBody":"Recenzje, automatyzacje i aplikacje dla marek.",
      "sixty.label":"TECH2U W 60 SEKUND", "sixty.title":"Najpierw zobacz<br><span>efekt.</span>", "sixty.body":"Krótki format, który może pokazać Ciebie, kulisy pracy, recenzje, aplikacje AI i projekty webowe w jednym mocnym materiale.",
      "about.label":"O MNIE", "about.eyebrow":"KIM JESTEM", "about.title":"Twórca, który<br><span>rozumie produkt.</span>", "about.body":"Od kilku lat łączę technologię, tworzenie filmów i projektowanie aplikacji webowych. Dzięki temu pomagam markom pokazać produkt tak, żeby był zrozumiały, wiarygodny i atrakcyjny dla odbiorcy.",
      "numbers.one":"filmów", "numbers.two":"wyświetleń", "numbers.three":"projektów", "numbers.four":"lat doświadczenia",
      "services.label":"CZYM SIĘ ZAJMUJĘ", "services.title":"Treści, narzędzia<br><span>i technologia.</span>", "services.videoTitle":"Produkcja Video", "services.videoBody":"Recenzje, reklamy, materiały promocyjne i filmy produktowe.", "services.aiTitle":"AI Solutions", "services.aiBody":"Automatyzacja pracy, chatboty, workflow AI i integracje.", "services.webTitle":"Web Development", "services.webBody":"Nowoczesne strony internetowe oraz aplikacje dla marek i twórców.", "services.contentTitle":"Content Creation", "services.contentBody":"YouTube, TikTok, Instagram, Shorts i formaty pod konkretną platformę.",
      "projects.label":"WYBRANE PROJEKTY", "projects.title":"Efekt, który da się<br><span>pokazać.</span>", "projects.tech2u":"Nowoczesna wizytówka twórcy technologicznego z animacjami i sekcjami sprzedażowymi.", "projects.bassmarker":"Aplikacja, która analizuje rytm audio i automatycznie ustawia markery do montażu.", "projects.ai":"Automatyzacje researchu, opisów, struktury materiału i publikacji treści.",
      "video.label":"PORTFOLIO VIDEO", "video.title":"Formaty, które<br><span>pracują.</span>", "video.oneTitle":"Recenzja technologii", "video.oneBody":"Pełny test produktu, porównania, wnioski i ujęcia użytkowe.", "video.twoTitle":"Szybki format", "video.twoBody":"Dynamiczny materiał 30-60 sekund pod TikTok, Reels i Shorts.", "video.threeTitle":"Kulisy produkcji", "video.threeBody":"Proces, setup, narzędzia, montaż i decyzje za gotowym filmem.",
      "tech.label":"TECHNOLOGIE", "tech.title":"Narzędzia dobierane<br><span>do efektu.</span>",
      "cooperation.label":"WSPÓŁPRACA", "cooperation.title":"Jak możemy<br><span>współpracować?</span>", "cooperation.oneTitle":"Recenzje produktów", "cooperation.oneBody":"Profesjonalne testy sprzętu, ujęcia produktowe i jasne wnioski dla odbiorcy.", "cooperation.twoTitle":"Kampanie reklamowe", "cooperation.twoBody":"Video sponsorowane, materiały social i formaty pod launch produktu.", "cooperation.threeTitle":"Rozwiązania AI", "cooperation.threeBody":"Chatboty, automatyzacje, analiza treści i procesy, które oszczędzają czas.", "cooperation.fourTitle":"Aplikacje internetowe", "cooperation.fourBody":"Projektowanie, wdrożenie i dopracowanie strony albo narzędzia webowego.",
      "testimonials.label":"OPINIE", "testimonials.title":"Konkretnie,<br><span>bez szumu.</span>", "testimonials.one":"Materiał był konkretny, estetyczny i gotowy do publikacji bez dodatkowych poprawek.", "testimonials.two":"Tech2u bardzo dobrze tłumaczy technologię językiem odbiorcy.", "testimonials.three":"Największa wartość to połączenie strategii, produkcji i technicznego wykonania.",
      "faq.label":"FAQ", "faq.title":"Najczęstsze<br><span>pytania.</span>", "faq.q1":"Czy realizujesz projekty zdalnie?", "faq.a1":"Tak. Mogę poprowadzić współpracę zdalnie, od briefu po finalne materiały.", "faq.q2":"Ile trwa stworzenie strony?", "faq.a2":"Zależy od zakresu. Prosta wizytówka to zwykle kilka dni, większy projekt wymaga indywidualnej wyceny.", "faq.q3":"Czy tworzysz aplikacje AI?", "faq.a3":"Tak. Projektuję automatyzacje, chatboty i narzędzia dopasowane do konkretnego procesu.", "faq.q4":"Czy można zamówić film sponsorowany?", "faq.a4":"Tak, jeśli produkt pasuje do tematyki Tech2u i da się go pokazać uczciwie.", "faq.q5":"Czy wystawiasz fakturę?", "faq.a5":"Tak, szczegóły ustalamy przy konkretnej współpracy.",
      "contact.label":"KONTAKT", "contact.eyebrow":"WSPÓŁPRACA / PARTNERSTWA", "contact.title":"Masz produkt, projekt albo kampanię? <span>Napisz do mnie.</span>", "contact.body":"Opowiedz, co chcesz pokazać lub zautomatyzować. Odpowiem z konkretną propozycją."
    },
    en: {
      "nav.about":"About", "nav.services":"Services", "nav.projects":"Projects", "nav.video":"Video", "nav.social":"Social", "nav.contact":"Contact", "nav.follow":"Collaborate <b>↗</b>",
      "hero.title":"Technology, AI<br><span>and video production.</span>", "hero.body":"I combine technology, AI and video production to create content and solutions for modern brands.", "hero.explore":"Collaborate <b>↗</b>", "hero.projects":"See projects <b>↗</b>", "hero.statusBody":"Reviews, automation and apps for brands.",
      "sixty.label":"TECH2U IN 60 SECONDS", "sixty.title":"See the<br><span>effect first.</span>", "sixty.body":"A short format that can show you, behind the scenes, reviews, AI apps and web projects in one strong piece.",
      "about.label":"ABOUT ME", "about.eyebrow":"WHO I AM", "about.title":"A creator who<br><span>understands product.</span>", "about.body":"For several years I have combined technology, video creation and web app design. This helps brands show products in a clear, credible and attractive way.",
      "numbers.one":"videos", "numbers.two":"views", "numbers.three":"projects", "numbers.four":"years of experience",
      "services.label":"WHAT I DO", "services.title":"Content, tools<br><span>and technology.</span>", "services.videoTitle":"Video Production", "services.videoBody":"Reviews, ads, promotional materials and product videos.", "services.aiTitle":"AI Solutions", "services.aiBody":"Workflow automation, chatbots, AI processes and integrations.", "services.webTitle":"Web Development", "services.webBody":"Modern websites and applications for brands and creators.", "services.contentTitle":"Content Creation", "services.contentBody":"YouTube, TikTok, Instagram, Shorts and platform-native formats.",
      "projects.label":"SELECTED PROJECTS", "projects.title":"Work you can<br><span>actually show.</span>", "projects.tech2u":"A modern creator website with animations and business-focused sections.", "projects.bassmarker":"An app that analyzes audio rhythm and automatically places editing markers.", "projects.ai":"Automation for research, descriptions, content structure and publishing.",
      "video.label":"VIDEO PORTFOLIO", "video.title":"Formats that<br><span>do the job.</span>", "video.oneTitle":"Technology review", "video.oneBody":"A full product test with comparisons, takeaways and practical shots.", "video.twoTitle":"Fast format", "video.twoBody":"A dynamic 30-60 second video for TikTok, Reels and Shorts.", "video.threeTitle":"Behind the scenes", "video.threeBody":"Process, setup, tools, editing and decisions behind the finished video.",
      "tech.label":"TECHNOLOGIES", "tech.title":"Tools selected<br><span>for the outcome.</span>",
      "cooperation.label":"COLLABORATION", "cooperation.title":"How can we<br><span>work together?</span>", "cooperation.oneTitle":"Product reviews", "cooperation.oneBody":"Professional gear tests, product shots and clear takeaways for the audience.", "cooperation.twoTitle":"Ad campaigns", "cooperation.twoBody":"Sponsored video, social materials and launch-ready formats.", "cooperation.threeTitle":"AI solutions", "cooperation.threeBody":"Chatbots, automation, content analysis and time-saving processes.", "cooperation.fourTitle":"Web applications", "cooperation.fourBody":"Design, implementation and polishing of a website or web tool.",
      "testimonials.label":"TESTIMONIALS", "testimonials.title":"Clear work,<br><span>without noise.</span>", "testimonials.one":"The material was specific, polished and ready to publish without extra corrections.", "testimonials.two":"Tech2u explains technology in language the audience understands.", "testimonials.three":"The biggest value is combining strategy, production and technical execution.",
      "faq.label":"FAQ", "faq.title":"Common<br><span>questions.</span>", "faq.q1":"Do you work remotely?", "faq.a1":"Yes. I can run the collaboration remotely, from brief to final materials.", "faq.q2":"How long does a website take?", "faq.a2":"It depends on scope. A simple website usually takes a few days; larger projects need individual estimation.", "faq.q3":"Do you build AI applications?", "faq.a3":"Yes. I design automation, chatbots and tools matched to a specific process.", "faq.q4":"Can I order a sponsored video?", "faq.a4":"Yes, if the product fits Tech2u and can be presented honestly.", "faq.q5":"Can you issue an invoice?", "faq.a5":"Yes, details are agreed for each collaboration.",
      "contact.label":"CONTACT", "contact.eyebrow":"COLLABORATION / PARTNERSHIPS", "contact.title":"Have a product, project or campaign? <span>Write to me.</span>", "contact.body":"Tell me what you want to show or automate. I will respond with a concrete proposal."
    }
  };
  Object.keys(businessTranslations).forEach((language) => {
    translations[language] = { ...translations[language], ...businessTranslations[language] };
  });

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

  const statusOrbit = document.querySelector(".hero-status-orbit");
  if (statusOrbit) {
    const cards = Array.from(statusOrbit.querySelectorAll("[data-status-card]"));
    const previousButton = statusOrbit.querySelector("[data-status-prev]");
    const nextButton = statusOrbit.querySelector("[data-status-next]");
    const dotsContainer = statusOrbit.querySelector("[data-status-dots]");
    let activeStatus = 0;
    let statusTimer = 0;

    statusOrbit.classList.add("is-manual");
    if (dotsContainer) {
      dotsContainer.innerHTML = cards.map((_, index) => `<i aria-hidden="true" data-status-dot="${index}"></i>`).join("");
    }
    const dots = Array.from(statusOrbit.querySelectorAll("[data-status-dot]"));

    const renderStatusCards = () => {
      cards.forEach((card, index) => {
        card.classList.remove("is-current", "is-left", "is-right");
        const offset = (index - activeStatus + cards.length) % cards.length;
        if (offset === 0) card.classList.add("is-current");
        if (offset === 1) card.classList.add("is-right");
        if (offset === cards.length - 1) card.classList.add("is-left");
      });
      dots.forEach((dot, index) => dot.classList.toggle("is-active", index === activeStatus));
    };

    const goToStatus = (index) => {
      activeStatus = (index + cards.length) % cards.length;
      renderStatusCards();
    };

    const restartStatusTimer = () => {
      clearInterval(statusTimer);
      statusTimer = setInterval(() => goToStatus(activeStatus + 1), 30000);
    };

    previousButton?.addEventListener("click", () => {
      goToStatus(activeStatus - 1);
      restartStatusTimer();
    });
    nextButton?.addEventListener("click", () => {
      goToStatus(activeStatus + 1);
      restartStatusTimer();
    });
    dots.forEach((dot, index) => dot.addEventListener("click", () => {
      goToStatus(index);
      restartStatusTimer();
    }));

    renderStatusCards();
    restartStatusTimer();
  }

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

  const clampValue = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const smoothStep = (value) => value * value * (3 - 2 * value);
  const scrollScenes = Array.from(document.querySelectorAll("[data-scroll-scene]"));
  let sceneFrame = false;
  const updateScrollScenes = () => {
    sceneFrame = false;
    const viewportHeight = innerHeight || 1;
    const motionFactor = innerWidth < 760 ? .56 : innerWidth < 1080 ? .78 : 1;
    scrollScenes.forEach((scene) => {
      const rect = scene.getBoundingClientRect();
      const progress = clampValue((viewportHeight * .76 - rect.top) / (rect.height + viewportHeight * .28));
      scene.style.setProperty("--scene-shift", progress.toFixed(3));
      scene.querySelectorAll("[data-float-item]").forEach((item, index) => {
        const start = Number.parseFloat(item.dataset.start || "0");
        const end = Number.parseFloat(item.dataset.end || "1");
        const local = smoothStep(clampValue((progress - start) / Math.max(end - start, .001)));
        const fromX = Number.parseFloat(item.dataset.fromX || "0") * motionFactor;
        const fromY = Number.parseFloat(item.dataset.fromY || "0") * motionFactor;
        const toX = Number.parseFloat(item.dataset.toX || "0") * motionFactor;
        const toY = Number.parseFloat(item.dataset.toY || "0") * motionFactor;
        const rotFrom = Number.parseFloat(item.dataset.rotFrom || "0");
        const rotTo = Number.parseFloat(item.dataset.rotTo || "0");
        const float = Math.sin(performance.now() * .0015 + index * 1.7) * (8 + index * 2);
        item.style.setProperty("--tx", `${fromX + (toX - fromX) * local}px`);
        item.style.setProperty("--ty", `${fromY + (toY - fromY) * local + float * local}px`);
        item.style.setProperty("--rot", `${rotFrom + (rotTo - rotFrom) * local}deg`);
        item.style.setProperty("--item-scale", `${.82 + local * .18}`);
        item.style.setProperty("--item-opacity", `${clampValue(local * 1.25)}`);
      });
    });
  };
  const requestSceneUpdate = () => {
    if (!sceneFrame) {
      sceneFrame = true;
      requestAnimationFrame(updateScrollScenes);
    }
  };
  addEventListener("scroll", requestSceneUpdate, { passive:true });
  addEventListener("resize", requestSceneUpdate, { passive:true });
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const animateScrollScenes = () => {
      updateScrollScenes();
      requestAnimationFrame(animateScrollScenes);
    };
    animateScrollScenes();
  } else {
    updateScrollScenes();
  }

  const makingCanvas = document.querySelector(".making-canvas");
  if (makingCanvas && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const makingContext = makingCanvas.getContext("2d");
    const particles = Array.from({ length:52 }, () => ({ x:Math.random(), y:Math.random(), speed:Math.random()*.22+.06, size:Math.random()*1.7+.35, gold:Math.random()>.74, phase:Math.random()*Math.PI*2 }));
    let makingWidth = 0;
    let makingHeight = 0;
    const resizeMakingCanvas = () => {
      const ratio = Math.min(devicePixelRatio || 1, 2);
      makingWidth = makingCanvas.clientWidth;
      makingHeight = makingCanvas.clientHeight;
      makingCanvas.width = makingWidth * ratio;
      makingCanvas.height = makingHeight * ratio;
      makingContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const drawMakingCanvas = (time) => {
      makingContext.clearRect(0, 0, makingWidth, makingHeight);
      const glow = makingContext.createRadialGradient(makingWidth*.68, makingHeight*.42, 0, makingWidth*.68, makingHeight*.42, Math.max(makingWidth, makingHeight)*.58);
      glow.addColorStop(0, "rgba(108,88,255,.16)");
      glow.addColorStop(.48, "rgba(90,120,255,.045)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      makingContext.fillStyle = glow;
      makingContext.fillRect(0, 0, makingWidth, makingHeight);
      for (let index = 0; index < 5; index += 1) {
        makingContext.strokeStyle = index % 2 ? "rgba(236,198,126,.07)" : "rgba(135,159,255,.07)";
        makingContext.beginPath();
        makingContext.ellipse(makingWidth*.58, makingHeight*.48, makingWidth*(.22 + index*.055), makingHeight*(.09 + index*.035), -.18, 0, Math.PI*1.78);
        makingContext.stroke();
      }
      particles.forEach((particle, index) => {
        const x = (particle.x * makingWidth + Math.sin(time*.00022 + particle.phase) * 42) % makingWidth;
        const y = (particle.y * makingHeight + time*.012*particle.speed + Math.cos(time*.00018 + index) * 16) % makingHeight;
        makingContext.fillStyle = particle.gold ? "rgba(245,215,150,.56)" : "rgba(181,207,255,.44)";
        makingContext.beginPath();
        makingContext.arc(x, y, particle.size, 0, Math.PI * 2);
        makingContext.fill();
      });
      requestAnimationFrame(drawMakingCanvas);
    };
    resizeMakingCanvas();
    addEventListener("resize", resizeMakingCanvas, { passive:true });
    drawMakingCanvas(0);
  }

  const bassmarker = document.querySelector("[data-bassmarker]");
  let bassmarkerFrame = false;
  const updateBassmarker = () => {
    bassmarkerFrame = false;
    if (!bassmarker) return;
    const rect = bassmarker.getBoundingClientRect();
    const travel = Math.max(bassmarker.offsetHeight - innerHeight, 1);
    const progress = Math.max(0, Math.min(1, -rect.top / travel));
    const easeOut = value => 1 - Math.pow(1 - value, 3);
    const markerProgress = Math.max(0, Math.min(1, (progress - .04) / .54));
    const artProgress = Math.max(0, Math.min(1, (progress - .32) / .34));
    const copyProgress = Math.max(0, Math.min(1, (progress - .5) / .32));
    const timelineExit = Math.max(0, Math.min(1, (progress - .68) / .22));
    const artEase = easeOut(artProgress);
    const copyEase = easeOut(copyProgress);
    bassmarker.style.setProperty("--timeline-scale", (.62 + Math.min(progress / .66, 1) * .42).toFixed(3));
    bassmarker.style.setProperty("--timeline-opacity", `${1 - timelineExit}`);
    bassmarker.style.setProperty("--marker-opacity", markerProgress.toFixed(2));
    bassmarker.style.setProperty("--marker-y", `${-46 + markerProgress * 46}px`);
    bassmarker.style.setProperty("--playhead-x", `${4 + markerProgress * 82}%`);
    bassmarker.style.setProperty("--product-opacity", artProgress.toFixed(2));
    bassmarker.style.setProperty("--art-opacity", artProgress.toFixed(2));
    bassmarker.style.setProperty("--rush-opacity", (artProgress * .56).toFixed(2));
    bassmarker.style.setProperty("--art-y", `${92 - artEase * 92}px`);
    bassmarker.style.setProperty("--copy-opacity", copyProgress.toFixed(2));
    bassmarker.style.setProperty("--copy-y", `${74 - copyEase * 74}px`);
    bassmarker.style.setProperty("--product-scale", (.975 + artEase * .025).toFixed(3));
    bassmarker.style.setProperty("--icon-scale", (.88 + artEase * .12).toFixed(3));
    bassmarker.style.setProperty("--product-pointer", copyProgress > .8 ? "auto" : "none");
  };
  const requestBassmarkerUpdate = () => { if (!bassmarkerFrame) { bassmarkerFrame = true; requestAnimationFrame(updateBassmarker); } };
  addEventListener("scroll", requestBassmarkerUpdate, { passive:true });
  addEventListener("resize", requestBassmarkerUpdate, { passive:true });
  updateBassmarker();
  resize(); addEventListener("resize",resize,{passive:true}); draw(0);
})();
