document.addEventListener('DOMContentLoaded', function() {
document.querySelector('.cta-button').addEventListener('click', function() {
document.querySelector('#contact-form').scrollIntoView({ behavior: 'smooth' });
d});
document.querySelector('#contact-form').addEventListener('submit', function(event) {
event.preventDefault();
v let name = document.getElementById('name').value;
v let email = document.getElementById('email').value;
v let projectType = document.getElementById('project-type').value;
v let budget = document.getElementById('budget').value;
v let message = document.getElementById('message').value;
v alert(`Thank you ${name}, your message has been sent!`);
document.getElementById('contact-form').reset();
d});
d});