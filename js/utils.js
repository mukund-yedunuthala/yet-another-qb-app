export function escHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function showError(message) {
    const content = document.getElementById('app-content');
    const existing = content.querySelector('.error-message');
    if (existing) existing.remove();
    const el = document.createElement('p');
    el.className = 'error-message';
    el.setAttribute('role', 'alert');
    el.textContent = message;
    content.prepend(el);
    setTimeout(() => el.remove(), 5000);
}
