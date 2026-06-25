import { initRouter } from './router.js';

// Theme toggle functionality
const themeSwitch = document.getElementById('theme-switch');
const htmlElement = document.documentElement;
const bodyElement = document.body;

function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    bodyElement.setAttribute('data-theme', theme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

if (themeSwitch) {
    themeSwitch.checked = savedTheme === 'dark';
    themeSwitch.addEventListener('change', () => {
        const newTheme = themeSwitch.checked ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Initialize router
initRouter();
