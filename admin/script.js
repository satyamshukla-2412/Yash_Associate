// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Set current date
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }
});

function logout() {
    // Basic Auth logout is tricky, but sending a request with wrong credentials clears it in most modern browsers.
    // However, the cleanest way to force a logout with HTTP Basic Auth is to redirect to the same URL with intentionally invalid credentials.
    window.location.href = 'https://logout@' + window.location.host + '/admin';
}
