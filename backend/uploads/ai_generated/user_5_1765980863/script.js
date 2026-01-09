document.addEventListener('DOMContentLoaded', () => {

  // Mobile Menu Toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  // Navbar Scroll Effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
  }

  // Form Submission (Placeholder)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simple validation example
      const name = contactForm.querySelector('#name').value;
      if(name.trim() === '') {
          alert('Please enter your name.');
          return;
      }
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
    });
  }

  // Scroll Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-in').forEach(el => {
    observer.observe(el);
  });

  // Auth Page Tab Switching
  const authTabs = document.querySelector('.auth-tabs');
  if (authTabs) {
    const tabLinks = authTabs.querySelectorAll('.auth-tab-link');
    const tabContents = document.querySelectorAll('.auth-tab-content');

    tabLinks.forEach(link => {
      link.addEventListener('click', () => {
        const tabId = link.getAttribute('data-tab');

        tabLinks.forEach(item => item.classList.remove('active'));
        tabContents.forEach(item => item.classList.remove('active'));

        link.classList.add('active');
        document.getElementById(tabId).classList.add('active');
      });
    });
  }

});
