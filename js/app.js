import { initRouter } from './router.js';

// Theme toggle functionality
const themeSwitch = document.getElementById('theme-switch');
const htmlElement = document.documentElement;

themeSwitch.addEventListener('change', () => {
    const newTheme = themeSwitch.checked ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);
themeSwitch.checked = savedTheme === 'dark';

// Initialize router
initRouter();
