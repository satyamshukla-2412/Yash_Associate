// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Set current date
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }
});

async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/admin/login.html';
    } catch (e) {
        window.location.href = '/admin/login.html';
    }
}
