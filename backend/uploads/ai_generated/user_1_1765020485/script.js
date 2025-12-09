// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Optional: Add particle animation to the hero section
// This would require a particle library like particles.js
// Example:
// particlesJS.load('hero', 'particles.json', function() {
//   console.log('callback - particles.js config loaded');
// });

// Basic form validation (client-side)
const contactForm = document.querySelector('#contact form');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        const nameInput = document.querySelector('#name');
        const emailInput = document.querySelector('#email');

        if (!nameInput.value || !emailInput.value) {
            alert('Please fill in all required fields.');
            event.preventDefault(); // Prevent form submission
        }
    });
}
