(function(){
  "use strict";

  /* ===== SPLASH SCREEN ===== */
  var site = document.getElementById('site');
  var splash = document.getElementById('splash');
  setTimeout(function(){
    splash.classList.add('gone');
    site.classList.add('ready');
    setTimeout(function(){
      splash.style.display = 'none';
      site.style.filter = 'none';
    }, 600);
  }, 3100);

  /* ===== PAGE NAVIGATION SYSTEM ===== */
  var pageIdMap = {
    hero: 'page-home', awards: 'page-awards', bio: 'page-bio',
    performances: 'page-performances', videos: 'page-videos', pitch: 'page-pitch',
    gallery: 'page-gallery', credentials: 'page-credentials', contact: 'page-contact'
  };
  var allPages = document.querySelectorAll('.page');

  function goToPage(key){
    var targetId = pageIdMap[key];
    if(!targetId) return;
    allPages.forEach(function(p){ p.classList.remove('on'); });
    var target = document.getElementById(targetId);
    if(target) target.classList.add('on');
    window.scrollTo({top:0, behavior:'instant'});
    setTimeout(observeReveals, 60);
  }
  window.goToPage = goToPage;

  document.querySelectorAll('[data-goto]').forEach(function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();
      goToPage(el.getAttribute('data-goto'));
    });
  });

  /* ===== LANGUAGE SWITCH ===== */
  var langBtns = document.querySelectorAll('.lang-btn');
  function applyLang(lang){
    document.documentElement.setAttribute('data-lang', lang);
    langBtns.forEach(function(b){
      b.classList.toggle('active', b.getAttribute('data-set-lang') === lang);
    });
  }
  langBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      var lang = btn.getAttribute('data-set-lang');
      applyLang(lang);
      try{ localStorage.setItem('pmd_lang', lang); }catch(e){}
      buildRibbon();
    });
  });
  (function(){
    try{
      var saved = localStorage.getItem('pmd_lang');
      if(saved === 'pt' || saved === 'en'){ applyLang(saved); }
    }catch(e){}
  })();

  /* ===== TOPBAR SCROLL BEHAVIOUR ===== */
  var topbar = document.getElementById('topbar');
  var ribbonEl = document.querySelector('.ribbon');
  function syncRibbonPosition(){
    if(ribbonEl) ribbonEl.style.top = topbar.getBoundingClientRect().height + 'px';
  }
  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    var isScrolled = y > 60;
    topbar.classList.toggle('scrolled', isScrolled);
    syncRibbonPosition();
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', syncRibbonPosition);
  onScroll();
  setTimeout(syncRibbonPosition, 50);
  setTimeout(syncRibbonPosition, 350);

  /* ===== HAMBURGER / FULLSCREEN MENU ===== */
  var burgerBtn = document.getElementById('burger-btn');
  var menuOverlay = document.getElementById('menu-overlay');
  function openMenu(){
    menuOverlay.classList.add('open');
    burgerBtn.classList.add('open');
    burgerBtn.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    menuOverlay.classList.remove('open');
    burgerBtn.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  }
  burgerBtn.addEventListener('click', function(){
    if(menuOverlay.classList.contains('open')) closeMenu(); else openMenu();
  });
  document.querySelectorAll('.menu-links a, .menu-side a').forEach(function(a){
    a.addEventListener('click', function(){ closeMenu(); });
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ closeMenu(); closeLightbox(); }
  });

  /* ===== MUSIC PLAYER ===== */
  var musicBtn = document.getElementById('music-toggle-btn');
  var musicPop = document.getElementById('music-pop');
  var volRange = document.getElementById('vol-range');
  var audio1 = document.getElementById('audio-track-1');
  var audio2 = document.getElementById('audio-track-2');
  var tracks = document.querySelectorAll('.music-pop .track');
  var currentAudio = null;
  var currentTrackId = null;

  audio1.volume = 0.5; audio2.volume = 0.5;

  musicBtn.addEventListener('click', function(e){
    e.stopPropagation();
    musicPop.classList.toggle('open');
  });
  document.addEventListener('click', function(e){
    if(!musicPop.contains(e.target) && e.target !== musicBtn){
      musicPop.classList.remove('open');
    }
  });

  function stopAll(){
    audio1.pause(); audio2.pause();
    musicBtn.classList.remove('playing');
    tracks.forEach(function(t){ t.classList.remove('active'); });
  }

  tracks.forEach(function(trackEl){
    trackEl.addEventListener('click', function(){
      var id = trackEl.getAttribute('data-track');
      var target = id === '1' ? audio1 : audio2;

      if(currentTrackId === id && currentAudio && !currentAudio.paused){
        stopAll();
        currentAudio = null;
        currentTrackId = null;
        return;
      }
      stopAll();
      var srcEl = target.querySelector('source');
      if(srcEl && srcEl.getAttribute('src')){
        target.play().catch(function(){});
      }
      currentAudio = target;
      currentTrackId = id;
      musicBtn.classList.add('playing');
      trackEl.classList.add('active');
    });
  });

  volRange.addEventListener('input', function(){
    var v = parseFloat(volRange.value);
    audio1.volume = v; audio2.volume = v;
  });

  /* ===== GOLD RIBBON TICKER CONTENT ===== */
  var ribbonItems = [
    {en:"NYMA 2026 — Grand Prize, Opera", pt:"NYMA 2026 — Grande Prémio de Ópera"},
    {en:"Platinum Prize, Professional", pt:"Prémio Platina, Profissional"},
    {en:"Voice Winners 2025 — Gold Prize", pt:"Voice Winners 2025 — Prémio de Ouro"},
    {en:"Tizziano Rosetti 2024 — First Prize, Lugano", pt:"Tizziano Rosetti 2024 — 1º Prémio, Lugano"},
    {en:"D.M.A. — Rutgers University", pt:"Doutoramento — Rutgers University"},
    {en:"Lincoln Center · Carnegie Weill Hall", pt:"Lincoln Center · Carnegie Weill Hall"},
    {en:"Teatro Nacional de São Carlos", pt:"Teatro Nacional de São Carlos"},
    {en:"Available for 2026/27 Season Bookings", pt:"Disponível para Contratos na Temporada 2026/27"}
  ];
  var ribbonTrack = document.getElementById('ribbon-track');
  function buildRibbon(){
    var lang = document.documentElement.getAttribute('data-lang') || 'en';
    var html = '';
    for(var rep=0; rep<2; rep++){
      ribbonItems.forEach(function(item){
        html += '<span>' + (lang === 'pt' ? item.pt : item.en) + '</span>';
      });
    }
    ribbonTrack.innerHTML = html;
  }
  buildRibbon();

  /* ===== COMPETITIONS DETAIL TOGGLE (dentro da página awards) ===== */
  var compDetail = document.getElementById('competitions-detail');
  var awardsSection = document.getElementById('awards');
  var compCards = document.querySelectorAll('[data-open-comp]');
  var backLink = document.getElementById('back-to-awards');

  compCards.forEach(function(card){
    card.addEventListener('click', function(){
      var key = card.getAttribute('data-open-comp');
      awardsSection.style.display = 'none';
      compDetail.classList.add('open');
      var target = document.getElementById('comp-' + key);
      window.scrollTo(0,0);
      if(target){
        setTimeout(function(){ target.scrollIntoView({behavior:'instant', block:'start'}); }, 30);
      }
      setTimeout(observeReveals, 60);
    });
  });

  if(backLink){
    backLink.addEventListener('click', function(e){
      e.preventDefault();
      compDetail.classList.remove('open');
      awardsSection.style.display = '';
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }

  /* ===== YOUTUBE GRID — lazy load iframe on poster click ===== */
  document.querySelectorAll('[data-poster]').forEach(function(poster){
    poster.addEventListener('click', function(){
      var frame = poster.closest('.yt-frame') || poster.closest('.video-frame-inner');
      var iframe = frame ? frame.querySelector('[data-yt], #yt-iframe') : null;
      if(iframe){
        var src = iframe.getAttribute('data-src');
        if(src && !iframe.getAttribute('src')){
          iframe.setAttribute('src', src + (src.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1');
        }
      }
      poster.classList.add('hidden');
    });
  });

  /* ===== LIGHTBOX ===== */
  window.openLightbox = function(src){
    var lb = document.getElementById('lightbox');
    var img = document.getElementById('lightbox-img');
    img.src = src;
    lb.classList.add('open');
  };
  window.closeLightbox = function(){
    document.getElementById('lightbox').classList.remove('open');
  };
  document.querySelectorAll('.cert-card img').forEach(function(img){
    img.addEventListener('click', function(e){
      e.stopPropagation();
      openLightbox(img.src);
    });
  });

  /* ===== GALLERY DRAG-TO-SCROLL ===== */
  var galleryWrap = document.getElementById('gallery-track-wrap');
  if(galleryWrap){
    var isDown = false, startX, scrollLeft;
    galleryWrap.addEventListener('mousedown', function(e){
      isDown = true;
      galleryWrap.classList.add('dragging');
      startX = e.pageX - galleryWrap.offsetLeft;
      scrollLeft = galleryWrap.scrollLeft;
    });
    ['mouseleave','mouseup'].forEach(function(evt){
      galleryWrap.addEventListener(evt, function(){
        isDown = false;
        galleryWrap.classList.remove('dragging');
      });
    });
    galleryWrap.addEventListener('mousemove', function(e){
      if(!isDown) return;
      e.preventDefault();
      var x = e.pageX - galleryWrap.offsetLeft;
      var walk = (x - startX) * 1.4;
      galleryWrap.scrollLeft = scrollLeft - walk;
    });
  }

  /* ===== SCROLL REVEAL ===== */
  var io = null;
  if('IntersectionObserver' in window){
    io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
  }
  function observeReveals(){
    var els = document.querySelectorAll('.reveal:not(.in)');
    if(io){
      els.forEach(function(el){ io.observe(el); });
    } else {
      els.forEach(function(el){ el.classList.add('in'); });
    }
  }
  observeReveals();

})();
