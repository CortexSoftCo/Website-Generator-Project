document.addEventListener('DOMContentLoaded', function() {

    // --- GENERAL UI & ANIMATIONS ---
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });

    // Nav Active Link Indicator
    const navItems = document.querySelectorAll('.nav-item');
    const indicator = document.querySelector('.nav-indicator');

    function updateIndicator() {
        const activeItem = document.querySelector('.nav-item.active');
        if (activeItem && indicator) {
            indicator.style.width = `${activeItem.offsetWidth}px`;
            indicator.style.left = `${activeItem.offsetLeft}px`;
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            updateIndicator();
        });
    });
    window.addEventListener('resize', updateIndicator);
    updateIndicator(); 

    // Intersection Observer for scroll animations
    const scrollElements = document.querySelectorAll('.animate-scroll, .animate-fade-in, .animate-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    scrollElements.forEach(el => observer.observe(el));

    // --- HERO SECTION ---
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: { number: { value: 80, density: { enable: true, value_area: 800 } }, color: { value: '#ec4899' }, shape: { type: 'circle' }, opacity: { value: 0.5, random: false }, size: { value: 3, random: true }, line_linked: { enable: true, distance: 150, color: '#f472b6', opacity: 0.4, width: 1 }, move: { enable: true, speed: 4, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false } },
            interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true }, modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } } },
            retina_detect: true
        });
    }

    // --- FEATURES SECTION ---
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), { max: 15, speed: 400, glare: true, "max-glare": 0.5 });
    }

    // --- ADVENTURE MODAL ---
    const modal = document.getElementById('adventureModal');
    const adventureBtn = document.getElementById('adventureBtn');
    const closeBtn = document.querySelector('.close-btn');

    if (adventureBtn) {
        adventureBtn.onclick = () => { modal.style.display = 'block'; };
        closeBtn.onclick = () => { modal.style.display = 'none'; };
        window.onclick = (event) => { if (event.target == modal) { modal.style.display = 'none'; } };
    }

    // --- DYNAMIC STATS SECTION ---
    const counters = document.querySelectorAll('.counter');
    const speed = 200; 
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target.toLocaleString();
                    }
                };
                updateCount();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));

    // --- GALLERY LIGHTBOX ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            lightboxImg.src = item.querySelector('img').dataset.src;
        });
    });
    if(lightboxClose) lightboxClose.onclick = () => { lightbox.style.display = 'none'; };


    // --- INTERACTIVE CHART ---
    const ctx = document.getElementById('liveChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'User Engagement',
                    data: [65, 59, 80, 81, 56, 95],
                    fill: true,
                    backgroundColor: 'rgba(236, 72, 153, 0.2)',
                    borderColor: 'rgba(236, 72, 153, 1)',
                    tension: 0.4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // --- GAMIFIED LEADERBOARD ---
    const draggableList = document.getElementById('draggable-list');
    if(draggableList) {
        const topInnovators = [
            { name: 'Aether Corp', img: 64 },
            { name: 'Quantum Leap', img: 65 },
            { name: 'Synth AI', img: 91 },
            { name: 'Nova Dynamics', img: 177 },
            { name: 'Helios Systems', img: 203 },
        ];

        let dragStartIndex;

        function createList() {
            [...topInnovators]
                .map(a => ({ value: a, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(a => a.value)
                .forEach((person, index) => {
                    const listItem = document.createElement('li');
                    listItem.setAttribute('data-index', index);
                    listItem.innerHTML = `
                        <i class="fas fa-grip-vertical grab-handle"></i>
                        <img src="https://picsum.photos/id/${person.img}/100/100" alt="${person.name}">
                        <p class="person-name">${person.name}</p>
                    `;
                    draggableList.appendChild(listItem);
                });
             addDragListeners();
        }

        function dragStart() { dragStartIndex = +this.closest('li').getAttribute('data-index'); }
        function dragEnter() { this.classList.add('over'); }
        function dragLeave() { this.classList.remove('over'); }
        function dragOver(e) { e.preventDefault(); }
        function dragDrop() {
            const dragEndIndex = +this.getAttribute('data-index');
            swapItems(dragStartIndex, dragEndIndex);
            this.classList.remove('over');
        }
        function swapItems(from, to) {
            const items = draggableList.querySelectorAll('li');
            const itemOne = items[from].querySelector('.person-name').innerText;
            const itemTwo = items[to].querySelector('.person-name').innerText;
            items[from].querySelector('.person-name').innerText = itemTwo;
            items[to].querySelector('.person-name').innerText = itemOne;
            const imgOne = items[from].querySelector('img').src;
            const imgTwo = items[to].querySelector('img').src;
            items[from].querySelector('img').src = imgTwo;
            items[to].querySelector('img').src = imgOne;
        }
        function addDragListeners() {
            const draggables = draggableList.querySelectorAll('li');
            draggables.forEach(item => {
                item.setAttribute('draggable', true);
                item.addEventListener('dragstart', dragStart);
                item.addEventListener('dragover', dragOver);
                item.addEventListener('drop', dragDrop);
                item.addEventListener('dragenter', dragEnter);
                item.addEventListener('dragleave', dragLeave);
            });
        }
        createList();
    }
    
    // --- CONTACT FORMS ---
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.innerText = 'Sending...';
        // Simulate API call
        setTimeout(() => {
            submitButton.innerText = 'Sent Successfully!';
            submitButton.style.backgroundColor = '#4CAF50'; // Success green
            form.reset();
            setTimeout(() => {
                 submitButton.innerText = 'Send Message';
                 submitButton.style.backgroundColor = 'var(--primary)';
            }, 3000);
        }, 1500);
    };

    const contactFormHome = document.getElementById('contactForm');
    const contactFormPage = document.getElementById('contactFormPage');
    if(contactFormHome) contactFormHome.addEventListener('submit', handleSubmit);
    if(contactFormPage) contactFormPage.addEventListener('submit', handleSubmit);

});