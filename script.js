/* ============================================================
   NAEMA OMAR — SINGLE PAGE PORTFOLIO  |  script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. NAVBAR — scroll effect & active link highlight
  ---------------------------------------------------------- */
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    // Scrolled class (background blur)
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Active link
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const bot = top + sec.offsetHeight;
      const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (link) {
        link.classList.toggle('active-link', scrollY >= top && scrollY < bot);
      }
    });
  }

  window.addEventListener('scroll', updateNavbar);
  updateNavbar(); // run once on load


  /* ----------------------------------------------------------
     2. HAMBURGER MENU
  ---------------------------------------------------------- */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    const spans  = hamburger.querySelectorAll('span');

    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });


  /* ----------------------------------------------------------
     3. REVEAL ON SCROLL (IntersectionObserver)
  ---------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly for a cascade effect
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const index    = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(el => revealObserver.observe(el));


  /* ----------------------------------------------------------
     4. SKILL BARS — animate width on scroll
  ---------------------------------------------------------- */
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width  = target.getAttribute('data-width');
        if (width) {
          // Small delay so the reveal animation finishes first
          setTimeout(() => {
            target.style.width = width + '%';
          }, 200);
        }
        skillObserver.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(bar => skillObserver.observe(bar));


  /* ----------------------------------------------------------
     5. PORTFOLIO FILTER
  ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.pf-btn');
  const portCards  = document.querySelectorAll('.port-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-f');

      portCards.forEach(card => {
        const cats = card.getAttribute('data-cat') || '';
        const show = (filter === 'all') || cats.split(' ').includes(filter);

        if (show) {
          card.style.display   = '';
          card.style.opacity   = '0';
          card.style.transform = 'scale(0.95)';
          // Fade back in
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              card.style.opacity    = '1';
              card.style.transform  = '';
            });
          });
        } else {
          card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          card.style.opacity    = '0';
          card.style.transform  = 'scale(0.95)';
          setTimeout(() => {
            if (!show) card.style.display = 'none';
          }, 260);
        }
      });
    });
  });


  /* ----------------------------------------------------------
     6. CONTACT FORM — simulated submit
  ---------------------------------------------------------- */
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('successMsg');

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      // Basic validation — check all inputs & textarea
      const inputs = document.querySelectorAll('.contact-form-wrap input, .contact-form-wrap textarea');
      let allFilled = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          allFilled = false;
          input.style.borderColor = '#e85d5d';
          setTimeout(() => { input.style.borderColor = ''; }, 2000);
        }
      });

      if (!allFilled) return;

      // Loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled  = true;

      // Simulate async send
      setTimeout(() => {
        submitBtn.innerHTML  = '<i class="fas fa-check"></i> Message Sent!';
        successMsg.style.display = 'block';

        // Reset after 5s
        setTimeout(() => {
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          submitBtn.disabled  = false;
          successMsg.style.display = 'none';
          inputs.forEach(i => { i.value = ''; });
        }, 5000);
      }, 1600);
    });
  }


 /* ----------------------------------------------------------
   7. CV DOWNLOAD BUTTON
---------------------------------------------------------- */
const cvBtn = document.getElementById('cvDownloadBtn');

// Path to the CV file (file is in project root)
const cvPath = 'Naema_cv.pdf';

if (cvBtn) {
  cvBtn.addEventListener('click', (e) => {
    // Trigger a download using an anchor with the `download` attribute.
    // This prefers downloading the file; if the browser ignores `download`
    // it will open the PDF in a new tab because of `target = '_blank'`.
    const a = document.createElement('a');
    a.href = cvPath;
    a.setAttribute('download', 'Naema_Omar_CV.pdf');
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}


  /* ----------------------------------------------------------
     8. SMOOTH SCROLL — polyfill for older browsers
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ----------------------------------------------------------
     9. HERO STATS — count-up animation
  ---------------------------------------------------------- */
  function countUp(el, target, suffix, duration) {
    let start     = 0;
    const step    = target / (duration / 16);
    const counter = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target + suffix;
        clearInterval(counter);
      } else {
        el.textContent = Math.floor(start) + suffix;
      }
    }, 16);
  }

  const statsData = [
    { selector: '.hero-stats .stat:nth-child(1) .stat-num', target: 3,  suffix: '+' },
    { selector: '.hero-stats .stat:nth-child(3) .stat-num', target: 20, suffix: '+' },
    { selector: '.hero-stats .stat:nth-child(5) .stat-num', target: 15, suffix: '+' },
  ];

  // Only run once when hero is in view
  const heroSection = document.getElementById('home');
  let statsDone = false;

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsDone) {
        statsDone = true;
        statsData.forEach(({ selector, target, suffix }) => {
          const el = document.querySelector(selector);
          if (el) countUp(el, target, suffix, 1200);
        });
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });

  if (heroSection) heroObserver.observe(heroSection);

}); // end DOMContentLoaded
