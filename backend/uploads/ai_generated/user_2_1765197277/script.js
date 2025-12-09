// script.js
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Basic validation (you can add more robust validation)
            if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
                alert('Please fill in all fields.');
                return;
            }

            // Display a success message (replace with actual submission logic)
            alert('Thank you for your message, ' + name + '! We will get back to you shortly.');

            // Clear the form
            contactForm.reset();
        });
    }

    // Example button click event (on the home page)
    const exploreButton = document.querySelector('.cta-button');
    if (exploreButton) {
        exploreButton.addEventListener('click', function() {
            alert('Explore button clicked!');
            // You can redirect the user to a specific page here
            // window.location.href = 'services.html';
        });
    }
});