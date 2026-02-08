// Main JS file

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  const articles = [
    "https://arstechnica.com/gadgets/2026/02/ram-shortage-delays-valves-steam-machine/",
    "https://arstechnica.com/gadgets/2026/02/netflix-claims-subscribers-will-get-more-content-for-less-if-it-buys-hbo-max/",
    "https://arstechnica.com/gadgets/2026/02/adobe-reverses-decision-to-discontinue-animate-after-a-lot-of-confusion-and-angst/",
    "https://arstechnica.com/gadgets/2026/02/original-nintendo-switch-passes-the-ds-to-become-nintendos-bestselling-console/"
  ];

  const innerContainer = document.querySelector('#carousel-inner');
  const indicatorContainer = document.querySelector('#carousel-indicators');

  async function buildCarousel() {
    for (let i = 0; i < articles.length; i++) {
      try {
        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(articles[i])}`);
        const { data } = await response.json();

        const imageUrl = data.image?.url || "https://via.placeholder.com/1200x600?text=Ars+Technica";
        
        // The first item MUST have the 'active' class
        const activeClass = i === 0 ? "active" : "";

        // 1. Add Indicator dot
        indicatorContainer.innerHTML += `
          <button type="button" data-bs-target="#blogCarousel" data-bs-slide-to="${i}" 
            class="${activeClass}" aria-label="Slide ${i + 1}"></button>
        `;

        // 2. Add Slide content
        innerContainer.innerHTML += `
          <div class="carousel-item ${activeClass}" data-bs-interval="5000">
            <a href="${articles[i]}" target="_blank">
              <div class="position-relative" style="height: 500px;">
                <img src="${imageUrl}" class="d-block w-50 h-100 mx-auto" style="object-fit: cover;" alt="Cover">
                <div class="carousel-caption w-50 mx-auto d-none d-md-block" style="background: rgba(0,0,0,0.6); padding: 20px;">
                  <h5 class="fw-bold">${data.title}</h5>
                  <p class="small text-truncate">${data.description || ''}</p>
                </div>
              </div>
            </a>
          </div>
        `;
      } catch (err) {
        console.error("Error loading slide:", err);
      }
    }
  }

buildCarousel();

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: false,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
      contentType: 'html'
    });
  }

  function updateTime() {
    const now = new Date();

    const options = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Toronto' };
    const formattedTime = now.toLocaleTimeString('en-US', options); 

    document.getElementById("local-clock").textContent = formattedTime;
  }

  updateTime(); 

  setInterval(updateTime, 1000);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();